import React, { useState,useContext } from 'react';
import './NewEvent.css'
import eyantraContext from '../../../../../context/eyantraContext';
const API_BASE = import.meta.env.MODE === 'production'
  ? "https://eynatranitandhra.onrender.com"
  : import.meta.env.VITE_API_URL;
const CLOUD_NAME = import.meta.env.VITE_CLOUD_NAME;
const UPLOAD_PRESET = import.meta.env.VITE_UPLOAD_PRESET;

const EventForm = () => {
  const context=useContext(eyantraContext)
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [startdate, setstartDate] = useState('');
  const [starttime, setstartTime] = useState('');
  const [enddate, setendDate] = useState('');
  const [endtime, setendTime] = useState('');
  const [isRegister, setIsRegister] = useState(false);
  const [cost, setCost] = useState('');
  const [banner, setBanner] = useState(null);
  const [images, setImages] = useState([]);
  const [location, setLocation] = useState('');
  const [organizer, setOrganizer] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [about,setAbout]=useState('')
  const [msg,setmsg]=useState('');

  // Handle single banner upload
  const handleBannerChange = (e) => {
    if (e.target.files.length > 0) {
      setBanner(e.target.files[0]);
    }
  };

  // Handle multiple images upload
  const handleImagesChange = (e) => {
    const files = Array.from(e.target.files);
    setImages(files);
  };

   const uploadToCloudinary = async (file) => {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('upload_preset', UPLOAD_PRESET);

  const res = await fetch(`https://api.cloudinary.com/v1_1/${CLOUD_NAME}/upload`, {
    method: 'POST',
    body: formData,
  });

  const data = await res.json();
  return data.secure_url; 
};
  const handleSubmit = async (e) => {
  e.preventDefault();
  setmsg('Uploading images, please wait...');

  try {
  
    let bannerUrl = '';
    if (banner) {
      bannerUrl = await uploadToCloudinary(banner);
    }

   
    const imageUrls = [];
    for (const imgFile of images) {
      const url = await uploadToCloudinary(imgFile);
      imageUrls.push(url);
    }

    // Prepare event data to send to backend
    const eventData = {
      title,
      description,
      about,
      startdate,
      starttime,
      enddate,
      endtime,
      isRegisterType: isRegister,
      cost: isRegister ? cost : null,
      location,
      organizerName: organizer,
      contactEmail,
      EventBanner: bannerUrl,
      imageUrl: imageUrls,
    };

    // Send data to backend API
    const response = await fetch(`${API_BASE}/api/events/event/post`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(eventData),
    });

    if (response.ok) {
      setmsg('Successfully Added');
      context.getEvents();

      setTitle('');
  setDescription('');
  setstartDate('');
  setstartTime('');
  setendDate('');
  setendTime('');
  setIsRegister(false);
  setCost('');
  setBanner(null);
  setImages([]);
  setLocation('');
  setOrganizer('');
  setContactEmail('');
  setAbout('');
  setmsg('');
    } else {
      setmsg('Failed to submit event');
    }
  } catch (error) {
    setmsg('Internal Server Error');
    //console.error(error);
  }
}
  return (
    <form onSubmit={handleSubmit} className='admin-event-form '>
    
      <h2  className='event-form-title'>Create Event</h2>
      <div className='EventForm-form-group'>
        <label className='event-form-label'>
        Title
        
      </label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
           className='event-form-input'
          placeholder="Event title"
        />
      </div>

      
     <div className='EventForm-form-group'>
      <label className='event-form-label'>
        Description
        </label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
          className='event-form-textarea'
          placeholder="Event description"
        />

     </div>
     <div className='EventForm-form-group'>
      <label className='event-form-label'>
        About
        </label>
        <textarea
          value={about}
          onChange={(e) => setAbout(e.target.value)}
          required
          className='event-form-textarea'
          placeholder="Event description"
        />

     </div>
      
      
    <div className='EventForm-form-group'>
         <label className='event-form-label'>
        Start Date
        </label>
        <input
           className='event-form-input'
          type="date"
          value={startdate}
          onChange={(e) => setstartDate(e.target.value)}
          required
        />

    </div>
   
      
      <div className='EventForm-form-group'>
         <label className='event-form-label'>
        Start Time
        </label>
        <input
           className='event-form-input'
          type="time"
          value={starttime}
          onChange={(e) => setstartTime(e.target.value)}
          required
        />
      


      </div>
      <div className='EventForm-form-group'>
         <label className='event-form-label'>
        End Date
        </label>
        <input
           className='event-form-input'
          type="date"
          value={enddate}
          onChange={(e) => setendDate(e.target.value)}
          required
        />

    </div>
   
      
      <div className='EventForm-form-group'>
         <label className='event-form-label'>
        End Time
        </label>
        <input
           className='event-form-input'
          type="time"
          value={endtime}
          onChange={(e) => setendTime(e.target.value)}
          required
        />
      


      </div>
     
       <div className='EventForm-form-group'>
        <label className='event-form-label'>
        Registration Required?
       
      </label>
       <input
           className='event-form-input'
          type="checkbox"
          checked={isRegister}
          onChange={() => setIsRegister(!isRegister)}
        />

       </div>
      

      {isRegister && (
        <div className='EventForm-form-group'>

        
        <label className='event-form-label'>
          Cost (USD)
           </label>
          <input
            type="number"
            min="0"
            step="0.01"
            value={cost}
             className='event-form-input'
            onChange={(e) => setCost(e.target.value)}
            placeholder="Enter cost"
            required={isRegister}
          />
          </div>
       
      )}
       <div className='EventForm-form-group'>
          <label className='event-form-label'>
        Event Banner
        </label>
        <input    className='event-form-input' type="file" accept="image/*" onChange={handleBannerChange} />
      

       </div>
    
      {banner && (
        <div className='EventForm-form-group'>
          <em>Banner Preview:</em>
          <img
            src={URL.createObjectURL(banner)}
            alt="Banner Preview"
            style={{ maxWidth: '100%', maxHeight: 200, display: 'block', marginTop: 8 }}
          />
        </div>
      )}
      <div className='EventForm-form-group'>
           <label className='event-form-label'>
        Event Images
        </label>
        <input
           className='event-form-input'
            type="file"
          accept="image/*"
          multiple
          onChange={handleImagesChange}
        />
      

      </div>
   
      {images.length > 0 && (
        <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', marginTop: 8 }}>
          {images.map((img, i) => (
            <img
              key={i}
              src={URL.createObjectURL(img)}
              alt={`Event Image ${i + 1}`}
              style={{ width: 100, height: 100, objectFit: 'cover' }}
            />
          ))}
        </div>
      )}

      {/* Additional suggested inputs */}
      <div className='EventForm-form-group'>
         <label className='event-form-label'>
        Location
         </label>
        <input
          type="text"
          value={location}
             className='event-form-input'
          onChange={(e) => setLocation(e.target.value)}
          placeholder="Event location"
        />
     

      </div>
     
       <div className='EventForm-form-group'>
          <label className='event-form-label'>
        Organizer Name
        </label>
        <input
          type="text"
          value={organizer}
             className='event-form-input'
          onChange={(e) => setOrganizer(e.target.value)}
          placeholder="Organizer"
        />

       </div>
    
      
     <div className='EventForm-form-group'>
      <label className='event-form-label'>
        Contact Email
         </label>
        <input
          type="email"
             className='event-form-input'
          value={contactEmail}
          onChange={(e) => setContactEmail(e.target.value)}
          placeholder="Email for contact"
        />
     

     </div>
      

      <button className='event-form-button' type="submit" style={{ marginTop: 16 }}>
        Submit Event
      </button>
    </form>
  );
};

export default EventForm;
