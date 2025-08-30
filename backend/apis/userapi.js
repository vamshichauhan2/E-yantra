import express from 'express'; 
import bcrypt from 'bcryptjs'; 

import dotenv from 'dotenv';
dotenv.config();


const router = express.Router();
import { Buffer } from 'node:buffer';

import crypto from 'crypto';

import User from '../Schema/user.js';

const algorithm = 'aes-256-cbc';

if (!process.env.SECRET_KEY) {
  throw new Error("SECRET_KEY is undefined. Please set it in your .env file.");
}
const secret = Buffer.from(process.env.SECRET_KEY, 'hex');


function decrypt(encryptedText) {
  const [ivHex, encrypted] = encryptedText.split(':');
  const iv = Buffer.from(ivHex, 'hex');
  const decipher = crypto.createDecipheriv(algorithm, secret, iv);
  let decrypted = decipher.update(encrypted, 'hex', 'utf8');
  decrypted += decipher.final('utf8');
  return decrypted;
}
function encrypt(text) {
  const iv = crypto.randomBytes(16);
  const cipher = crypto.createCipheriv(algorithm, secret, iv);
  let encrypted = cipher.update(text, 'utf8', 'hex');
  encrypted += cipher.final('hex');
  return iv.toString('hex') + ':' + encrypted;
}

router.delete('/delete/all/user', async (req, res) => {
  try {
    const { email, password } = req.body;
    const COORDINATOR_EMAIL = "flowfix07@gmail.com";
   

    if (email !== COORDINATOR_EMAIL ) {
      
      return res.status(401).json({ message: "Unauthorized: Invalid email or password" });
      
    }
    
    const response1 = await User.findOne({ instituteemail: email });
   if (!response1 ) {
    
      return res.status(401).json({ message: "Unauthorized: Invalid email or password" });
    }
     const isMatch = await bcrypt.compare(password,response1.password);
    
     if(!isMatch){
      return res.status(401).json({ message: "Unauthorized: Invalid email or password" });
 
     }

    

    // Delete all users except the coordinator
    const response = await User.deleteMany({ email: { $ne: COORDINATOR_EMAIL } });
    

    res.status(200).json({ message: 'All other users deleted successfully', deletedCount: response.deletedCount });
  } catch (error) {
   
    res.status(500).json({ message: 'Failed to delete users', error });
  }
});


 router.get('/decrypt/:storedToken',async(req,res)=>{
    const {storedToken}=req.params;
    


    const decryptedId = decrypt(storedToken);
    res.status(200).json(decryptedId)

 })

router.post('/login/user', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user
    const userData = await User.findOne({ instituteemail: email });
    if (!userData) return res.status(404).json({ error: 'Email not found' });
    if (!userData.verified) return res.status(402).json({ error: 'Person is Not Verified' });

    // Compare password
    const isMatch = await bcrypt.compare(password, userData.password);
    if (!isMatch) return res.status(401).json({ error: 'Incorrect password' });

    // Update online status
    await User.findByIdAndUpdate(userData._id, { isOnline: true });

    // Encrypt user ID
    const encryptedId = encrypt(userData._id.toString());

    res.status(200).json({
      role: userData.role,
      Id: encryptedId,
      userName: userData.userName,
      isOnline: userData.isOnline
    });

  } catch (error) {
   
    res.status(500).json({ error: 'Server error during login' });
  }
});



router.post('/register/user', async (req, res) => {
    const { formData, role } = req.body;
    const { email, password, name, year, phone,  rePassword } = formData;
   const regex = /^[a-zA-Z0-9._%+-]+@student\.nitandhra\.ac\.in$/;
    if (rePassword !== password) {
        return res.status(400).json({ message: "Password mismatch" });
    }
    
    try {
        // Use correct field from schema
        const existingUser = await User.find({ instituteemail: email, role: role });

        if (existingUser.length > 0) {
            return res.status(400).json({ message: "User already exists with same role and email" });
        }
        const salt = await bcrypt.genSalt(10);
        const bcryptpassword = await bcrypt.hash(password, salt);
        let verified
        if(email!==process.env.EMAIL){
            verified=false;
            
        }else if (regex.test(email)){
  res.status(400).json({failed:"Email Invalid Format"})
}

        else{
            verified=true;
        }
        
        const newUser = new User({
            Fullname: name,
            instituteemail: email,
            password:bcryptpassword, 
            year,
            mobile: phone,
            verified,
            role,
        });

        await newUser.save();
        req.io.emit('new-user-request', { type: 'register', user:newUser  });
        return res.status(200).json({ message: 'Successfully Registered' });

    } catch (err) {
        
        return res.status(500).json({ message: "Internal Server Error" });
    }
});


router.get('/VerifyEmail/:email/:role', async (req, res) => {
    const { email, role } = req.params;
   

    try {
        

        const user = await User.findOne({ studentemail: email, role: role });
        if (user) {
            res.status(200).json({ message: "UserFound" });
           

        } else {
            res.status(404).json({ message: "Not Found" });
            
        }
    } catch (err) {
       
        res.status(500).json({ error: "Server Error" });
    }
});

router.get('/get/unverified/user',async(req,res)=>{
     try{
        const response=await User.find({verified:false}).select('Fullname instituteemail -_id'); 
        if(response){
            return res.status(200).json(response)
        }


    }catch(err){
        return res.status(500).json({errorMsg:'Server Error'})

    }
})

export default router
