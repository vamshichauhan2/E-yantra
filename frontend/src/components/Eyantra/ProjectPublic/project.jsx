import React, { useContext, useEffect, useState } from 'react';
import eyantraContext from '../../../context/eyantraContext';
import './project.css';
import AOS from 'aos';
import 'aos/dist/aos.css';

const Project= () => {
  const context = useContext(eyantraContext);
  
  const [projects, setProjects] = useState([]);


  useEffect(() => {
      AOS.init({
        duration: 800,
        once: true,
        easing: 'ease-in-sine',
      });
      
      
  
    }, [projects]);
  
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
    setProjects(context.projects);
   
  }, [context.projects]);

  

  return (
    <div className="publicproject-cards-container">
            <h4 className="publicproject-cards-container-h4">Overview of eYantra Projects</h4>
       <p className="publicproject-cards-container-p">eYantra is an exciting initiative that brings robotics, embedded systems, and sustainable technology to life. It focuses on creative projects involving electronic drones, planes, and electric vehicles, inspiring students to explore and innovate across multiple fields. One of the proud contributors to eYantra is the National Institute of Technology Andhra Pradesh (NIT AP), located in Tadepalligudem. Established in 2015, NIT AP is well-known for its top-notch technical education and cutting-edge research, especially in electronics, communication, and electric vehicle technologies. Through eYantra, students and researchers from NIT AP get hands-on experience, turning their ideas into real-world robotic and electronic solutions that can make a difference in today’s technology landscape.</p>
   

        
              
      {
          projects.length===0?(
             <div className="publicprojects-list">
              <img className='eyantra-events-empty' src="../eyantra-empty.webp" alt="empty-imag"/>
              <p className='publicProject-text-empty'>Post Events to view</p>
        </div>

          ):(<>
      {projects.map((item,idx) => (
         <div
          key={item._id}
          className="publicproject-card"
          data-aos="fade-up"
          data-aos-delay={idx * 120}
        >
          
          <img  className="publicproject-poster" src={item.projectposterUrl} alt="project-poster"/>
          <h4>{item.name}</h4>
          <p> {item.description}</p>
         <div>
           <div>
              <h4>From</h4>
              <p>{item.startDate}</p>
            </div>
            <div>
              <h4>To</h4>
                <p>{item.endDate}</p>
            </div>
          </div>
          <div>
             <h4>status</h4>
             <p>{item.status}</p>
          </div>
          
        </div>
      ))}</>)};
    </div>
  );
};

export default Project;
