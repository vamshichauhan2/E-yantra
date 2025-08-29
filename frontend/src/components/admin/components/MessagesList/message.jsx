import React, { useEffect, useState } from 'react';
import io from 'socket.io-client';
import AOS from 'aos';
import 'aos/dist/aos.css';
import './MessagesList.css'
const API_BASE = import.meta.env.MODE === 'production'
  ? "https://eynatranitandhra.onrender.com"
  : import.meta.env.VITE_API_URL;

const SOCKET_URL = import.meta.env.MODE === 'production'
  ? "wss://eynatranitandhra.onrender.com"
  : import.meta.env.VITE_SOCKET_URL;

const socket = io(`${SOCKET_URL}`);

const MessagesList = () => {
  const [messages, setMessages] = useState([]);
  const [unverifiedusers,setunverifiedusers]=useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch(`${API_BASE}/api/message/get/messages`)
      .then((res) => {
        if (!res.ok) {
          throw new Error('Network response was not ok');
        }
        return res.json();
      })
      .then((data) => {
        setMessages(data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message || 'Failed to fetch messages');
        setLoading(false);
      });
  }, []);

 useEffect(() => {
  const handleNewMessage = (message) => {
    setMessages((prev) => [message, ...prev]);
  };
  

  const handleNewUserRequest = () => {
    getunverifieduser();
  };

  socket.on('newMessage', handleNewMessage);
  socket.on('new-user-request', handleNewUserRequest);
  socket.on("user-request-status", handleNewUserRequest);


  return () => {
    socket.off('newMessage', handleNewMessage);
    socket.off('new-user-request', handleNewUserRequest);
  };
}, []);

  // Initialize AOS when messages change
  useEffect(() => {
    getunverifieduser();
    AOS.init({
      duration: 800,
      once: true,
      easing: 'ease-in-sine',
    });
  }, [messages]);


  const handleAccept = async (email) => {
    try{
      const response=await fetch(`${API_BASE}/api/accept/${email}`, { method: 'POST' });
      if(response.status===200){
        //do nothing
      }
      else{
      setError('Failed To accept')
    }

    }catch(err){
      setError('Server Error ,Please Try again Later')
    }
  
  
};

const handleReject = async (email) => {
  try{
      const response=await fetch(`${API_BASE}/api/reject/${email}`, { method: 'POST' });
      if(response.status===200){
        //do nothing
      }
      else{
      setError('Failed To accept')
    }

    }catch(err){
      setError('Server Error ,Please Try again Later')
    }

  
};
  const getunverifieduser=async()=>{
    try{
      const response=await fetch(`${API_BASE}/api/user/get/unverified/user`);
      if(response.status===200){
        const data=await response.json();
       
        setunverifiedusers(data);
      }

    }catch(err){
      setError('Server Error, Please Try again Later')
    }
  }
  const DeleteRequestedMessage = async (Id) => {
    try {
      const response = await fetch(`${API_BASE}/api/message/delete/${Id}`, {
        method: 'DELETE',
      });
      if (response.ok) {
        // Remove deleted message from local state
        setMessages((prev) => prev.filter(msg => msg._id !== Id));
      } else {
        const data = await response.json();
        setError(data.errorMsg || 'Failed to delete message');
      }
    } catch (err) {
      setError('Server error');
    }
  };

  if (loading) {
    return <div style={{display:'flex',alignItems:"center",justifyContent:'center'}}>Loading messages...</div>;
  }
  if (error) {
    return <div style={{ color: 'red' ,display:'flex',alignItems:"center",justifyContent:'center'}}>Error loading messages: {error}</div>;
  }
  if (messages.length === 0 && unverifiedusers.length===0 ) {
    return <div  style={{display:'flex',alignItems:"center",justifyContent:'center'}}>No messages found and Requests.</div>;
  }else if(messages.length === 0 && unverifiedusers.length!==0){

    return (
    <div className='messages-container'>
        <h3 className='messages-header'>Requests</h3>
      <ul>
        {
          unverifiedusers.map((user)=>{
            return(
           
             <li key={user.instituteemail} style={{ marginBottom: '10px' ,listStyleType:'none'}}>
      <p className='Request-p'>
        User <strong>{user.Fullname}</strong> with email <strong>{user.instituteemail}</strong> has requested to join the club. 
      </p>
      <button 
        onClick={() => handleAccept(user.instituteemail)} 
        className='accept-btn btnnnn'
      >
        Accept
      </button>
      <button 
        onClick={() => handleReject(user.instituteemail)} 
        className='reject-btn btnnnn'
      >
        Reject
      </button>
    </li>)

          })
        }
      </ul>
      
    </div>
  );

  }else if(messages.length !== 0 && unverifiedusers.length===0){
    return (
    <div className='messages-container'>
      <h3 className='messages-header'>Messages</h3>
      <ul className='message-items'>
        {messages.map((msg, idx) => (
          <li
            className='message-item'
            key={msg._id}
            data-aos="fade-up"
            data-aos-delay={idx * 100}
          >
            <img
              onClick={() => DeleteRequestedMessage(msg._id)}
              className='delete-msg'
              src="../icons8-delete-message-50.png"
              alt='delete-msg'
              style={{ cursor: 'pointer' }}
              title="Delete Message"
            />
            <div>
              <h4 className='message-useName'>{msg.name}</h4>
              <p className='messager-Email'>({msg.email})</p>
            </div>
            <h5 className='message-subject'>Subject: {msg.subject}</h5>
            <p className='message-content'>Content: {msg.content}</p>
            <div>
              <h4 className="send-on">Sent on:</h4>
              <p>{new Date(msg.createdAt).toLocaleString()}</p>
            </div>
          </li>
        ))}
      </ul>
      
    </div>
  );

  }
  
  
    return (
    <div className='messages-container'>
      <h3 className='messages-header'>Messages</h3>
      <ul className='message-items'>
        {messages.map((msg, idx) => (
          <li
            className='message-item'
            key={msg._id}
            data-aos="fade-up"
            data-aos-delay={idx * 100}
          >
            <img
              onClick={() => DeleteRequestedMessage(msg._id)}
              className='delete-msg'
              src="../icons8-delete-message-50.png"
              alt='delete-msg'
              style={{ cursor: 'pointer' }}
              title="Delete Message"
            />
            <div>
              <h4 className='message-useName'>{msg.name}</h4>
              <p className='messager-Email'>({msg.email})</p>
            </div>
            <h5 className='message-subject'>Subject: {msg.subject}</h5>
            <p className='message-content'>Content: {msg.content}</p>
            <div>
              <h4 className="send-on">Sent on:</h4>
              <p>{new Date(msg.createdAt).toLocaleString()}</p>
            </div>
          </li>
        ))}
      </ul>
       <hr/>
        <h3 className='messages-header'>Requests</h3>
      <ul>
        {
          unverifiedusers.map((user)=>{
           
             <li key={user.instituteemail} style={{ marginBottom: '10px' }}>
      <p style={{color:'black'}}>
        User <strong>{user.Fullname}</strong> with email <strong>{user.instituteemail}</strong> has requested to join the club. 
      </p>
      <button 
        onClick={() => handleAccept(user.instituteemail)} 
        style={{ marginRight: '5px', backgroundColor: 'green', color: 'white' }}
      >
        Accept
      </button>
      <button 
        onClick={() => handleReject(user.instituteemail)} 
        style={{ backgroundColor: 'red', color: 'white' }}
      >
        Reject
      </button>
    </li>

          })
        }
      </ul>
      
    </div>
  );

  
};

export default MessagesList;

