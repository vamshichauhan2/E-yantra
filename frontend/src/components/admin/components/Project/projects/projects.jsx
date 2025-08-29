import React, { useContext, useEffect, useState } from 'react';
import SwipeableDrawer from '@mui/material/SwipeableDrawer';
import eyantraContext from '../../../../../context/eyantraContext';
import NewProject from '../Newprojects/newProjects';
import AddIcon from '@mui/icons-material/Add';
import AOS from 'aos';
import 'aos/dist/aos.css';
import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import './projects.css';
const API_BASE = import.meta.env.MODE === 'production'
  ? "https://eynatranitandhra.onrender.com"
  : import.meta.env.VITE_API_URL;



const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 320,
  bgcolor: 'background.paper',
  borderRadius: 3,
  boxShadow: 24,
  p: 4
};

const Projects = () => {
  const context = useContext(eyantraContext);
  const [open, setOpen] = useState(false);
  const [projects, setProjects] = useState([]);
  const [msg, setMsg] = useState('');

 
  const [openUpdate, setOpenUpdate] = useState(false);
  const [currentProjectId, setCurrentProjectId] = useState(null);
  const [newStatus, setNewStatus] = useState('');
  const statusOptions = ['planned', 'in-progress', 'completed', 'on-hold'];
    function setTimeoutmsg(){
          setMsg("")
     }
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

  useEffect(() => {
    AOS.init({
      duration: 800,
      once: true,
      easing: 'ease-in-sine',
    });
    
    

  }, [projects]);

  const handleUpdateSubmit = async () => {
    try {
      const res = await fetch(`${API_BASE}/api/projects/update/${currentProjectId}`, {
        method: "PATCH", // PATCH matches backend
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ status: newStatus })
      });
      if (res.status === 200) {
        setMsg('Status updated!');
        setOpenUpdate(false);
        setCurrentProjectId(null);
        setNewStatus('');
        context.getProjects();
      } else {
        setMsg('Update failed');
      }
    } catch (err) {
      setMsg('Server Error');
    }
  };
  const deleteProject = async (Id) => {
    try {
      const Response = await fetch(`${API_BASE}/api/projects/delete/${Id}`, {
        method: "DELETE",
      });
      if (Response.status === 200) {
        setMsg('Successfully updated');
        context.getProjects();

       let timeoutId = setTimeout(setTimeoutmsg, 2000);
        clearTimeout(timeoutId); 
      }
    } catch (err) {
      setMsg('Server Error Please Try Again after sometime');
       let timeoutId = setTimeout(setTimeoutmsg, 2000);
        clearTimeout(timeoutId); 
    }
  };
  
  

  const handleUpdateProject = (id, curStatus) => {
    setCurrentProjectId(id);
    setNewStatus(curStatus);
    setOpenUpdate(true);
  };

  const handleStatusChange = (e) => {
    setNewStatus(e.target.value);
  };

  

  return (
    <div className="adminproject-cards-container">
          {msg && <p style={{textAlign:'center', display:"flex",alignSelf:"center"}}>{msg}</p>}
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
        <NewProject />
      </SwipeableDrawer>

      <div className="adminAddprojectIcon">
        <AddIcon onClick={() => setOpen(true)} style={{ color: 'black' }} />
      </div>

      
       {
          projects.length===0?(
             <div className="projects-list">
              <img className='eyantra-events-empty' src="../eyantra-empty.webp" alt="empty-imag"/>
              <p className='Event-text-empty'>Post Events to view</p>
        </div>

          ):(<div style={{display:'flex',flexWrap:'wrap',margin:0,padding:0,gap:40}}>
            <h4>Overview of eYantra Projects</h4>
       <p>eYantra is an exciting initiative that brings robotics, embedded systems, and sustainable technology to life. It focuses on creative projects involving electronic drones, planes, and electric vehicles, inspiring students to explore and innovate across multiple fields. One of the proud contributors to eYantra is the National Institute of Technology Andhra Pradesh (NIT AP), located in Tadepalligudem. Established in 2015, NIT AP is well-known for its top-notch technical education and cutting-edge research, especially in electronics, communication, and electric vehicle technologies. Through eYantra, students and researchers from NIT AP get hands-on experience, turning their ideas into real-world robotic and electronic solutions that can make a difference in today’s technology landscape.</p>
   

      {projects.map((item, idx) => (
        <div
          key={item._id}
          className="adminproject-card"
          data-aos="fade-up"
          data-aos-delay={idx * 120}
        >
          <button
            onClick={() => deleteProject(item._id)}
            className="adminprojectdelete-button"
            aria-label="Delete project"
          >
            &#x2715;
          </button>
          <img  className="project-poster" src={item.projectposterUrl} alt="project-poster"/>
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
          {item.status !== 'completed' && (
            <button
              onClick={() => handleUpdateProject(item._id, item.status)}
              className="adminupdate-status-btn"
              style={{ marginTop: 9 }}
            >
              update-status
            </button>
          )}
        </div>
      ))}
      </div>)
}

      <Modal
        open={openUpdate}
        onClose={() => setOpenUpdate(false)}
        aria-labelledby="update-status-modal"
        aria-describedby="update-status-project"
      >
        <Box sx={style}>
          <h3 id="update-status-modal">Update Project Status</h3>
          <FormControl fullWidth sx={{ my: 2 }}>
            <InputLabel id="status-select-label">Status</InputLabel>
            <Select
              labelId="status-select-label"
              value={newStatus}
              label="Status"
              onChange={handleStatusChange}
            >
              {statusOptions.map((s) => (
                <MenuItem key={s} value={s}>
                  {s.charAt(0).toUpperCase() + s.slice(1)}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <Button
            variant="contained"
            color="primary"
            sx={{ mt: 2, width: '100%' }}
            onClick={handleUpdateSubmit}
            disabled={!newStatus || newStatus === ""}
          >
            Update Status
          </Button>
        </Box>
      </Modal>
      
    </div>
  );
};

export default Projects;
