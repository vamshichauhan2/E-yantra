import React ,{useContext, useEffect,useState}from 'react';
const API_BASE = import.meta.env.MODE === 'production'
  ? "https://eynatranitandhra.onrender.com"
  : import.meta.env.VITE_API_URL;

import AOS from 'aos';
import 'aos/dist/aos.css';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  ArcElement,
  Tooltip,
  Legend
} from 'chart.js';
import { Line, Bar, Pie } from 'react-chartjs-2';
import eyantraContext from '../../../../context/eyantraContext';
import AnimatedCount from '../../../AnimatedCount/animatecount';
import './dashboard.css'; // Your CSS for styling




// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  ArcElement,
  Tooltip,
  Legend
);

const AdminDashboard = () => {
  const context=useContext(eyantraContext)
const emptyChartData = { labels: [], datasets: [] };

const [eventConductionData, setEventConductionData] = useState(emptyChartData);
const [projectsDoneData, setProjectsDoneData] = useState(emptyChartData);
const [clubGrowthData, setClubGrowthData] = useState(emptyChartData);
const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Dummy data for charts
  
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


  /********************* */
useEffect(() => {
      AOS.init({
        duration: 1000, 
        easing: 'ease-in-out',
        once: true, 
      });
      fetchChartData();
    }, []);
  const fetchChartData=async()=>{
    try {
       
        const response = await fetch(`${API_BASE}/api/overview/chart-data`);
        if (!response.ok) throw new Error('Failed to fetch data');
        const data = await response.json();
       

        setEventConductionData(data.eventConductionData);
        setProjectsDoneData(data.projectsDoneData);
        setClubGrowthData(data.clubGrowthData);
        setError(null);
      } catch (err) {
        setError(err.message || 'Unexpected error');
      }
  }
  

  return (
    <div className="admin-dashboard">
      {/* Welcome & Summary */}
      <section className="welcome-summary">
        <h1>Welcome, {context.username} </h1>
        <p>Here’s a quick overview of your teams, events, notifications, and growth.</p>
      </section>

      {/* Role-Based Stats */}
      <section className="stats-grid">
        <div className="stat-card">
          
          <AnimatedCount targetCount={context.stats.totalAdmins}/>
          <p>Total Admins</p>
          
        </div>
        <div className="stat-card">
            <AnimatedCount targetCount={context.stats.
    totalSecretaries}/>
          <p>Total Secretaries</p>
          
        </div>
        <div className="stat-card">
           <AnimatedCount targetCount={context.stats.
    totalJointSecretaries}/>
          <p>Total Joint Secretaries</p>
         
        </div>
        <div className="stat-card">
           <AnimatedCount targetCount={context.stats. totalUsers}/>
          <p>Registered Users</p>
         
        </div>
        <div className="stat-card">
         
            <AnimatedCount targetCount={context.events?.length||0}/>
           
          
          <p>total Events</p>
        </div>
         <div className="stat-card">
        <AnimatedCount targetCount={upcomingEvents.length} />
        <p>Upcoming Events</p>
      </div>
      <div className="stat-card">
       <AnimatedCount targetCount={ongoingEvents.length} />
        <p>Ongoing Events</p>
      </div>
        <div className="stat-card">
          
            <AnimatedCount targetCount={context.notifications?.length||0}/>
           
          <p>Active Notifications</p>
        </div>
        <div className="stat-card">
         
            <AnimatedCount targetCount={context.resources?.length||0}/>
           
          <p>Total Resources</p>
        </div>
      </section>

      {/* Quick Actions */}
      <section className="quick-actions">
        <h2>Quick Actions</h2>
        <button onClick={() => window.location.href = '/admin/events'}>Manage Events</button>
        <button onClick={() => window.location.href = '/admin/notifications'}>Send Notification</button>
        <button onClick={() => window.location.href = '/admin/team'}>Manage Team</button>
      </section>

     <section className="dashboard-recent-activity">
        <h2>Recent Activity</h2>
        <ul >
          <li data-aos="fade-left"   data-aos-delay="0"       // delay for this element only, in ms
  data-aos-duration="600">No Recent Activity(This Feauture is Enabled)</li>
         
        </ul>
      </section>
      <div className='dashboard-lower-device-recent-Activity'>
          <h4>Recent Activity</h4>
            <div style={{margin:0,padding:0}}>
               <p>No Recent Activity(This Feauture is Enabled)</p>
            </div>

        </div>
      
      {/* Charts Section */}
      <section className="charts-section">
  <div className="chart-container">
    <h3>Event Conduction Over Years (%)</h3>
    {eventConductionData ? (
      <Line data={eventConductionData} />
    ) : (
      <p>Loading Event Data...</p>
    )}
  </div>

  <div className="chart-container">
    <h3>Projects Done Year-wise</h3>
    {projectsDoneData ? (
      <Bar data={projectsDoneData} />
    ) : (
      <p>Loading Project Data...</p>
    )}
  </div>

  <div className="chart-container">
    <h3>Club Growth Percentage</h3>
    {clubGrowthData ? (
      <Pie data={clubGrowthData} />
    ) : (
      <p>Loading Growth Data...</p>
    )}
  </div>
</section>

    </div>
  );
};

export default AdminDashboard;
