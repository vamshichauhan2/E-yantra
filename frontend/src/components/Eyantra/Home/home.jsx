import React,{useEffect,useState,useRef, useContext} from 'react';
import './home.css'
import AOS from 'aos';
import 'aos/dist/aos.css';
import Slider from 'react-slick';
import "slick-carousel/slick/slick.css"; 
import "slick-carousel/slick/slick-theme.css";
import eyantraContext from '../../../context/eyantraContext';
import AnimatedCount from '../../AnimatedCount/animatecount';
import Team from '../TeamMember/team';
import CoordinatorDetails from '../Coordinator/coordinator';


import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faQuoteRight } from '@fortawesome/free-solid-svg-icons';

import { faQuoteLeft } from '@fortawesome/free-solid-svg-icons';
import Footer from '../Footer/footer';



const Home = () => {
 
  const context=useContext(eyantraContext);
  
  
  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
    responsive: [
      {
        breakpoint: 1024, 
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
          infinite: true,
          dots: true,
        }
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
          initialSlide: 0,
          dots: false, 
        }
      },
      {
        breakpoint: 480, 
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
          dots: false,
          arrows: false, 
        }
      }
    ]
  };
  useEffect(() => {
    AOS.init({
      duration: 1000, 
      easing: 'ease-in-out',
      once: true, 
    });
  }, []);


  useEffect(() => {
  const notificationUl = document.querySelector('.Notification-Container ul');
  if (notificationUl) {
    notificationUl.addEventListener('mouseenter', () => {
      notificationUl.style.animation = 'none';
      void notificationUl.offsetWidth;
    });

    notificationUl.addEventListener('mouseleave', () => {
      notificationUl.style.animation = 'notificationSlider 30s linear infinite';
    });

    // Cleanup listeners on unmount
    return () => {
      notificationUl.removeEventListener('mouseenter', () => {});
      notificationUl.removeEventListener('mouseleave', () => {});
    }
  }
}, []);


   const now = new Date();

  const upcomingEvents = context.events?.filter(event => {
    const eventDate = new Date(event.date);
    return eventDate > now;
  }) || [];

  const ongoingEvents = context.events?.filter(event => {
    const eventDate = new Date(event.date);
    // assuming Time is like '14:30' (HH:mm)
    const [hours, minutes] = event.Time?.split(':').map(Number) || [0,0];
    const startTime = new Date(eventDate);
    startTime.setHours(hours, minutes, 0, 0);

    const endTime = new Date(startTime);
    endTime.setHours(endTime.getHours() + 2); // assuming event lasts 2 hours

    return now >= startTime && now <= endTime;
  }) || [];
 
    

  return (
    
    <eyantraContext.Consumer >
      {(context)=>(
      
        
        <div className='Home-Page'>
              <div className='Notification-Container'>
  {context.notifications && context.notifications.length > 0 ? (
    <ul >
      {context.notifications.map((item, index) => {
        return (
          <li style={{display:'flex',justifyContent:'center',gap:'20px',alignItems:'center'}} key={item._id}>
            <p>{item.description}</p>
            <a href={item.link} >click</a>
          </li>
        );
      })}
    </ul>
  ) : (
    <div className='Notification-Container'>
      <ul >
        <li>Empty Notification</li>
        <li>Empty Notification</li>
        <li>Empty Notification</li>
        <li>Empty Notification</li>
      </ul>
    </div>
  )}
</div>

      
        <div  className='Home-Page-Top-Content'>

          <div data-aos="fade-left" className='Home-Club-Content'>
            <h2 >E-YANTHRA</h2>
            <h3>Club</h3>
            
               <span>NIT Andhra Pradesh</span>
               

            
           

          </div>
          <div data-aos="fade-right" className='Eyantra-Description-Content'>
             <p className='eyantra-description '>   <FontAwesomeIcon icon={faQuoteLeft} />A group to collaborate among finance enthusiasts and foster a permanent finance culture in the IITR campus  <FontAwesomeIcon icon={faQuoteRight} /></p>
             <img src="./E-yantra-logo" alt=""/>
          </div>
        </div>
        <div className="vision-mission">
          <div data-aos="fade-up" className='vision'>
            <h2 className='vision-mission-heading'>Vision</h2>
  <p style={{color:"white"}}data-aos="fade-left">
    To cultivate a dynamic ecosystem that inspires innovation and excellence in drone technology, electric vehicles, 
    and advanced electronics—empowering students to drive the future of sustainable mobility and intelligent systems 
    for a better tomorrow.
  </p>

          </div>

  
   <div data-aos="fade-up" className='mission'>
      <h2 className='vision-mission-heading'>Mission</h2>
  <ul style={{color:"white"}} data-aos="fade-left">
    <li>Provide a collaborative platform for students to learn, design, and experiment with drones, electric vehicles, and electronic systems.</li>
    <li>Equip members with hands-on skills in building, programming, and operating unmanned aerial vehicles (UAVs), electric vehicle prototypes, and related technologies.</li>
    <li>Encourage creativity, teamwork, and problem-solving through workshops, competitions, and research on drones, EVs, and electronics.</li>
    <li>Foster industry connections and knowledge sharing to ensure members stay at the forefront of advancements in aerial robotics, electric mobility, and smart electronics.</li>
    <li>Promote responsible, safe, and innovative applications of drones and electric vehicles for societal and environmental benefit.</li>
  </ul>

   </div>


</div>
   <div className='our-works' style={{width:'100%',margin:0,padding:0,}}>
    <h4 className='our-works-heading'>OUR WORKS</h4>
    <p  className='our-works-paragraph'>-Why we are here-</p>
     <div  className='slider-card-Large-device' style={{ width: '100%', margin: '0px' ,padding:0}}>
        
      <Slider {...settings}>
        <div  className='slider-card' data-aos="fade-left">
            <div className='Slider-card-inner'>

          <div className='image-container-ourworks'>
            <img src="./icons8-projects-50.png" alt="projects"/>
             <h4>Projects</h4>
  
          </div>
          <div>
             
  <p>Explore innovative drone and electronics projects designed and developed by our club members. From prototype buildups to cutting-edge experiments, this section showcases hands-on learning and creative solutions.</p>


          </div>
          </div>
</div>

<div  data-aos="fade-left" className='slider-card'>
    <div className='Slider-card-inner'>

  <div className='image-container-ourworks'>
    <img src="./icons8-event-40.png" alt="event"/>
      <h4>Event</h4>
  </div>
  <div>
     <p>Stay updated on upcoming workshops, competitions, guest lectures, and collaborative events. Join us to expand your skills, network with experts, and participate in exciting tech activities.</p>


  </div>
  </div>


 </div>

<div  data-aos="fade-left"  className='slider-card'>
  <div className='Slider-card-inner'>

  
  <div  className='image-container-ourworks'>
    <img className='ourworks-Icon' src="./icons8-discussion-50.png" alt="event"/>
      <h4>Discussions</h4>
  </div>
  <div>
     <p>A vibrant forum for members and enthusiasts to share ideas, ask questions, troubleshoot technical challenges, and discuss the latest trends in drones, electronics, and electric vehicles.</p>

  </div>
  </div>
  
 </div>

<div  data-aos="fade-left" className='slider-card'>
    <div className='Slider-card-inner'>

  <div className='image-container-ourworks'>
    <img src="./icons8-discussion-50.png" alt="event"/>
        <h4>Resources</h4>
  </div>
  <div>
      <p>Access tutorials, documentation, research articles, and software tools carefully curated to accelerate your learning and project development in drone technology, electronics, and electric vehicles.</p>

  </div>
  </div>

</div>

      </Slider>
    </div>
    <div  className='slider-card-Small-device' style={{ width: '100%', margin: '0px' ,padding:0}}>
        
      
        <div  className='slider-card' data-aos="fade-left">
            <div className='Slider-card-inner'>

          <div className='image-container-ourworks'>
            <img src="./icons8-projects-50.png" alt="projects"/>
             <h4>Projects</h4>
  
          </div>
         
             
  <p>Explore innovative drone and electronics projects designed and developed by our club members. From prototype buildups to cutting-edge experiments, this section showcases hands-on learning and creative solutions.</p>


        
          </div>
</div>

<div  data-aos="fade-left" className='slider-card'>
    <div className='Slider-card-inner'>

  <div className='image-container-ourworks'>
    <img src="./icons8-event-40.png" alt="event"/>
      <h4>Event</h4>
  </div>
  
     <p>Stay updated on upcoming workshops, competitions, guest lectures, and collaborative events. Join us to expand your skills, network with experts, and participate in exciting tech activities.</p>


  
  </div>


 </div>

<div  data-aos="fade-left"  className='slider-card'>
  <div className='Slider-card-inner'>

  
  <div  className='image-container-ourworks'>
    <img className='ourworks-Icon' src="./icons8-discussion-50.png" alt="event"/>
      <h4>Discussions</h4>
  </div>
  
     <p>A vibrant forum for members and enthusiasts to share ideas, ask questions, troubleshoot technical challenges, and discuss the latest trends in drones, electronics, and electric vehicles.</p>

  </div>
  
 </div>

<div  data-aos="fade-left" className='slider-card'>
    <div className='Slider-card-inner'>

  <div className='image-container-ourworks'>
    <img src="./icons8-discussion-50.png" alt="event"/>
        <h4>Resources</h4>
  </div>
 
      <p>Access tutorials, documentation, research articles, and software tools carefully curated to accelerate your learning and project development in drone technology, electronics, and electric vehicles.</p>

  
  </div>

</div>

      
    </div>

    

   </div>
   <div className='club-coordinator-details'>
    <h4 style={{color:"white",marginTop:'20px',fontSize:'18px'}}>Meet Our Club Coordinator</h4>
     <CoordinatorDetails/>

   </div>
   <div className='Team-Container'>
      <Team/>
   </div>
   
  
   <div style={{display:'flex',flexDirection:'column',margin:0,padding:0,alignItems:'center',justifyContent:'center'}}>
      <h4 style={{alignSelf:'center',color:'white'}}>Community Overview & Statistics</h4>
    <section className="home-stats-grid">
       
        <div className="home-stat-card">
            <AnimatedCount targetCount={context.stats.totalUsers}/>
            
          <p>Total clubs Members Till Now</p>
          
        </div>
        
        
        
        <div className="home-stat-card">
         
           
           
           <AnimatedCount targetCount={context.events?.length||0}/>
         
         

          
          <p> Totals Events</p>
        </div> 
        <div className="home-stat-card">
             <AnimatedCount targetCount={context.resources?.length||0}/>
          
         
          <p> Totals Resources</p>

        </div>
        
         <div className="home-stat-card">
                <AnimatedCount targetCount={upcomingEvents.length} />
                <p>Upcoming Events</p>
              </div>
              <div className="home-stat-card">
               <AnimatedCount targetCount={ongoingEvents.length} />
                <p>Ongoing Events</p>
              </div>
        <div className="home-stat-card">
         
            <AnimatedCount targetCount={context.notifications?.length||0}/>
       
             
       
        
          <p>Active Notifications</p>
        </div>
      </section>


   </div>

  
      
        <div className='Footer-container'>
          
          <Footer/>

        </div>
        
       
    </div>
      )}
        
              

      
    </eyantraContext.Consumer>
   
  
    
   
   
  );
};

export default Home;
