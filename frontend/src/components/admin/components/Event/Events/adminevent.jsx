import React, { useState, useEffect, useContext } from 'react';
import AddIcon from '@mui/icons-material/Add';
import SwipeableDrawer from '@mui/material/SwipeableDrawer';
import eyantraContext from '../../../../../context/eyantraContext';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import './event.css';
const API_BASE = import.meta.env.MODE === 'production'
  ? "https://eynatranitandhra.onrender.com"
  : import.meta.env.VITE_API_URL;
import EventForm from '../NewEvent/NewEvent';


const Events = () => {
  const context = useContext(eyantraContext);
  const [open, setOpen] = useState(false);
  
  const [hoverIndex, setHoverIndex] = useState(null);
  const [ongoingevent,setOngoingEvent]=useState([]);
  const [upcomingevent,setUpcomingEvent]=useState([]);
  const [pastevent,setPastEvent]=useState([]);



  useEffect(() => {
    
    

    //console.log(context.events)
    

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

  // Delete event function for event with given id
  const deleteRequestedEvent = async (id) => {
    try {
      const response = await fetch(`${API_BASE}/api/events/event/delete/${id}`, {
        method: 'DELETE',
      });
      if (response.status === 200) {
        // Show success message if desired
        context.getEvents();
      } else {
        // Handle failure
        console.error('Failed to delete event');
      }
    } catch (err) {
      console.error('Error deleting event:', err);
    }
  };

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

  // EventCard component for individual event display
  const EventCard = ({ event , expanded,onHover}) => (
    <div className={expanded?"event-card-selected":"event-card"}
    onMouseEnter={onHover(true)}
    onMouseLeave={onHover(false)}
    >
      <img
        className="remove-btn"
        onClick={() => deleteRequestedEvent(event.id)} // Use event.id here consistently
        src="../icons8-remove-50 (1).png"
        alt="Remove"
        style={{ cursor: 'pointer', alignSelf: 'flex-end', width: '24px', height: '24px' }}
      />

      <img src={event.EventBanner} alt={`${event.title} Poster`} className="event-poster" />
      <div className="event-details">
        <h3 className='adminevent-details-title'>{event.title}</h3>
        <p className='adminevent-details-description'>{event.description}</p>
        <div className='adminstartend-date-container' style={{margin:0,padding:0}}>
          <div style={{margin:0,padding:0}}>
             <h4 style={{margin:0,color:'#306b9fff'}}>From</h4>
            <p className="adminevent-datetime">{getdate(event.startdate)}</p>
       
          </div>
          <div style={{margin:0,padding:0}}>
            <h4 style={{margin:0,color:'#306b9fff'}}>Time</h4>
             <p className="adminevent-datetime">{event.starttime}</p>

          </div>
            

        </div>
        <div className='adminstartend-date-container' style={{margin:0,padding:0}}>
          <div style={{margin:0,padding:0}}>
            <h4 style={{margin:0,color:'#306b9fff'}}>To</h4>
            <p className="adminevent-datetime">{getdate(event.enddate)}</p>
       

          </div>
          <div style={{margin:0,padding:0}}>
            <h4 style={{margin:0,color:'#306b9fff'}}>Time</h4>
            <p className="adminevent-datetime">{event.endtime}</p>
       

          </div>

        
        </div>
          <div style={{ textAlign: 'center', marginTop: '5px' ,display:'flex',alignItems:'flex-end', }}>
      {expanded ? (
        <ExpandLessIcon style={{ color: 'black' }} />
      ) : (
        <ExpandMoreIcon style={{ color: 'black' }} />
      )}
    </div>
    {
      expanded &&
      <>
      <div style={{margin:0,padding:0}}>
          <div style={{margin:0,padding:0}}>
            <h4 style={{margin:0,color:'#306b9fff'}}>location</h4>
            <p  className='adminevent-details-loc'>{event.location}</p>
          </div>
          <div style={{margin:0,padding:0}}>
            <h4 style={{margin:0,color:'#306b9fff'}}>organizerName</h4>
             <p  className='adminevent-details-org'>{event.organizerName}</p>
          </div>
          <div style={{margin:0,padding:0}}>
            <h4 style={{margin:0,color:'#306b9fff'}}>contactEmail</h4>
             <p  className='adminevent-details-contact'>{event.contactEmail}</p>
          </div>
          <div style={{margin:0,padding:0}}>
            <h4 style={{margin:0,color:'#306b9fff'}}>About</h4>
            <p className='adminevent-details-about'>{event.about}</p>
          </div>
      
        </div>
        <div style={{margin:0,padding:0}}>
          <h4 style={{margin:0,color:'#306b9fff'}}>Event Images</h4>
          <ul className='image-url'>

         
          {
            event.imageUrl.map(item=>{
              return(
              <img className='adminevent-images' src={item} alt="event-image/"/>
              )
            })
          }
          </ul>
        </div>
        </>
    }
        
        
        {event.type === "Register" && (
          <button className="register-btn" onClick={() => alert(`Register for ${event.title}`)}>
            Register
          </button>
        )}
      </div>
    </div>
  );

  return (
    <div className="events-page">
      <SwipeableDrawer
        anchor="right"
        open={open}
        onClose={toggleDrawer(false)}
        onOpen={toggleDrawer(true)}
        PaperProps={{
          sx: {
            m: 0,
            p: 0,
            boxSizing: 'border-box',
          },
        }}
        ModalProps={{
          keepMounted: true,
          BackdropProps: { sx: { backgroundColor: 'rgba(0,0,0,0.5)' } },
          sx: { display: 'flex', justifyContent: 'flex-end' },
        }}
      >
        <EventForm />
      </SwipeableDrawer>

      <div className="AddeventIcon">
        <AddIcon onClick={() => setOpen(true)} style={{ color: 'black' }} />
      </div>

      <h4 className='admin-events-heading'>Eyantra Events: <span style={{color:'#8a8a8aff'}}>Pioneering the Skies and Streets</span> </h4>
      <p className='admin-events-overview'>
        Eyantra is where innovation takes flight—literally and figuratively. 
        Our events are a playground for enthusiasts of electronic vehicles, 
        drones, and robotic flight systems, bringing together visionaries, makers,
         and tech adventurers. From high-speed EV challenges to aerial robotics competitions, 
         we push the boundaries of mobility, autonomy, and engineering creativity. 
         Participants get hands-on experience, exploring everything from design and coding to
          real-world testing, while showcasing solutions that could transform transport and air technology.
           At Eyantra, the future of ground-breaking vehicles and airborne robots is built, tested, and celebrated
      </p>
     
      <section style={{ width: '100%' }}>
        <h2>Ongoing Events</h2>
        {
          ongoingevent.length===0?(
             <div className="events-list">
              <img className='eyantra-events-empty' src="../eyantra-empty.webp" alt="empty-imag"/>
              <p className='Event-text-empty'>Post Events to view</p>
        </div>

          ):(
             <div className="events-list">
          {ongoingevent?.map(event => (
            <EventCard key={event._id} event={event}
              expanded={hoverIndex === event._id}
              onHover={(state) => () => setHoverIndex(state ? event._id : null)}
             />
          ))}
        </div>
          )
        }
       
      </section>

      <section>
        <h2>Upcoming Events</h2>
        {
          upcomingevent.length===0?(
             <div className="events-list">
              <img className='eyantra-events-empty' src="../eyantra-empty.webp" alt="empty-imag"/>
              <p className='Event-text-empty'>Post Events to view</p>
        </div>

          ):(
             <div className="events-list">
          {
          
          upcomingevent.map(event => (
            <EventCard key={event._id} event={event}
             expanded={hoverIndex === event._id}
              onHover={(state) => () => setHoverIndex(state ? event._id : null)}
    />
          ))}
        </div>
          )
        }
       
      </section>

      <section>
        <h2>Past Events</h2>
         {
          pastevent.length===0?(
             <div className="events-list">
              <img className='eyantra-events-empty' src="../eyantra-empty.webp" alt="empty-imag"/>
              <p className='Event-text-empty'>Post Events to view</p>
        </div>

          ):(
             <div className="events-list">
          {
          
          pastevent.map(event => (
            <EventCard key={event._id}
             expanded={hoverIndex === event._id}
              onHover={(state) => () => setHoverIndex(state ? event._id : null)}
   
             event={event} />
          ))}
        </div>
          )
        }
       
      </section>
    </div>
  );
};

export default Events;
