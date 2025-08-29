import React, { useState } from 'react';
const API_BASE = import.meta.env.MODE === 'production'
  ? "https://eynatranitandhra.onrender.com"
  : import.meta.env.VITE_API_URL;


const CLOUD_NAME = import.meta.env.VITE_CLOUD_NAME;
const UPLOAD_PRESET = import.meta.env.VITE_UPLOAD_PRESET;

import './addresources.css';

const ResourceForm = ({ onAddResource, onClose }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [dateShared, setDateShared] = useState('');
  const [resourceType, setResourceType] = useState('Research Paper');
  const [link, setLink] = useState('');
  const [file, setFile] = useState(null);

  const uploadToCloudinary = async (file) => {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('upload_preset', UPLOAD_PRESET);
  formData.append('resource_type', 'video'); // Important to specify for video
  
  const response = await fetch(`https://api.cloudinary.com/v1_1/${CLOUD_NAME}/video/upload`, {
    method: 'POST',
    body: formData,
  });

  if (!response.ok) {
    throw new Error('Upload failed');
  }
  const data = await response.json();
  return data.secure_url;
};


  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!link.trim() && !file) {
      alert('Please provide a link or upload a file.');
      return;
    }

    try {
      let videoUrl = '';

      if (file) {
        videoUrl = await uploadToCloudinary(file);
      }

      const newResource = {
        id: Date.now(), // Local id
        title,
        description,
        dateShared,
        resourceType,
        link: link.trim() || null,
        file: videoUrl || null,
      };

      onAddResource(newResource);
      onClose();
    } catch (err) {
      alert('Failed to upload video. Please try again.');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="resource-form" style={{ width: 350, padding: 20 }}>
      <p onClick={() => onClose()} style={{ color: 'white', marginLeft: '30px' }}>x</p>

      <h2 className="resource-form__title">Add Resource</h2>

      <label className="resource-form__label">Title</label>
      <input
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className="resource-form__input"
        required
        placeholder="Resource title"
      />

      <label className="resource-form__label">Description</label>
      <textarea
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        className="resource-form__textarea"
        placeholder="Short description"
      />

      <label className="resource-form__label">Date Shared</label>
      <input
        type="date"
        className="resource-form__input"
        value={dateShared}
        onChange={(e) => setDateShared(e.target.value)}
        
      />

      <label className="resource-form__label">Resource Type</label>
      <select
        value={resourceType}
        onChange={(e) => setResourceType(e.target.value)}
       className="resource-form__input"
      >
        <option>Research Paper</option>
        <option>Book</option>
        <option>YouTube Video</option>
        <option>Video</option>
        <option>Website</option>
      </select>

      <label className="resource-form__label">Link (if applicable)</label>
      <input
        type="url"
        value={link}
        onChange={(e) => setLink(e.target.value)}
        className="resource-form__input"
        placeholder="https://example.com"
      />

      <label className="resource-form__label">Upload a Video (Optional)</label>
      <input
        type="file"
        accept="video/*"
        onChange={(e) => setFile(e.target.files[0])}
        className="resource-form__input"
      />
      {file && <p style={{ color: 'white', fontSize: '12px' }}>Selected file: {file.name}</p>}
      {file && (
        <div className='resourceForm-form-group'>
          <em>Video Preview Not Supported</em>
          {/* Optional: Add a video preview here if needed */}
        </div>
      )}

      <button type="submit" className="resourcet-form__button" style={{ marginTop: 16, width: '100%' }}>
        Add Resource
      </button>
    </form>
  );
};

export default ResourceForm;
