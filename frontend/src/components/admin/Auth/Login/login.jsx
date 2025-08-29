import React, { useState, useEffect } from 'react';
import Cookies from 'js-cookie';
//import CryptoJS from 'crypto-js';
import { io } from 'socket.io-client';
const API_BASE = import.meta.env.MODE === 'production'
  ? "https://eynatranitandhra.onrender.com"
  : import.meta.env.VITE_API_URL;

const SOCKET_URL = import.meta.env.MODE === 'production'
  ? "wss://eynatranitandhra.onrender.com"
  : import.meta.env.VITE_SOCKET_URL;


export const socket = io(`${SOCKET_URL}`);
import './login.css'
import { Navigate, Link } from 'react-router-dom';
import { FaEye, FaEyeSlash } from 'react-icons/fa'; // add this for white eye icon

const AdminLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false); // new state
  const [message, setMessage] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [shouldRedirect, setShouldRedirect] = useState(false);

  useEffect(() => {
    const token = Cookies.get('jwt_token');
    if (token) setShouldRedirect(true);
  }, []);

  const onLoginTry = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`${API_BASE}/api/user/login/user`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (res.status === 404) {
        setMessage('User not found!');
        return;
      }
      if (res.status === 402) {
        setMessage("Under verification process, you can try later");
        return;
      }
      if (res.status === 200) {
        const { Id, role, userName } = data;
        
//const encryptedId = CryptoJS.AES.encrypt(Id, secret).toString();
Cookies.set('jwt_token', Id, { expires: 15 });
       
        sessionStorage.setItem('role', role);
        setMessage('Successfully logged in!');
        socket.emit('register', { userName, Id });
        setShouldRedirect(true);
        return;
      }

      setErrorMsg(data.message || 'Login failed. Try again.');
    } catch {
      setErrorMsg('🚨 Server error. Try later.');
    }
  };

  if (shouldRedirect) return <Navigate to="/admin/Home" replace />;

  return (
    <div className='Login-Page'>
      <form className='Login-Form' onSubmit={onLoginTry}>
        <h4 className='Login-Heading'>LOGIN</h4>
        <div style={{ margin: 0, padding: 0 }}>
          <input
            className='userInput-Login-Login'
            type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            placeholder="Enter your Email"
            required
          />
        </div>

        {/* Password input with show/hide */}
        <div style={{ position: 'relative', margin: 0, padding: 0 }}>
          <input
            className='userInput-Login-Login'
            type={showPassword ? "text" : "password"}
            value={password}
            onChange={e => setPassword(e.target.value)}
            placeholder="Enter your Password"
            required
          />
          <span
            onClick={() => setShowPassword(!showPassword)}
            className='eye-icon'
          >
            {showPassword ? <FaEyeSlash /> : <FaEye />}
          </span>
        </div>

        <div>
          <button className='submit-btn-btn' type="submit">Login</button>
        </div>
        {message && <p style={{ color: 'green' }}>{message}</p>}
        {errorMsg && <p style={{ color: 'red' }}>{errorMsg}</p>}
        <div className='switch-program'>
          <p>New here? <Link to="/register">Register</Link></p>
          <p><Link to="/forgot-password">Forgot password?</Link></p>
        </div>
      </form>
    </div>
  );
};

export default AdminLogin;
