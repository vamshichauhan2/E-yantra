import React, { useState, useEffect, useContext } from 'react';
import AddIcon from '@mui/icons-material/Add';
import SwipeableDrawer from '@mui/material/SwipeableDrawer';
import eyantraContext from '../../../context/eyantraContext';
import './resource.css';


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
 const getdate=(date)=>{
    if (!(date instanceof Date)) {
    date = new Date(date);
  }
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
  }


const PublicResources = () => {
  const context = useContext(eyantraContext);
  const [resources, setResources] = useState([]);
  
  
  
  

  useEffect(() => {
    setResources(context.resources);
  }, [context.resources]);

  

    const ResourceCard = ({ resource }) => {
    const embedUrl = resource.link ? getYouTubeEmbedUrl(resource.link) : null;

    return (
      <div className="publicresource-card">
       

    
        {embedUrl && (
          <div className="publicvideo-container">
            <iframe
              width="100%"
              height="315"
              src={embedUrl}
              title={resource.title}
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            ></iframe>
          </div>
        )}

    
        {resource.file && (
          <div className="publicvideo-container">
            <video width="100%" height="315" controls>
              <source src={resource.file} type="video/mp4" />
              Your browser does not support the video tag.
            </video>
          </div>
        )}

        <h3>{resource.title}</h3>
        <p>{resource.description}</p>
        <p>
          <strong style={{fontFamily:'fantasy'}}>Type:</strong> {resource.resourcetype}
        </p>
        <p>
          <strong style={{fontFamily:'fantasy'}}>Date Shared:</strong> {getdate(resource.sharedOn) || "N/A"}
        </p>

       
        {!embedUrl && !resource.file && resource.link && (
          <a
            href={resource.link}
            target="_blank"
            rel="noopener noreferrer"
            className="publicresource-link"
          >
            View Resource
          </a>
        )}
      </div>
    );
  };

  return (
    <div className="publicresources-page">
      
      

     <h1 className="publicresources-heading">Resources</h1>
<p className="publicresources-description">
  At Eyantra, we believe knowledge fuels innovation. Explore a curated library of 
  <strong>study materials, textbooks, research papers, and resource links</strong> 
  focused on <strong>electronic vehicles, drones, and aerial robotics</strong>. 
  Perfect for students, makers, and tech enthusiasts building the next generation of flying and ground-based machines.
</p>
      {
          resources.length===0?(
             <div className="publicresources-list">
              <img className='eyantra-events-empty' src="../eyantra-empty.webp" alt="empty-imag"/>
              <p className='publicresources-text-empty'>Post Events to view</p>
        </div>

          ):(
      <div className="publicresources-list">

        {resources.map((resource) => (
          <ResourceCard key={resource._id} resource={resource} />
        ))}
      </div>)}
    </div>
  );
};

export default PublicResources;
