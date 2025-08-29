import React, { useState } from "react";
const CLOUD_NAME = import.meta.env.VITE_CLOUD_NAME;
const UPLOAD_PRESET = import.meta.env.VITE_UPLOAD_PRESET;
const API_BASE = import.meta.env.MODE === 'production'
  ? "https://eynatranitandhra.onrender.com"
  : import.meta.env.VITE_API_URL;



import "./newProjects.css";

const NewProject = () => {
  const [formData, setFormData] = useState({
    
    name: "",
    description: "",
    startDate: "",
    endDate: "",
    status: "planned",
    teamMembers: "",
    budget: ""
  });
  const [projectposter,setProjectPoster]=useState('')

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const handleProjectPoster = (e) => {
 
    if (e.target.files.length > 0) {
      setProjectPoster(e.target.files[0])
    }
  };
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };
 const uploadToCloudinary=async(file)=>{
  const formData = new FormData();
  formData.append('file',file)
  formData.append('upload_preset', UPLOAD_PRESET);
  const res = await fetch(`https://api.cloudinary.com/v1_1/${CLOUD_NAME}/upload`, {
    method: 'POST',
    body: formData,
  });
  const data = await res.json();
  return data.secure_url; 

 }
  const handleSubmit = async (e) => {
  e.preventDefault();
  setLoading(true);
  setMessage("");

  try {
    let projectposterUrl = "";

    if (projectposter) {
      projectposterUrl = await uploadToCloudinary(projectposter);
    }

    const payload = {
      ...formData,
      teamMembers: formData.teamMembers
        ? formData.teamMembers.split(",").map((m) => m.trim())
        : [],
     projectposterUrl,
    };

    const res = await fetch(`${API_BASE}/api/projects/project/post`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    const data = await res.json();

    if (res.ok) {
      setMessage("✅ Project created successfully!");
      setFormData({
        name: "",
        description: "",
        startDate: "",
        endDate: "",
        status: "planned",
        teamMembers: "",
        budget: ""
      });
      setProjectPoster(""); // Reset file input
    } else {
      setMessage("❌ " + (data.errorMsg || "Failed to create project."));
    }
  } catch (err) {
    console.error(err);
    setMessage("⚠️ Server error, please try again later.");
  } finally {
    setLoading(false);
  }
};


  return (
    <form className="new-project-form" onSubmit={handleSubmit}>
      <h2 className="new-project-form__title">Create New Project</h2>

      <div className="new-project-form__group">
        <label className="new-project-form__label">Project Name</label>
        <input
          type="text"
          name="name"
          value={formData.name}
          className="new-project-form__input"
          onChange={handleChange}
          required
        />
      </div>

      <div className="new-project-form__group">
        <label className="new-project-form__label">Description</label>
        <textarea
          name="description"
          value={formData.description}
          className="new-project-form__textarea"
          onChange={handleChange}
          required
        />
      </div>

      <div className="new-project-form__group">
        <label className="new-project-form__label">Start Date</label>
        <input
          type="date"
          name="startDate"
          value={formData.startDate}
          className="new-project-form__input"
          onChange={handleChange}
        />
      </div>
      <div className="new-project-form__group">
        <label className="new-project-form__label">End Date</label>
        <input
          type="date"
          name="endDate"
          value={formData.endDate}
          className="new-project-form__input"
          onChange={handleChange}
        />
      </div>

      <div className="new-project-form__group">
        <label className="new-project-form__label">Project Poster</label>
        <input
          type="file"
          name="projectposter"
        
          className="new-project-form__input"
          onChange={handleProjectPoster}
        />
      </div>
      {projectposter && (
    <p style={{color:'white',fontSize:'12px'}}>Selected file: {projectposter.name}</p>
  )}
      {projectposter && (
        <div className='EventForm-form-group'>
          <em>Project Poster</em>
          <img
            src={URL.createObjectURL(projectposter)}
            alt="Banner Preview"
            style={{ maxWidth: '100%', maxHeight: 200, display: 'block', marginTop: 8 }}
          />
        </div>
      )}

      <div className="new-project-form__group">
        <label className="new-project-form__label">Status</label>
        <select
          name="status"
          value={formData.status}
          className="new-project-form__select"
          onChange={handleChange}
        >
          <option value="planned">Planned</option>
          <option value="in-progress">In-Progress</option>
          <option value="completed">Completed</option>
          <option value="on-hold">On-Hold</option>
        </select>
      </div>

      <div className="new-project-form__group">
        <label className="new-project-form__label">
          Team Members (comma separated)
        </label>
        <input
          type="text"
          name="teamMembers"
          value={formData.teamMembers}
          className="new-project-form__input"
          onChange={handleChange}
        />
      </div>

      <div className="new-project-form__group">
        <label className="new-project-form__label">Budget ($)</label>
        <input
          type="number"
          name="budget"
          value={formData.budget}
          className="new-project-form__input"
          onChange={handleChange}
        />
      </div>

      <button type="submit" className="new-project-form__button" disabled={loading}>
        {loading ? "Saving..." : "Create Project"}
      </button>

      {message && <p style={{ color: "white", marginTop: "10px", textAlign: "center" }}>{message}</p>}
    </form>
  );
};

export default NewProject;
