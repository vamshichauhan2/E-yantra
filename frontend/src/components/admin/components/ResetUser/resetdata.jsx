import React, { useState } from 'react';
import axios from 'axios';
import './resetdata.css';
const API_BASE = import.meta.env.MODE === 'production'
  ? "https://eynatranitandhra.onrender.com"
  : import.meta.env.VITE_API_URL;



const DeleteAllUsers = () => {
  const [showPrompt, setShowPrompt] = useState(false);
  const [emailInput, setEmailInput] = useState('');
  const [passwordInput, setPasswordInput] = useState('');
  const [message, setMessage] = useState('');

  // Show confirmation prompt
  const handleDeleteClick = () => {
    setShowPrompt(true);
    setMessage('');
  };

  // Confirm deletion with email and password verification
  const handleConfirmDelete = async () => {
    if (!emailInput.trim() || !passwordInput.trim()) {
      setMessage("Please enter both the coordinator's email and password to confirm.");
      return;
    }

    try {
      const response = await axios.delete(`${API_BASE}/api/user/delete/all/user`, {
        data: { 
          email: emailInput.trim(),
          password: passwordInput.trim()
        }
      });
      setMessage(response.data.message || 'Users deleted successfully.');
    } catch (error) {
      setMessage(
        (error.response && error.response.data && error.response.data.message) ||
        'Deletion failed. Verify your credentials and try again.'
      );
    }

    
    setShowPrompt(false);
    setEmailInput('');
    setPasswordInput('');
  };

  // Cancel deletion
  const handleCancel = () => {
    setShowPrompt(false);
    setEmailInput('');
    setPasswordInput('');
    setMessage('');
  };

  return (
    <div className="delete-container">
      <button className="delete-btn" onClick={handleDeleteClick}>
        Delete All Users
      </button>

      {showPrompt && (
        <div className="prompt-box">
          <p className="warn-text"> Warning: This action will permanently delete all user accounts. This operation cannot be undone. Only authorized administrators are allowed to perform this action. If you are not authorized, please cancel immediately.</p>
       
          <p>Please enter the <strong>club coordinator's email and password</strong> to confirm:</p>
          <input
            type="email"
            className="email-input"
            placeholder="Coordinator's Email"
            value={emailInput}
            onChange={(e) => setEmailInput(e.target.value)}
            autoFocus
          />
          <input
            type="password"
            className="password-input"
            placeholder="Coordinator's Password"
            value={passwordInput}
            onChange={(e) => setPasswordInput(e.target.value)}
          />
          <div className="btn-group">
            <button
              className="confirm-btn"
              onClick={handleConfirmDelete}
              disabled={emailInput.trim() === '' || passwordInput.trim() === ''}
            >
              Confirm Delete
            </button>
            <button className="cancel-btn" onClick={handleCancel}>
              Cancel
            </button>
          </div>
        </div>
      )}

      {message && <p style={{color:'white'}} className="message">{message}</p>}
    </div>
  );
};

export default DeleteAllUsers;
