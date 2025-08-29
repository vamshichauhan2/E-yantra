// TeamForm.js
import React, { useState ,useContext} from 'react';
import eyantraContext from '../../../../../context/eyantraContext';
import axios from 'axios';
const CLOUD_NAME = import.meta.env.VITE_CLOUD_NAME;
const UPLOAD_PRESET = import.meta.env.VITE_UPLOAD_PRESET;
const API_BASE = import.meta.env.MODE === 'production'
  ? "https://eynatranitandhra.onrender.com"
  : import.meta.env.VITE_API_URL;



import './addTeam.css';

const TeamMemberForm = () => {
  const context=useContext(eyantraContext)
  const [name, setName] = useState('');
  const [gender, setGender] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState('');
  const [studyYear, setStudyYear] = useState('');
  const [phone, setPhone] = useState('');
  const [bio, setBio] = useState('');
  const [batch,setbatch]=useState('');
   const [image, setImage] = useState(''); 
    const [imageUrl, setImageUrl] = useState('');
  const [msg,setMsg]=useState('')



  const handleImageChange = async (e) => {
    setImage(e.target.files[0])
  const file = e.target.files[0];
  if (!file) return;
  
  const formData = new FormData();
  formData.append('file', file);
  formData.append('upload_preset', UPLOAD_PRESET);

  try {
    const res = await axios.post(
      `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/upload`,
      formData
    );
    setImageUrl(res.data.secure_url); // Store image URL for backend submission
  } catch (error) {
    console.error('Cloudinary upload error:', error);
    setMsg('Image upload failed, please try again');
  }
};

  const handleSubmit = async (e) => {
  e.preventDefault();
  //console.log('step1')
  const memberData = {
    name,
    gender,
    email,
    role,
    studyYear,
    phone,
    bio,
    batch,
    imageUrl,  // Important: include uploaded image URL here
  };
//console.log('step2')
  try {
    const response = await fetch(`${API_BASE}/api/teams/add/newMember`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(memberData),
    });
    if (response.status === 200) {
      setMsg('Successfully Added');
      context.getTeamMembers();


    
 setName('');
  setGender('');
  setEmail('');
  setRole('');
  setStudyYear('');
  setPhone('');
  setBio('');
  setBatch('');
  setImage(null);
  setImageUrl('');
  setMsg('');
      // reset form if needed
    }
    //console.log('step2')
  } catch (err) {
    console.error(err);
    setMsg('Sorry, unable to add. Try again later.');
  }
};


  return (
    <form onSubmit={handleSubmit} className="team-form">
      <h2 className="team-form-title">Add Team Member</h2>

      <div className="teamForm-form-group">
        <label className="team-form-label">Name</label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          className="team-form-input"
          placeholder="Full name"
        />
      </div>
      <div className="teamForm-form-group">
  <label className="team-form-label">Gender</label>
  <select
    style={{background:'black'}}


    value={gender}
    onChange={(e) => setGender(e.target.value)}
    required
    className="team-form-input"
  >
    <option value="">Select gender</option>
    <option value="male">Male</option>
    <option value="female">Female</option>
  </select>
</div>


      <div className="teamForm-form-group">
        <label className="team-form-label">Email</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="team-form-input"
          placeholder="Email address"
        />
      </div>

      <div className="teamForm-form-group">
        <label className="team-form-label">Role</label>
        <input
          type="text"
          value={role}
          onChange={(e) => setRole(e.target.value)}
          required
          className="team-form-input"
          placeholder="Role in team"
        />
      </div>

      <div className="teamForm-form-group">
        <label className="team-form-label">Study Year</label>
        <input
          type="text"
          value={studyYear}
          onChange={(e) => setStudyYear(e.target.value)}
          className="team-form-input"
          placeholder="Study year or class"
        />
      </div>


      <div className="teamForm-form-group">
        <label className="team-form-label">Phone</label>
        <input
          type="tel"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          className="team-form-input"
          placeholder="Phone number"
        />
      </div>
       <div className="teamForm-form-gro
      imageUrl, up">
        <label className="team-form-label">batch</label>
        <input
          type="String"
          value={batch}
          onChange={(e) => setbatch(e.target.value)}
          className="team-form-input"
          placeholder="please enter your academic year ie year-year"
        />
      </div>
       <div className="teamForm-form-group">
        <label className="team-form-label">Profile Image</label>
        <input
          type="file"
          onChange={handleImageChange}
          accept="image/*"
          className="team-form-input"
        />
      </div>
     {image && <img src={URL.createObjectURL(image)} alt="selected-Image" style={{ maxWidth: '100%', maxHeight: 200 }} />}


      <div className="teamForm-form-group">
        <label className="team-form-label">Bio</label>
        <textarea
          value={bio}
          onChange={(e) => setBio(e.target.value)}
          className="team-form-textarea"
          placeholder="Short bio"
        />
      </div>

      <button type="submit" className="team-form-button" style={{ marginTop: 16 }}>
        Add Member
      </button>
    </form>
  );
};

export default TeamMemberForm;
