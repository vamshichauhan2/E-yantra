import React, { useState, useEffect } from 'react';
import OtpInput from 'react-otp-input';
const API_BASE = import.meta.env.MODE === 'production'
  ? "https://eynatranitandhra.onrender.com"
  : import.meta.env.VITE_API_URL;



import './registration.css'
import { FaEye, FaEyeSlash } from 'react-icons/fa';
const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz1234567890!@#$';

const generateCaptcha = () => {
  let captcha = '';
  for (let i = 0; i < 6; i++) {
    const genRanNum = Math.floor(Math.random() * characters.length);
    captcha += characters[genRanNum];
  }
  return captcha;
};

const Registration = () => {
  const [role, setRole] = useState('');
  const [msg, setMsg] = useState('');
  const [verifyOtp, setVerifyOtp] = useState(false);
  const [userCaptcha, setUserCaptcha] = useState('');
  const [captcha, setCaptcha] = useState(generateCaptcha());
  const [showPassword, setShowPassword] = useState(false); 
  const [otp, setOtp] = useState('');
  
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    name: '',
    year: '',
    phone: '',
    otp: '',
    scode: '',
    rePassword: ''
  });

  useEffect(() => {
    setCaptcha(generateCaptcha()); // Generate on mount
  }, []);

  const onChange = (e) => {
    const { name, value } = e.target;
    if (name === 'captcha') {
      setUserCaptcha(value);
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const onhandleOTPChange = (value) => {
    setOtp(value);
    setFormData(prev => ({ ...prev, otp: value }));
  };

  const sendOtp = async () => {
    try {
      const response = await fetch(`${API_BASE}/api/send-otp`, {
        method: "POST",
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: formData.email })
      });

      const data = await response.json().catch(() => ({}));

      if (response.status === 200) {
        setMsg(`OTP sent to ${formData.email}`);
      } else {
        setMsg(data.message || "Failed to send OTP");
      }
    } catch (err) {
      setMsg("Failed to send OTP");
    }
  };

  const onRegister = async (e) => {
    e.preventDefault();

    if (formData.password !== formData.rePassword) {
      setMsg("Passwords do not match");
      return;
    }

    if (captcha !== userCaptcha) {
      setMsg("Please enter correct Captcha");
      return;
    }

    try {
      const verifyOtpResponse = await fetch(`${API_BASE}/api/verify-otp/`, {
        method: "POST",
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ otp, email: formData.email })
      });

      const verifyData = await verifyOtpResponse.json().catch(() => ({}));

      if (verifyOtpResponse.status === 200) {
        try {
          const registerResponse = await fetch(`${API_BASE}/api/user/register/user`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ formData, role })
          });

          const registerData = await registerResponse.json().catch(() => ({}));

          if (registerResponse.status === 200) {
            setMsg("Successfully Registered");
          } else {
            setMsg(registerData.message || "Something went wrong, please try again");
          }
        } catch (err) {
          setMsg('Server Error, Please Try Again Later');
        }
      } else {
        setMsg(verifyData.message || 'OTP Verification Failed');
      }
    } catch (err) {
      setMsg("Server error, Please Try Again After some time");
    }
  };

  const onhandleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`${API_BASE}/api/VerifyEmail/${formData.email}/${role}`);
      const data = await response.json().catch(() => ({}));

      if (response.status === 200) {
        setMsg("Email already exists with same role. Please try to login or reset password.");
      } else if (response.status === 404) {
        setVerifyOtp(true);
        sendOtp(); 
      } else {
        setMsg(data.message || "Error verifying email");
      }
    } catch (err) {
      setMsg("Error verifying email");
    }
  };

  return (
    <div className='Registration'>

    
    <div className='Registration-Page'>
      {verifyOtp ? (
        <div className='registration-page-container'>
          <form className='form-register1' onSubmit={onRegister}>
            <div style={{margin:0,marginTop:30,display:'flex',flexDirection:'column'}}>
              <label className='registration-page-labels'>OTP</label>
              <OtpInput
                value={otp}
                onChange={setOtp}
                 className='registration-page-otp-inputs'
                numInputs={6}
                isInputNum
                renderInput={(props, index) => <input {...props} key={index} />}
                inputStyle={{
                  width: '2rem',
                  height: '2rem',
                  margin: '0 0.5rem',
                  fontSize: '1.5rem',
                  borderRadius: '4px',
                  color:'black',
                  border: '1px solid #ccc',
                }}
              />
              <p onClick={sendOtp} style={{ cursor: 'pointer', color: 'blue', textDecoration: 'underline' }}>Resend OTP</p>
          
            </div>

            <div style={{margin:0,marginTop:30,position:'relative'}}>
              <label className='registration-page-labels'>Password</label>
              <input   className='registration-page-inputs' name="password"  type={showPassword ? "text" : "password"} value={formData.password} onChange={onChange} required />
               <span
                          onClick={() => setShowPassword(!showPassword)}
                          className='eye-icon'
                        >
                          {showPassword ? <FaEyeSlash /> : <FaEye />}
                        </span>
            </div>
            <div style={{margin:0,marginTop:30,position:'relative'}}>
              <label className='registration-page-labels'>Re-Password</label>
              <input 
               type={showPassword ? "text" : "password"}
               className='registration-page-inputs' name="rePassword"  value={formData.rePassword} onChange={onChange} required />
               <span
                          onClick={() => setShowPassword(!showPassword)}
                          className='eye-icon'
                        >
                          {showPassword ? <FaEyeSlash /> : <FaEye />}
                        </span>
            </div>

            <div style={{margin:0,marginTop:30}}>
              <p className='registration-page-captcha '>
                {captcha}{" "}
                <span className='registration-page-refresh-captcha ' onClick={() => setCaptcha(generateCaptcha())} style={{ cursor: "pointer", color: "blue" }}>↻</span>
              </p>
              <input
               className='registration-page-inputs'
                name="captcha"
                onChange={onChange}
                value={userCaptcha}
                placeholder="Enter captcha"
                required
              />
            </div>

            <button className='registration-page-button 'type="submit" disabled={otp.length !== 6}>Register</button>
          </form>

          {msg && <p>{msg}</p>}
        </div>
      ) : (
        <div className='registration-page-container'>
          <h2 className='registration-page-title '>Registration</h2>
          <p className='registration-page-subtitle '>Overview of club activities and quick stats.</p>
          
            <label className='registration-page-select-labels' htmlFor="role">Select Role </label>
          <select  className='registration-select-page-inputs' id="role" value={role} onChange={e => setRole(e.target.value)}>
            <option value=''  disabled>Choose Your Role</option>
            <option value="admin">Admin</option>
            <option value="secretary">Secretary</option>
            <option value="jointSecretary">Joint Secretary</option>
          </select>
            
          

          <form className='registration-page-form ' onSubmit={onhandleSubmit}>
          
            {(role === 'secretary' || role === 'jointSecretary'||role==='admin') && (
              <>
                <div style={{margin:0,marginTop:30}}>
                  <label className='registration-page-labels' htmlFor="name">Name</label>
                  <input 
                   className='registration-page-inputs'
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={onChange}
                    required
                  />
                </div>
                <div style={{margin:0,marginTop:30}}>
                  <label className='registration-page-labels' htmlFor="email">Email</label>
                  <input
                   className='registration-page-inputs'
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={onChange}
                    required
                  />
                </div>
                <div style={{margin:0,marginTop:30}}>
                  <label className='registration-page-labels' htmlFor="year">Year of Study</label>
                  <input
                   className='registration-page-inputs'
                    type="number"
                    id="year"
                    name="year"
                    min="1"
                    max="5"
                    value={formData.year}
                    onChange={onChange}
                    required
                  />
                </div>
                <div style={{margin:0,marginTop:30}}>
                  <label className='registration-page-labels' htmlFor="phone">Phone Number</label>
                  <input
                   className='registration-page-inputs'
                    type="tel"
                    id="phone"
                    name="phone"
                    pattern="[0-9]{10}"
                    title="Enter 10 digit phone number"
                    value={formData.phone}
                    onChange={onChange}
                    required
                  />
                </div>
              </>
            )}
            <button className='registration-page-button 'type="submit">Submit</button>
          </form>
          {msg && <p className='registration-page-message'>{msg}</p>}
        </div>
      )}
    </div>
    </div>
  );
};

export default Registration;
