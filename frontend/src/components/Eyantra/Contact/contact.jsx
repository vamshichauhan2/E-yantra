import React, { useState, useEffect } from 'react';
import EyantraFAQ from '../FAQ/Faq';
const API_BASE = import.meta.env.MODE === 'production'
  ? "https://eynatranitandhra.onrender.com"
  : import.meta.env.VITE_API_URL;

const SOCKET_URL = import.meta.env.MODE === 'production'
  ? "wss://eynatranitandhra.onrender.com"
  : import.meta.env.VITE_SOCKET_URL;

import io from 'socket.io-client';
import './contact.css';

const socket = io(`${SOCKET_URL}`); 

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    content: '',
  });

  
  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // POST message data to backend REST API
    try {
      const response = await fetch(`${API_BASE}/api/message/post/messages`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) throw new Error('Failed to send message');

      const savedMessage = await response.json();

      
      setFormData({ name: '', email: '', subject: '', content: '' });
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };


  

  return (
    <div className='Contact-page'>
      <h2 style={{color:"orange"}}>Contact Us</h2>
      <p>-GET IN TOUCH WITH US-</p>
      <div className='Contact-page-Container'>
        <div className='Contact-page-Container-content1'>
          <div className='eyantra-address-content'>
            <img src="./icons8-location-50.png" alt="location" />
            <div className='eyantra-address-inner-container'>
              <h4 className='eyantra-address-content-h'>Address</h4>
              <p className='eyantra-address-content-p'>NIT Andhra Pradesh</p>
            </div>
          </div>
          <div className='eyantra-email-content'>
            <img src="./icons8-email-50.png" alt="email" />
            <div>
              <h4 className='eyantra-email-content-h'>Email</h4>
              <p>eyantraclub@nitandhra.ac.in</p>
            </div>
          </div>
        </div>

        <div className='Contact-page-Container-content2'>
          <h4 style={{color:"orange"}}>Message Us</h4>
          <form onSubmit={handleSubmit}>
            <div className='form-group-contact'>
              <label>Name</label>
              <input
                name='name'
                value={formData.name}
                onChange={handleChange}
                placeholder='Enter Your Full Name'
                required
              />
            </div>

            <div className='form-group-contact'>
              <label>Email</label>
              <input
                name='email'
                type='email'
                value={formData.email}
                onChange={handleChange}
                placeholder='Enter Email'
                required
              />
            </div>

            <div className='form-group-contact'>
              <label>Subject</label>
              <input
                name='subject'
                value={formData.subject}
                onChange={handleChange}
                placeholder='Enter Subject Here'
                required
              />
            </div>

            <div className='form-group-contact'>
              <label>Content</label>
              <textarea
                name='content'
                value={formData.content}
                onChange={handleChange}
                placeholder='Enter Content Here'
                required
              />
            </div>

            <button type='submit'>Send Message</button>
          </form>

         
        </div>
      </div>
      <div style={{margin:0,padding:0,width:'100%'}}>
        <h4 style={{color:"white"}}>FAQ's</h4>
         <div style={{margin:0,padding:0,width:'100%'}}>
           <EyantraFAQ/>
         </div>
      </div>
    </div>
  );
};

export default Contact;
