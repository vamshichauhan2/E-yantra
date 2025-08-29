import React, { useState } from 'react';
import axios from 'axios';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
const API_BASE = import.meta.env.MODE === 'production'
  ? "https://eynatranitandhra.onrender.com"
  : import.meta.env.VITE_API_URL;



import './ChangePassword1.css'


const ChangePassword1 = () => {
  const [email, setEmail] = useState('');
  const [step, setStep] = useState('email'); // 'email' -> 'otp' -> 'reset-password' -> 'done'
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [message, setMessage] = useState('');
  const [showPassword, setShowPassword] = useState(false); 

  const handleSendOtp = async (e) => {
    e.preventDefault();
    setMessage('');
    if (!email) {
      setMessage('Email is required');
      return;
    }

    try {
      // Check if user exists before sending OTP
      const checkRes = await axios.post(`${API_BASE}/api/check-user-exists`, { email });
      if (!checkRes.data.exists) {
        setMessage('User with this email does not exist.');
        return;
      }

      // Send OTP
      const res = await axios.post(`${API_BASE}/api/Change-Password/send-otp`, { email });
      setMessage(res.data.message || 'OTP sent to your email.');
      setStep('otp');
    } catch (err) {
      setMessage('Error sending OTP. Please try again later.');
    }
  };

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
        setMessage('OTP verified! Please set your new password.');
        setStep('reset-password');
      } else {
        setMessage(res.data.message || 'OTP verification failed.');
      }
    } catch (err) {
      setMessage('Error verifying OTP. Please try again.');
    }
  };

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
    <div className="PasswordChange-container">
      <h2 className="header">Reset Password</h2>
      {message && (
        <p className={`message ${message.toLowerCase().includes('error') ? 'error' : 'success'}`}>
          {message}
        </p>
      )}

      {step === 'email' && (
        <form onSubmit={handleSendOtp} className="form">
          <label htmlFor="email">Email</label>
          <input
            id="email"
            className="changepassword1-input"
            type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
          />
          <button type="submit" className="button">Send OTP</button>
        </form>
      )}

      {step === 'otp' && (
        <form onSubmit={handleVerifyOtp} className="form">
          <label htmlFor="otp">Enter OTP</label>
          <input
            id="otp"
            className="changepassword1-input"
            type="text"
            value={otp}
            onChange={e => setOtp(e.target.value)}
            required
            autoFocus
          />
          <button type="submit" className="button">Verify OTP</button>
        </form>
      )}

      {step === 'reset-password' && (
        <form onSubmit={handleResetPassword} className="form">
          <div style={{margin:0,padding:0,position:'relative'}}>
            <label htmlFor="new-password">New Password</label>
          <input
            id="new-password"
            className="changepassword1-input"
             type={showPassword ? "text" : "password"}
            value={newPassword}
            onChange={e => setNewPassword(e.target.value)}
            required
            autoFocus
          />
             <span
                                      onClick={() => setShowPassword(!showPassword)}
                                      className='eye-icon'
                                    >
                                      {showPassword ? <FaEyeSlash /> : <FaEye />}
                                    </span>
          </div>
          
          <button type="submit" className="button-changepassword1 ">Set New Password</button>
        </form>
      )}

      {step === 'done' && (
        <div className="success-message">
          <p>Password reset successfully. You can now login.</p>
        </div>
      )}
    </div>
  );
};

export default ChangePassword1;
