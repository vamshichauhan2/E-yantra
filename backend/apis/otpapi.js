import express from 'express'; 
import bcrypt from 'bcrypt';
import nodemailer from 'nodemailer';
import dotenv from "dotenv"; 
import User from '../Schema/user.js';
import Otp from '../Schema/otp.js';

dotenv.config();

const router = express.Router();

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL,
    pass: process.env.EMAIL_PASS,
  },
});

const OTP_VALIDITY_DURATION_MS = 10 * 60 * 1000; // 10 minutes

const generateOTP = () => Math.floor(100000 + Math.random() * 900000).toString();

router.post('/check-user-exists', async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ instituteemail: email });
    res.json({ exists: !!user });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});
router.post('/Change-Password/send-otp', async (req, res) => {
  try {
    const { email } = req.body;
    const lastOtp = await Otp.findOne({ email });

    if (lastOtp && (Date.now() - new Date(lastOtp.createdAt).getTime() < OTP_VALIDITY_DURATION_MS)) {
      return res.status(429).json({ message: 'OTP already sent. Please wait before requesting another.' });
    }

    const code = generateOTP();
    const hashedCode = await bcrypt.hash(code, 10);

    await Otp.findOneAndUpdate(
      { email },
      { code: hashedCode, createdAt: new Date() },
      { upsert: true }
    );

    await transporter.sendMail({
      from: process.env.EMAIL,
      to: email,
      subject: 'Your OTP CODE',
      text: `Your One-Time Password (OTP) is: ${code}`,
      html: `
        <div>
          <h4>Your OTP Code</h4>
          <p>Please use the following code to verify your account:</p>
          <h1>${code}</h1>
          <p>This code will expire in <b>10 minutes</b>. Do not share it with anyone.</p>
          <br/>
          <small>If you didn’t request this, please ignore this email.</small>
        </div>
      `
    });

    res.status(200).json({ message: 'OTP sent to your email.' });
  } catch (error) {
    //console.error('OTP Send Error:', error);
    res.status(500).json({ message: 'Error sending OTP' });
  }
});

router.post('/change-password/byoldpassword', async (req, res) => {
  const { email, oldPassword, newPassword } = req.body;
  

  if (!email || !oldPassword || !newPassword) {
    return res.json({ success: false, message: 'Email, old password, and new password are required.' });
  }

  try {
    const user = await User.findOne({ instituteemail:email });
    if (!user) {
      return res.json({ success: false, message: 'User not found.' });
    }

    const isMatch = await bcrypt.compare(oldPassword, user.password);
    if (!isMatch) {
      return res.json({ success: false, message: 'Old password is incorrect.' });
    }

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(newPassword, salt);
    await user.save();

    res.json({ success: true, message: 'Password changed successfully!' });
  } catch (err) {
    res.json({ success: false, message: 'Server error. Please try again.' });
  }
});
router.post('/change-password', async (req, res) => {
  const { email, newPassword } = req.body;
  
  if (!email || !newPassword) {
    return res.json({ success: false, message: 'Email and new password are required.' });
  }
  try {
    const user = await User.findOne({ instituteemail:email });
    if (!user) {
      return res.json({ success: false, message: 'User not found.' });
    }

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(newPassword, salt);
    await user.save();

    res.json({ success: true, message: 'Password changed successfully!' });
  } catch (err) {
    res.json({ success: false, message: 'Server error. Please try again.' });
  }
});


router.post('/send-otp', async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) return res.status(400).json({ message: 'Email is required' });

    const isExist = await User.findOne({ instituteemail: email });
    if (isExist) {
      return res.status(401).json({ message: 'Email Already exists. Please try with another Email' });
    }

    const lastOtp = await Otp.findOne({ email });

    if (lastOtp && (Date.now() - new Date(lastOtp.createdAt).getTime() < OTP_VALIDITY_DURATION_MS)) {
      return res.status(429).json({ message: 'OTP already sent. Please wait before requesting another.' });
    }

    const code = generateOTP();
    const hashedCode = await bcrypt.hash(code, 10);

    await Otp.findOneAndUpdate(
      { email },
      { code: hashedCode, createdAt: new Date() },
      { upsert: true }
    );

    await transporter.sendMail({
      from: process.env.EMAIL,
      to: email,
      subject: 'Your OTP CODE',
      text: `Your One-Time Password (OTP) is: ${code}`,
      html: `
        <div>
          <h4>Your OTP Code</h4>
          <p>Please use the following code to verify your account:</p>
          <h1>${code}</h1>
          <p>This code will expire in <b>10 minutes</b>. Do not share it with anyone.</p>
          <br/>
          <small>If you didn’t request this, please ignore this email.</small>
        </div>
      `
    });

    res.status(200).json({ message: 'OTP sent to your email.' });
  } catch (error) {
    //console.error('OTP Send Error:', error);
    res.status(500).json({ message: 'Error sending OTP' });
  }
});

router.post('/verify-otp', async (req, res) => {
  try {
    const { email, otp } = req.body;
    if (!email || !otp) return res.status(400).json({ message: 'Email and OTP are required' });

    const validOtp = await Otp.findOne({ email });

    if (!validOtp) {
      return res.status(400).json({ message: 'OTP not found or expired' });
    }

   
    if (Date.now() - new Date(validOtp.createdAt).getTime() > OTP_VALIDITY_DURATION_MS) {
      await Otp.deleteMany({ email });  // Clean up expired OTPs
      return res.status(400).json({ message: 'OTP expired' });
    }

    const verify = await bcrypt.compare(otp, validOtp.code);

    if (!verify) {
      return res.status(401).json({ message: 'Invalid OTP' });
    }

    await Otp.deleteMany({ email });
    res.status(200).json({ success: true, message: 'OTP verified successfully' });
  } catch (error) {
    //console.error('OTP Verify Error:', error);
    res.status(500).json({ message: 'Error verifying OTP' });
  }
});


router.post('/accept/:email', async (req, res) => {
  try {
    const { email } = req.params;

    const user = await User.findOneAndUpdate(
      { instituteemail: email },
      { verified: true },
      { new: true }
    );

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

  
    await transporter.sendMail({
      from: process.env.EMAIL,
      to: email,
      subject: 'Congratulations',
      text: `Your request has been accepted by Admin. You can now join.`,
      html: `
        <div>
          <h4>Request Accepted</h4>
          <p>Your request has been accepted by Admin. You can login now into eyantra club.</p>
          <br/>
          <small>Thank you for your patience.</small>
        </div>
      `
    });

   
    req.io.emit('user-request-status', { type: 'accept', user });

    res.status(200).json({ message: 'User accepted successfully', user });

  } catch (error) {
    //console.error('Error:', error);
    res.status(500).json({ message: 'Error accepting user' });
  }
});


router.post('/reject/:email', async (req, res) => {
  try {
    const { email } = req.params;

    const user = await User.findOneAndDelete({ instituteemail: email });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    await transporter.sendMail({
      from: process.env.EMAIL,
      to: email,
      subject: 'Request Rejected',
      text: `Your request has been rejected by Admin.`,
      html: `
        <div>
          <h4>Request Rejected</h4>
          <p>Your request has been rejected by Admin.</p>
          <br/>
          <small>Thank you for your interest.</small>
        </div>
      `
    });

    // Emit socket event to update frontend
    req.io.emit('user-request-status', { type: 'reject', user });

    res.status(200).json({ message: 'User rejected successfully', user });

  } catch (error) {
    //console.error('Error:', error);
    res.status(500).json({ message: 'Error rejecting user' });
  }
});

router.get('/get/username/:id', async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('Fullname'); 
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.status(200).json(user.Fullname); 
  } catch (err) {
    
    res.status(500).json({ message: 'Server error' });
  }
});


router.get('/stats', async (req, res) => {
  try {
    const totalUsers = await User.countDocuments({});
    const totalAdmins = await User.countDocuments({ role: 'admin' });
    const totalSecretaries = await User.countDocuments({ role: 'secretary' });
    const totalJointSecretaries = await User.countDocuments({ role: 'jointSecretary' });
  

    res.status(200).json({
      totalUsers,
      totalAdmins,
      totalSecretaries,
      totalJointSecretaries
    });
  } catch (err) {
    //console.error(err);
    res.status(500).json({ message: 'Server Error' });
  }
});

export default router;
