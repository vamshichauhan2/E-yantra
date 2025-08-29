import React, { useContext, useState } from 'react';
import './newNotification.css'
import eyantraContext from '../../../../../context/eyantraContext';
const API_BASE = import.meta.env.MODE === 'production'
  ? "https://eynatranitandhra.onrender.com"
  : import.meta.env.VITE_API_URL;

const NotificationForm = () => {
  const context=useContext(eyantraContext);
  const [description, setDescription] = useState('');
  const [link, setLink] = useState('');
  const [msg,setMsg]=useState('');

  
  const publishNotification=async(e)=>{
    //console.log("Hey I am Going to ")
    e.preventDefault();
    try{
    const response=await fetch(`${API_BASE}/api/eyantra/notifications/post/`,{
      method:"POST",
      headers:{'Content-Type':'application/json'},
      body:JSON.stringify({description,link})
      
    });
    if(response.status===200){
       setMsg("SuccessFully Posted")
       context.getNotifications();
      // console.log("success")
    }
  }catch(err){
    setMsg("Internal Server Error");
    //console.log("Failure")
  }
  }

  return (
    <form onSubmit={publishNotification} className="Notification-form">
      <h2 className="Notification-form-title">Add Notification</h2>

      <div className="NotificationForm-form-group">
        <label className="Notification-form-label">
          Description
        </label>
        <textarea
          required
          className="Notificationt-form-textarea"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Enter notification description"
        />
      </div>

      <div className="NotificationForm-form-group">
        <label className="Notification-form-label">
          Link (optional)
        </label>
        <input
          type="url"
          className="Notification-form-input"
          value={link}
          onChange={(e) => setLink(e.target.value)}
          placeholder="https://example.com"
          pattern="https?://.+"
          title="Please enter a valid URL starting with http:// or https://"
        />
      </div>

      <button  type="submit" className="Notification-form-button" style={{ marginTop: 16 }}>
        Submit Notification
      </button>
    </form>
  );
};

export default NotificationForm;
