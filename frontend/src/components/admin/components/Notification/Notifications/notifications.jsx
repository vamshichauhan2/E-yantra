import React, { useState, useEffect, useContext } from 'react';
//import { useNavigate } from 'react-router-dom';
import AddIcon from '@mui/icons-material/Add';

import SwipeableDrawer from '@mui/material/SwipeableDrawer';
import { useNavigate } from 'react-router-dom';
const API_BASE = import.meta.env.MODE === 'production'
  ? "https://eynatranitandhra.onrender.com"
  : import.meta.env.VITE_API_URL;

import NotificationForm from '../NewNotification/NewNotification';
import eyantraContext from '../../../../../context/eyantraContext';

import './notifications.css';

const NotificationCard = ({ notification, onDelete, onUpdate }) => (
  <div className="notification-card">
    <p>{notification.description}</p>
    {notification.link && (
      <a
        href={notification.link}
        className="notification-link"
        target="_blank"
        rel="noopener noreferrer"
      >
        View Details
      </a>
    )}
    <div className='icon-Image-Notification-delete-update'>
        <img
    className='icon-Image-delete'
      onClick={() => onDelete(notification._id)}
      src="../icons8-remove-50.png"
      alt="delete"
      style={{ cursor: 'pointer', marginRight: 8 }}
    />
    <img
     className='icon-Image-update'
      onClick={() => onUpdate(notification._id)}
      src="../icons8-update-50.png"
      alt="update"
      style={{ cursor: 'pointer' }}
    />

    </div>
  
    
  </div>
);

const Notifications = () => {
  const context=useContext(eyantraContext)
  //const navigate=useNavigate();
  const [open, setOpen] = useState(false);
  const [msg, setMsg] = useState('');
  const [notifications, setNotifications] = useState([]);
  const [updateId, setUpdateId] = useState(null);

  const toggleDrawer = (openState) => (event) => {
    if (
      event &&
      event.type === 'keydown' &&
      (event.key === 'Tab' || event.key === 'Shift')
    ) {
      return;
    }
    setOpen(openState);
  };

  useEffect(() => {
    //getNotifications();
    setNotifications(context.notifications)

  }, [context.notifications]);


  const deleteNotificationById = async (Id) => {
    try {
      const response = await fetch(`${API_BASE}/api/eyantra/notification/delete/${Id}`, { method: 'DELETE' });
      if (response.status === 200) {
        setMsg('Successfully Deleted');
        
        context.getNotifications();
      } else if (response.status === 404) {
        setMsg('Notification Not Found');
      } else {
        setMsg('Failed to delete notification');
      }
    } catch (err) {
      setMsg('Internal Server Error');
      console.error('Delete error:', err);
    }
  };

  const updateNotificationById = (Id) => {
    setUpdateId(Id);

   
    setOpen(true);
  };

  const deleteAllNotifications = async () => {
    try {
      const response = await fetch(`${API_BASE}/api/eyantra/notifications/delete`, { method: 'DELETE' });
      if (response.status === 200) {
        setMsg('Successfully Deleted All');
        setNotifications([]);
      } else {
        setMsg('Failed to delete all notifications');
      }
    } catch (err) {
      setMsg('Internal Server Error, Please Try Again Later');
      console.error('Delete all error:', err);
    }
  };

  return (
    <div className="notifications-page">
     
     <SwipeableDrawer
  anchor="right"
  open={open}
  onClose={toggleDrawer(false)}
  onOpen={toggleDrawer(true)}
  PaperProps={{
    sx: {
      m: 0,      
      p: 0,      
      maxWidth: '100%', // optional to make it full width inside screen
      boxSizing: 'border-box',
    },
  }}
  ModalProps={{
    sx: {
      m: 0,
      p: 0,
    }
  }}
>
        <NotificationForm updateId={updateId} onClose={() => setOpen(false)} />{/*onRefresh={getNotifications} />*/}
      </SwipeableDrawer>
         <div className='Top-Icons-delete-All-plus'>
           <img   className='icon-Image-delete'src='../icons8-delete-all-50.png' alt=""  onClick={deleteAllNotifications}/>
      <div className="AddIcon-Notification">
        <AddIcon onClick={() => setOpen(true)} style={{ color: 'black', fontSize: 40, cursor: 'pointer' }} />
      </div>

         </div>
      
      

      <h1>Notifications</h1>

      {msg && <p className="message">{msg}</p>}

      <div className="notifications-list">
        {notifications.map((notif) => (
          <NotificationCard
            key={notif._id}
            notification={notif}
            onDelete={deleteNotificationById}
            onUpdate={updateNotificationById}
          />
        ))}
      </div>
    </div>
  );
};

export default Notifications;
