import React, { useEffect, useContext } from 'react';
import AOS from 'aos';
import 'aos/dist/aos.css';
import { Carousel } from 'react-responsive-carousel';
import 'react-responsive-carousel/lib/styles/carousel.min.css';

//import Slider from 'react-slick';
import "slick-carousel/slick/slick.css"; 
import "slick-carousel/slick/slick-theme.css";
import AnimatedCount from '../../../AnimatedCount/animatecount';
import { useNavigate } from 'react-router-dom';

import eyantraContext from '../../../../context/eyantraContext';
import './home.css';

const AdminHome = () => {
  const context = useContext(eyantraContext);
  const navigate = useNavigate();

  /*const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
    responsive: [
      { breakpoint: 1024, settings: { slidesToShow: 1 } },
      { breakpoint: 600, settings: { slidesToShow: 1, dots: false } },
      { breakpoint: 480, settings: { slidesToShow: 1, dots: false, arrows: false } }
    ]
  };*/

  useEffect(() => {
    AOS.init({ duration: 1000, easing: 'ease-in-out', once: true });
  }, []);

  return (
    <div className='Admin-Home-Page'>
       
      
      <div className="Admin-background-Image">
        <div className="admin-home">
          <div className="Home-Page-top-Container">
            <h1>Welcome, {context.username}</h1>
            <p>Here’s a quick overview of your platform activity.</p>
          </div>

          <div className="admin-stats">
            <div className="stat-card" data-aos="fade-up">
               <AnimatedCount targetCount={context.stats.totalAdmins}/>
              <p>Total Admins</p>
              
            </div>
            <div className="stat-card" data-aos="fade-up">
              <AnimatedCount targetCount={context.stats.
    totalSecretaries}/>
              <p>Total Secretaries</p>
            
            </div>
            <div className="stat-card" data-aos="fade-up">
             <AnimatedCount targetCount={context.stats.
    totalJointSecretaries}/>
              <p>Total Joint Secretaries</p>
              
            </div>
            <div className="stat-card" data-aos="fade-up">
                <AnimatedCount targetCount={context.stats. totalUsers}/>
              <p>Registered Users</p>
            
            </div>
           <div className="stat-card" data-aos="fade-up">
           <div className='heading-container-stats '>
           <h6><AnimatedCount targetCount={context.events?.length||0}/></h6> 
          
           
           </div>
          <p>Events</p>
        </div>
            
            <div className="stat-card" data-aos="fade-up">
              <h2>{context.notifications?.length || 0}</h2>
              <p>Active Notifications</p>
            </div>
            <div className="stat-card" data-aos="fade-up">
           
           <div className='heading-container-stats '>

            <AnimatedCount targetCount={context.notifications?.length||0}/>
            
           </div>
          <p>Active Notifications</p>
        </div>
             
            <div className="stat-card" data-aos="fade-up">
           
                        <div className='heading-container-stats '>
                         <AnimatedCount targetCount={context.resources?.length||0}/>
                        
                        </div>
                      
              <p>Total Resources</p>
            </div>
          </div>
        </div>
      </div>

      {/* Other Content */}
      <div  className="other-content-Home-page">
        <div className="quick-links">
          <h3 className="quick-links-h3">Quick Actions</h3>
          <div className="quick-link-btns">
            <button className='quick-link-btn ' onClick={() => navigate('/admin/dashboard')}>Go to Dashboard</button>
            <button className='quick-link-btn ' onClick={() => navigate('/admin/events')}>Manage Events</button>
            <button className='quick-link-btn ' onClick={() => navigate('/admin/notifications')}>Send Notification</button>
            <button className='quick-link-btn ' onClick={() => navigate('/admin/team')}>Manage Team</button>
          </div>
        </div>

        <div className="Home-recent-activity">
          <h3>Recent Activity</h3>
          <Carousel 
  className='carousel-root' 
   showIndicators={false} 
   // Hide the dots
>
  
  <div style={{margin:0,padding:'0px'}}>
    <p>No Recent Activity(This Feauture is Enabled)</p>
  </div>
  
</Carousel>

          {/*<Slider {...settings}>
           
          </Slider>*/}
        </div>
        <div className='lower-device-recent-Activity'>
          <h4>Recent Activity</h4>
            <div style={{margin:0,padding:0}}>
               <p>No Recent Activity(This Feauture is Enabled)</p>
            </div>

        </div>
      </div>
    </div>
  );
}

export default AdminHome;
