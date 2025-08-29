import React, { useState, useEffect, useContext } from 'react';
import eyantraContext from '../../../context/eyantraContext';
import { Carousel } from 'react-responsive-carousel';
import 'react-responsive-carousel/lib/styles/carousel.min.css';
import Slider from 'react-slick';
import "slick-carousel/slick/slick.css"; 
import "slick-carousel/slick/slick-theme.css";
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import 'aos/dist/aos.css';
import './publicevent.css';

/*-------------------*/

const EventList = ({ events, showMoreId, setShowMore, openKey, setOpenKey, getdate }) => {
 

  if (!events || events.length === 0) {
    return (
      <div className="events-list">
        <img className='eyantra-events-empty' src="../eyantra-empty.webp" alt="empty-img" />
        <p className='Event-text-empty-public'>No Events Available</p>
      </div>
    );
  }

  return (
    <div className="events">
      {events.map((event, index) => (
        <div
          className={showMoreId === event._id ? "publicevent-card-selected" : "event-public-card"}
          key={event._id || index}
        >
          {/* Poster Image */}
          <div className="Banner-Image">
            <img
              src={event.EventBanner}
              alt={`${event.title} Poster`}
              className="event-poster"
            />
          </div>

          {/* Event Details */}
          <div className="event-details">
            <h3 className="publicevent-details-title">{event.title}</h3>
            <p className="publicevent-details-description">{event.description}</p>

            {/* From Section */}
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <div>
                <h4 className="public-event-from-to-time">From</h4>
                <p className="publicevent-datetime">{getdate(event.startdate)}</p>
              </div>
              <div>
                <h4 className="public-event-from-to-time">Time</h4>
                <p className="publicevent-datetime">{event.starttime}</p>
              </div>
            </div>

            {/* To Section */}
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <div>
                <h4 className="public-event-from-to-time">To</h4>
                <p className="publicevent-datetime">{getdate(event.enddate)}</p>
              </div>
              <div>
                <h4 className="public-event-from-to-time">Time</h4>
                <p className="publicevent-datetime">{event.endtime}</p>
              </div>
            </div>

            {/* Register Button */}
            {event.isRegisterType === "Register" && (
              <button className="register-btn">Register</button>
            )}

            {/* Expand/Collapse Button */}
            <div
  onClick={() => {
    if (openKey === index) {
      setOpenKey(null);
      setShowMore(null);
    } else {
      setOpenKey(index);
      setShowMore(event._id);
    }
  }}
  style={{ cursor: 'pointer', display: 'inline-flex', alignItems: 'center', marginTop: 10 }}
  aria-label={openKey === index ? "Collapse details" : "Expand details"}
>
  {openKey === index ? (
    <ExpandLessIcon style={{ color: "white" }} />
  ) : (
    <ExpandMoreIcon style={{ color: "white" }} />
  )}
</div>

          </div>

          {/* Show More Section */}
          {showMoreId === event._id && (
            <div className="event-more-details">
              <div>
                <h4 style={{ color: '#c0cad2ff', marginTop: 10 }}>Location</h4>
                <p className="publicevent-details-loc">{event.location}</p>

                <h4 style={{ color: '#c0cad2ff', marginTop: 10 }}>Organizer</h4>
                <p className="publicevent-details-org">{event.organizerName}</p>

                <h4 style={{ color: '#c0cad2ff', marginTop: 10 }}>Contact Email</h4>
                <p className="publicevent-details-contact">{event.contactEmail}</p>

                <h4 style={{ color: '#c0cad2ff', marginTop: 10 }}>About</h4>
                <p className="publicevent-details-about">{event.about}</p>
              </div>

              {/* Event Images */}
              {event.imageUrl && event.imageUrl.length > 0 && (
                <div style={{ marginTop: 10 }}>
                  <h4 style={{ color: '#c0cad2ff' }}>Event Images</h4>
                  <ul className='image-url'>
                    {event.imageUrl.map((item, idx) => (
                      <img key={idx} className='adminevent-images' src={item} alt="event-image" />
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}
        </div>
      ))}
    </div>
  );
};


      

  




/*-----------------*/



const imagesslider = [
  'EventImages.jpeg',
  'EventImages3.jpeg',
  'EventsImage2.jpeg',
  'GoCart.jpeg'
];

const Event = () => {
  const context = useContext(eyantraContext);
  const [openKey, setOpenKey] = useState(null);
  const [showMoreId, setShowMore] = useState(null);
  const [ongoingevent,setOngoingEvent]=useState([]);
  const [upcomingevent,setUpcomingEvent]=useState([]);
  const [pastevent,setPastEvent]=useState([]);
  
  

  const settings = {
  dots: true,
  infinite: true,
  speed: 500,
  slidesToShow: 1,
  slidesToScroll: 1,
  autoplay: true,
  autoplaySpeed: 3000,
  vertical: false,
  responsive: [
    {
      breakpoint: 1024, // medium devices
      settings: {
        slidesToShow: 1,
        slidesToScroll: 1,
      }
    },
    {
      breakpoint: 768, // small devices
      settings: {
        slidesToShow: 1,
        slidesToScroll: 1,
      }
    },
    {
      breakpoint: 480, // extra-small devices
      settings: {
        slidesToShow: 1,
        slidesToScroll: 1,
      }
    }
  ]
};

  useEffect(() => {
    if (context?.events) {
      

      
const normalize = (dateField, timeField) => {
  // If date is already ISODate, use it; if string, parse it
  const datePart = typeof dateField === "string" 
    ? new Date(dateField) 
    : new Date(dateField);
  if (isNaN(datePart)) return null; // guard
  const [h, m] = timeField ? timeField.split(":") : ["00","00"];
  datePart.setHours(+h, +m, 0, 0);
  return datePart;
};

const now = new Date();

setOngoingEvent(
  context.events.filter(item => {
    const start = normalize(item.startdate, item.starttime);
    const end = normalize(item.enddate, item.endtime);
    return start && end && start <= now && end >= now;
  })
);

setUpcomingEvent(
  context.events.filter(item => {
    const start = normalize(item.startdate, item.starttime);
    return start && start > now;
  })
);

setPastEvent(
  context.events.filter(item => {
    const end = normalize(item.enddate, item.endtime);
    return end && end < now;
  })
);

    }
  }, [context.events]);

  const getdate=(date)=>{
    if (!(date instanceof Date)) {
    date = new Date(date);
  }
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
  }


  return (
    <div className='events-Page'>

      {/* Image Slider Section */}
     
      {/* Image Slider Section */}
      <Carousel
      
    autoPlay            
    interval={3000}     
    infiniteLoop      
    showArrows={true}
  showIndicators={true}
  

    showThumbs={false}  
    showStatus={false} 
    stopOnHover={true}  
  > {imagesslider.map((img, index) => (
    <div style={{margin:0,padding:0}}>
        <img 
          src={img} 
          key={index}
          alt={`Event ${index}` } 
          className="slider-image"/>
      <p>slide {index}</p>

    </div>
      
      
     
    ))}
  </Carousel>
{/*<div className="event-slider">
  <Slider {...settings}>
   
  </Slider>
</div>
*/}

      
    

      {/* Events Section */}
    
       <h4 className='events-page-public-heading'>Eyantra Events: <span style={{color:'#c1c1c1ff'}}>Pioneering the Skies and Streets</span> </h4>
      <p className='public-events-overview'>
        Eyantra is where innovation takes flight—literally and figuratively. 
        Our events are a playground for enthusiasts of electronic vehicles, 
        drones, and robotic flight systems, bringing together visionaries, makers,
         and tech adventurers. From high-speed EV challenges to aerial robotics competitions, 
         we push the boundaries of mobility, autonomy, and engineering creativity. 
         Participants get hands-on experience, exploring everything from design and coding to
          real-world testing, while showcasing solutions that could transform transport and air technology.
           At Eyantra, the future of ground-breaking vehicles and airborne robots is built, tested, and celebrated
      </p>
      
    
        <div style={{margin:0,padding:0}}>
          <div style={{overflowY:'scroll', scrollbarWidth:'none'}}>
               <h2 className='public-event-type-heading'>Ongoing Events</h2>
      <EventList events={ongoingevent}  showMoreId={showMoreId} setShowMore={setShowMore} openKey={openKey} setOpenKey={setOpenKey} getdate={getdate} />

          </div>
          <div style={{overflowY:'scroll', scrollbarWidth:'none'}}>
            <h2  className='public-event-type-heading'>Upcoming Events</h2>
      <EventList events={upcomingevent} showMoreId={showMoreId}  setShowMore={setShowMore} openKey={openKey} setOpenKey={setOpenKey} getdate={getdate} />

          </div>
       
        <div style={{overflowY:'scroll', scrollbarWidth:'none'}}>
          
      <h2  className='public-event-type-heading'>Past Events</h2>
      <EventList events={pastevent} showMoreId={showMoreId}  setShowMore={setShowMore} openKey={openKey} setOpenKey={setOpenKey} getdate={getdate}  />

        </div>

      


        </div>
    </div>
  );
};

export default Event;
