import express from 'express';
const router=express.Router();
import Team from '../Schema/team.js';


router.post('/add/newMember', async (req, res) => {
  const { name,gender, email, role, studyYear, phone, bio, batch, imageUrl } = req.body;
    const regex = /^[a-zA-Z0-9._%+-]+@student\.nitandhra\.ac\.in$/;
  const indianPhoneRegex = /^[6-9]\d{9}$/;

   if (regex.test(email) || email==="eyantraclub@nitandhra.ac.in"){
  res.status(400).json({failed:"Email Invalid Format"})
     return;
}
  if(!indianPhoneRegex.test(phone)) {
    res.status(400).json({failed:" Invalid Format of format mobile Number"})
    return;
}

  try {
    const newMember = new Team({
  FullName: name,
  Gender:gender,
  InstituteEmail: email,
  role,
  studyyear: studyYear,
  mobile: phone,
  bio,
  imageUrl, // saving Cloudinary URL here
  from: Date.now(),
  to: null,
  isActive: true,
  batch,
});

const result=await newMember.save();

res.status(200).json({ msg: 'Successfully Added' });

  } catch (err) {
    
    res.status(500).json({ msg: 'Internal Server Error' });
  }
});

router.post('/updateMember/:Id',async(req,res)=>{
    

})
router.delete('/delete/teamMember/:email', async (req, res) => {
  
  try {
    const {email } = req.params;
    const deletedResource = await Team.findOneAndDelete({InstituteEmail:email});
 

    if (!deletedResource) {
      return res.status(404).json({ message: 'Resource not found' });
    }

    res.status(200).json({ message: 'Resource deleted successfully' });
  } catch (error) {
    
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

router.get('/Get/All/Teams/Members',async(req,res)=>{
    try{
        const response=await Team.find();
        if(response){
            res.status(200).json(response)
        }
    }catch(err){
        res.status(500).json({msg:'Internal Server error'})
    }

})
export default router
