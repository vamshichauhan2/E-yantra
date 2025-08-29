import React, { useState } from 'react';
import axios from 'axios';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
const API_BASE = import.meta.env.MODE === 'production'
  ? "https://eynatranitandhra.onrender.com"
  : import.meta.env.VITE_API_URL;

import './changePassword.css'


const ChangePassword = () => {
  const [step, setStep] = useState('login'); // 'login', 'forgot-email', 'otp', 'reset-password', 'done'
  const [email, setEmail] = useState('');
  const [oldPassword, setOldPassword] = useState('');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [message, setMessage] = useState('');
   const [showPassword, setShowPassword] = useState(false); 
  

  // Handle direct change password with email and old password
  const handleDirectChange = async (e) => {
    e.preventDefault();
    setMessage('');
    if (!email || !oldPassword) {
      setMessage('Email and old password are required.');
      return;
    }
    try {
      const res = await axios.post(`${API_BASE}/api/change-password/byoldpassword`, { email, oldPassword, newPassword: oldPassword }); 
      // Adjust backend API that verifies old password and changes it to the newPassword (here oldPassword as newPassword to simulate direct change)
      if (res.data.success) {
        setMessage('Password changed successfully!');
        setStep('done');
      } else {
        setMessage(res.data.message || 'Invalid email or password.');
      }
    } catch (err) {
      setMessage('Server error. Please try again.');
    }
  };

  // Handle sending OTP for forgot password
  const handleSendOtp = async (e) => {
    e.preventDefault();
    setMessage('');
    
    if (!email) {
      setMessage('Email is required to send OTP.');
      return;
    }
  
    try {
      // Call backend API to check if user exists before sending OTP
      const checkRes = await axios.post(`${API_BASE}/api/check-user-exists`, { email });
  
      if (!checkRes.data.exists) {
        setMessage('User with this email does not exist.Please Register');
        return;
      }
      const otpRes = await axios.post(`${API_BASE}/api/Change-Password/send-otp`, { email });
      setMessage(otpRes.data.message || 'OTP sent to your email.');
      setStep('otp');
  
    } catch (err) {
      setMessage('Error with OTP process. Please try later.');
    }
  };
  
  // Handle OTP verification
  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    setMessage('');
    if (!otp) {
      setMessage('Please enter the OTP.');
      return;
    }
    try {
      const res = await axios.post(`${API_BASE}/api/verify-otp`, { email, otp });
      if (res.data.success) {
        setMessage('OTP verified! Now enter your new password.');
        setStep('reset-password');
      } else {
        setMessage(res.data.message || 'OTP verification failed.');
      }
    } catch (err) {
      setMessage('Error verifying OTP. Please try again.');
    }
  };

  // Handle new password submission after OTP verified
  const handleResetPassword = async (e) => {
    e.preventDefault();
    setMessage('');
    if (!newPassword) {
      setMessage('Please enter a new password.');
      return;
    }
    try {
      const res = await axios.post(`${API_BASE}/api/change-password`, { email, newPassword });
      if (res.data.success) {
        setMessage('Password changed successfully!');
        setStep('done');
      } else {
        setMessage(res.data.message || 'Password change failed.');
      }
    } catch (err) {
      setMessage('Server error. Please try again.');
    }
  };

  return (
    <div className='passwordinner-Page'>
      <h2 className='password-section-h2'>Change Password</h2>
      {message && <p className='password-section-p'>{message}</p>}

      {step === 'login' && (
        <form className='password-change-form' onSubmit={handleDirectChange}>
          <div className='password-change-form-group'>
            <label className='Changepasswordchange-label'>Email</label><br />
            <input placeholder="please enter email"className='Changepassword-input' type="email" value={email} onChange={e => setEmail(e.target.value)} required />
           
          </div>
          <div className='password-change-form-group'>
            <label className='Changepasswordchange-label'>Old Password</label><br />
            <input  placeholder='please enter old Password'className='Changepassword-input'  type={showPassword ? "text" : "password"} value={oldPassword} onChange={e => setOldPassword(e.target.value)} required />
            <span
                                                onClick={() => setShowPassword(!showPassword)}
                                                className='eye-icon'
                                              >
                                                {showPassword ? <FaEyeSlash /> : <FaEye />}
                                              </span>
          </div>
          <button className='button-password' type="submit">Change Password</button>
          <button
            type="button"
             className='button-password'
            onClick={() => {setStep('forgot-email'); setMessage(''); setOldPassword('');}}
          >
            Forgot Password?
          </button>
        </form>
      )}

      {step === 'forgot-email' && (
        <>
          <form onSubmit={handleSendOtp}>
            <div>
              <label className='Changepasswordchange-label'>Enter your Email to receive OTP</label><br />
              <input placeholder='please enter otp' className='Changepassword-input' type="email" value={email} onChange={e => setEmail(e.target.value)} required />
            </div>
            <button className='button-password' type="submit">Send OTP</button>
          </form>
          <button  className='button-password' onClick={() => setStep('login')}>
            Back to Login
          </button>
        </>
      )}

      {step === 'otp' && (
        <form onSubmit={handleVerifyOtp}>
          <div>
            <label className='Changepasswordchange-label'>Enter OTP sent to your email</label><br />
            <input placeholder='Please enter otp' className='Changepassword-input' type="text" value={otp} onChange={e => setOtp(e.target.value)} required autoFocus />
          </div>
          <button className='button-password-verify' type="submit">Verify OTP</button>
        </form>
      )}

      {step === 'reset-password' && (
        <form onSubmit={handleResetPassword}>
          <div style={{margin:0,padding:0,position:'relative'}}>
            <label className='Changepasswordchange-label'>New Password</label><br />
            <input placeholder='enter password' className='Changepassword-input'  type={showPassword ? "text" : "password"} value={newPassword} onChange={e => setNewPassword(e.target.value)} required autoFocus />
             <span
                                                  onClick={() => setShowPassword(!showPassword)}
                                                  className='eye-icon'
                                                >
                                                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                                                </span>
          </div>
          <button style={{ marginTop: 15 }} type="submit">Reset Password</button>
        </form>
      )}

      {step === 'done' && (
        <div>
          <p className='Changepasswordchange-label'>Password changed successfully. You may now log in.</p>
          <button onClick={() => {
            setStep('login');
            setEmail('');
            setOldPassword('');
            setOtp('');
            setNewPassword('');
            setMessage('');
          }}>
            Back to Login
          </button>
        </div>
      )}
    </div>
  );
};

export default ChangePassword;
