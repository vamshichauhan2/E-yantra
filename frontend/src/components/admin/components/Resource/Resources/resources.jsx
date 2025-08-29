// Resources.jsx
import React, { useState, useEffect, useContext } from 'react';
import AddIcon from '@mui/icons-material/Add';
import SwipeableDrawer from '@mui/material/SwipeableDrawer';
import ResourceForm from '../AddResource';
import eyantraContext from '../../../../../context/eyantraContext';
import './resources.css';

const API_BASE = import.meta.env.MODE === 'production'
  ? "https://eynatranitandhra.onrender.com"
  : import.meta.env.VITE_API_URL;


const getYouTubeEmbedUrl = (url) => {
  try {
    const urlObj = new URL(url);
    if (urlObj.hostname.includes("youtube.com")) {
      return `https://www.youtube.com/embed/${urlObj.searchParams.get("v")}`;
    }
    if (urlObj.hostname.includes("youtu.be")) {
      return `https://www.youtube.com/embed/${urlObj.pathname.slice(1)}`;
    }
  } catch (err) {
    console.error("Invalid URL:", url);
  }
  return null;
};

const Resources = () => {
  const context = useContext(eyantraContext);
  const [resources, setResources] = useState([]);
  const [open, setOpen] = useState(false);
  const [msg, setMsg] = useState('');

  // Delete API handler
  const deleteRequestedResources = async (Id) => {
    try {
      const Response = await fetch(`${API_BASE}/api/res/delete/shared/resource/${Id}`, {
        method: 'DELETE',
      });
      if (Response.status === 200) {
        setMsg("Successfully Deleted");
        context.getResources();
      }
    } catch (err) {
      setMsg("Sorry, we are not able to process your request, Please try again later");
    }
  };

  // Add API handler
  const handleAddResource = async (newResource) => {
    setResources((prev) => [newResource, ...prev]); // optimistic update
    try {
      const response = await fetch(`${API_BASE}/api/res/share/resource`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newResource)
      });
      if (response.status === 200) {
        setMsg('Successfully Uploaded');
        context.getResources();
      }
    } catch (err) {
      setMsg('Failed to upload, please try again later');
    }
  };

  useEffect(() => {
    setResources(context.resources);
  }, [context.resources]);

  const toggleDrawer = (openState) => (event) => {
    if (
      event &&
      event.type === "keydown" &&
      (event.key === "Tab" || event.key === "Shift")
    ) {
      return;
    }
    setOpen(openState);
  };
 const getdate=(date)=>{
    if (!(date instanceof Date)) {
    date = new Date(date);
  }
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
  }

  // Resource Card Component
  const ResourceCard = ({ resource }) => {
    const embedUrl = resource.link ? getYouTubeEmbedUrl(resource.link) : null;

    return (
      <div className="adminresource-card">
        <img
          className="admindelete-btn"
          onClick={() => deleteRequestedResources(resource._id || resource.id)}
          src="../icons8-remove-50 (1).png"
          alt="Remove"
        />

        {embedUrl && (
          <div className="adminvideo-wrapper">
            <iframe
              src={embedUrl}
              title={resource.title}
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            ></iframe>
          </div>
        )}

        {resource.file && (
          <div className="adminvideo-wrapper">
            <video controls>
              <source src={resource.file} type="video/mp4" />
              Your browser does not support the video tag.
            </video>
          </div>
        )}

        <h3 className="adminresource-title">{resource.title}</h3>
        <p className="adminresource-description">{resource.description}</p>
        <p className="adminresource-meta" style={{fontFamily:"Roboto"}}><strong >Type:</strong> {resource.resourcetype}</p>
        <p className="adminresource-meta" style={{fontFamily:"Roboto"}}><strong>Date Shared:</strong> {getdate(resource.sharedOn)|| "N/A"}</p>

        {!embedUrl && !resource.file && resource.link && (
          <a
            href={resource.link}
            target="_blank"
            rel="noopener noreferrer"
            className="adminresource-link"
          >
            View Resource
          </a>
        )}
      </div>
    );
  };

  return (
    <div className="adminresources-container">
      {/* Drawer with Resource Form */}
      <SwipeableDrawer
        anchor="right"
        open={open}
        onClose={toggleDrawer(false)}
        onOpen={toggleDrawer(true)}
        PaperProps={{
          sx: { m: 0, p: 0, boxSizing: 'border-box' },
        }}
        ModalProps={{
          keepMounted: true,
          BackdropProps: { sx: { backgroundColor: 'rgba(0,0,0,0.5)' } },
          sx: { display: 'flex', justifyContent: 'flex-end' },
        }}
      >
        <ResourceForm
          onAddResource={handleAddResource}
          onClose={() => setOpen(false)}
        />
      </SwipeableDrawer>

      {/* Floating Add Button */}
      <div
        className="adminadd-resource-btn"
       
      >
        <AddIcon
          onClick={() => setOpen(true)}
          style={{ color: "black", fontSize: 60, background: "#1976d2", borderRadius: "50%", padding: "10px" }}
        />
      </div>

    <h1 className="adminresources-heading">Resources</h1>
<p className="adminresources-description">
  At Eyantra, we believe knowledge fuels innovation. Explore a curated library of 
  <strong>study materials, textbooks, research papers, and resource links</strong> 
  focused on <strong>electronic vehicles, drones, and aerial robotics</strong>. 
  Perfect for students, makers, and tech enthusiasts building the next generation of flying and ground-based machines.
</p>

      {
          resources.length===0?(
             <div className="adminresources-list">
              <img className='eyantra-events-empty' src="../eyantra-empty.webp" alt="empty-imag"/>
              <p className='adminresources-text-empty-team'>Post Events to view</p>
        </div>

          ):(

      <div className="adminresources-grid">
        {resources.map((resource) => (
          <ResourceCard key={resource._id || resource.id} resource={resource} />
        ))}
      </div>)};
    </div>
  );
};

export default Resources;
