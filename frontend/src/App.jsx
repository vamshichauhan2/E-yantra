import React, { useState, useEffect, useRef } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Cookies from 'js-cookie';
//import CryptoJS from 'crypto-js';
const API_BASE = import.meta.env.MODE === 'production'
  ? "https://eynatranitandhra.onrender.com"
  : import.meta.env.VITE_API_URL;

const SOCKET_URL = import.meta.env.MODE === 'production'
  ? "wss://eynatranitandhra.onrender.com"
  : import.meta.env.VITE_SOCKET_URL;

import About from './components/Eyantra/About/about';
import Contact from './components/Eyantra/Contact/contact';
import Team from './components/Eyantra/TeamMember/team';
import Home from './components/Eyantra/Home/home';
import Event from './components/Eyantra/Events/event';
import PublicLayout from './components/PublicLayout';
import ProtectedLayout from './components/ProtectedLayout';
import AdminDashboard from './components/admin/components/Dashboard/admindashboard';
import AdminHome from './components/admin/components/Home/adminhome';
import Events from './components/admin/components/Event/Events/adminevent';
import Teams from './components/admin/components/Team/Teams/adminteam';
import Notifications from './components/admin/components/Notification/Notifications/notifications';
import AdminLogin from './components/admin/Auth/Login/login';
import Registration from './components/admin/Auth/Registration/registration';
import Resources from './components/admin/components/Resource/Resources/resources';
import eyantraContext from './context/eyantraContext';
import Project from './components/Eyantra/ProjectPublic/project';
import Projects from './components/admin/components/Project/projects/projects';
import PublicResources from './components/Eyantra/Resource/resource';
import ChangePassword1 from './components/admin/Auth/ChangePassword1/ChangePassword1';
import NotFound from './components/NotFound/notFound';
import DeleteAllUsers from './components/admin/components/ResetUser/resetdata';
import './App.css';

const sentence = [
  "Welcome to e-Yantra Club",
  "Innovating with Drones",
  "Driving the Future with Electric Cars",
  "Where Technology Meets Creativity"
];

const backgroundColor = () => `#${Math.floor(Math.random() * 16777215)
  .toString(16)
  .padStart(6, "0")}`;

const App = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showHomepage, setShowHomepage] = useState(false);
  const timeoutId = useRef(null);
   const [stats, setStats] = useState({
    totalUsers: 0,
    totalAdmins: 0,
    totalSecretaries: 0,
    totalJointSecretaries: 0
  });

  const [notifications, setNotifications] = useState([]);
  const [resources, setResources] = useState([]);
  const [teamMembers, setTeamMembers] = useState([]);
  const [events, setEvents] = useState([]);
  const [projects, setProjects] = useState([]);
  const [Id,setuserId]=useState(null)
  const [username,setusername]=useState('')
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);


    const fetchStats = async () => {
    try {
      const res = await fetch(`${API_BASE}/api/stats`);
      if (!res.ok) throw new Error('Failed to fetch stats');
      const data = await res.json();
      setStats(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };


useEffect(() => {
   async function fetchDecryptedId() {
    const storedToken = Cookies.get("jwt_token");
    if (storedToken) {
      try {
        const response = await fetch(`${API_BASE}/api/user/decrypt/${storedToken}`);
        if (response.ok) {
          const decryptedId = await response.json();
          setuserId(decryptedId);
        }
      } catch (err) {
        console.error("Decryption failed:", err);
      }
    }
  }

  fetchDecryptedId();

  getNotifications();
  getResources();
  getTeamMembers();
  getEvents();
  getProjects();
  fetchStats();
}, []);

// 2. Call getUserName only when Id is available
useEffect(() => {
  if (Id) {
    getUserName();
  }
}, [Id]);

  

  const animateLogos = () => {
    timeoutId.current = setTimeout(() => {
      setCurrentIndex((prev) => {
        if (prev < sentence.length - 1) {
          return prev + 1;
        } else {
          setShowHomepage(true);
          return prev;
        }
      });
    }, 2000);
  };

  useEffect(() => {
    if (!showHomepage) {
      animateLogos();
    }
    return () => clearTimeout(timeoutId.current);
  }, [currentIndex, showHomepage]);
  const getUserName=async()=>{
    
    try{
      const response=await fetch(`${API_BASE}/api/get/username/${Id}`);
      if(response.status===200){
        const data=await response.json();
        setusername(data);
      }
    }catch(err){
      console.log(err);
    }
  }
  const getProjects = async () => {
    try {
      const response = await fetch(`${API_BASE}/api/projects/project/get`);
      if (response.ok) {
        const data = await response.json();
        setProjects(data);
      } else {
        console.error('Failed to fetch projects');
      }
    } catch (error) {
      console.error('Error fetching projects:', error);
    }
  };

  const getEvents = async () => {
    try {
      const response = await fetch(`${API_BASE}/api/events/get`);
      if (response.ok) {
        const data = await response.json();
        setEvents(data);
      } else {
        console.error('Failed to fetch events');
      }
    } catch (error) {
      console.error('Error fetching events:', error);
    }
  };

  const getTeamMembers = async () => {
    try {
      const response = await fetch(`${API_BASE}/api/teams/Get/All/Teams/Members`);
      if (response.ok) {
        const data = await response.json();
        setTeamMembers(data);
      } else {
        console.error('Failed to fetch team members');
      }
    } catch (error) {
      console.error('Error fetching team members:', error);
    }
  };

  const getResources = async () => {
    try {
      const response = await fetch(`${API_BASE}/api/res/Get/Resources`);
      if (response.ok) {
        const data = await response.json();
        setResources(data);
      } else {
        console.error('Failed to fetch resources');
      }
    } catch (error) {
      console.error('Error fetching resources:', error);
    }
  };

  const getNotifications = async () => {
    try {
      const response = await fetch(`${API_BASE}/api/eyantra/notifications/get`);
      if (response.ok) {
        const data = await response.json();
        setNotifications(data);
      } else {
        console.error('Failed to fetch notifications');
      }
    } catch (err) {
      console.error('Error fetching notifications:', err);
    }
  };

  return (
    <eyantraContext.Provider
      value={{
        stats,
        username,
        notifications,
        resources,
        teamMembers,
        events,
        projects,
        getProjects,
        getEvents,
        getNotifications,
        getResources,
        getTeamMembers
      }}
    >
      <Router>
        {!showHomepage ? (
          <div className='preloader'>
             <div>
             <h4 style={{ color: backgroundColor() }} className='Introduction'>
            {sentence[currentIndex]}
          </h4>


             </div>
            
          </div>
         
        ) : (
          <Routes>
            <Route element={<PublicLayout />}>
              <Route path='/' element={<Home />} />
              <Route path='/about' element={<About />} />
              <Route path='/team' element={<Team />} />
              <Route path='/event' element={<Event />} />
              <Route path='/project' element={<Project />} />
              <Route path='/resources' element={<PublicResources />} />
              <Route path='/contact' element={<Contact />} />
            </Route>

            <Route path='/admin/login' element={<AdminLogin />} />
            <Route path='/register' element={<Registration />} />
            <Route path='/forgot-password' element={<ChangePassword1 />} />

            <Route element={<ProtectedLayout />}>
              <Route path='admin/Home' element={<AdminHome />} />
              <Route path='admin/team' element={<Teams />} />
              <Route path='admin/events' element={<Events />} />
              <Route path='admin/dashboard' element={<AdminDashboard />} />
              <Route path='admin/notifications' element={<Notifications />} />
              <Route path='admin/projects' element={<Projects />} />
              <Route path="admin/resetusers" element={<DeleteAllUsers/>}/>
              <Route path='admin/resources' element={<Resources />} />
            </Route>
             <Route path="*" element={<NotFound />} />
          </Routes>
        )}
      </Router>
    </eyantraContext.Provider>
  );
};

export default App;

