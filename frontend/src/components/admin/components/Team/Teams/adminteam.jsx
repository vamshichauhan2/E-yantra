import React, { useState, useContext, useEffect } from 'react';
import AddIcon from '@mui/icons-material/Add';
import SwipeableDrawer from '@mui/material/SwipeableDrawer';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import eyantraContext from '../../../../../context/eyantraContext';
import './teams.css';
import TeamMemberForm from '../AddTeam/addTeam';
const API_BASE = import.meta.env.MODE === 'production'
  ? "https://eynatranitandhra.onrender.com"
  : import.meta.env.VITE_API_URL;



// Get Current Batch Year
const currentYear = new Date().getFullYear();
const nextYear = currentYear + 1;
const defaultBatch = `${currentYear}-${nextYear}`;

// Reusable Member Card
const MemberCard = ({ member, expanded, onHover,deleteRequestedUser }) => (
  <div
    className="adminmember-card"
    onMouseEnter={onHover(true)}
    onMouseLeave={onHover(false)}
  >
       <p className='adminteamdelete-btn' onClick={()=>deleteRequestedUser(member.InstituteEmail)}>x</p>
    <p className="adminfield-group-p">{member.FullName ?? member.name}</p>

    {member.imageUrl!=='' ? (
  <img src={member.imageUrl} alt={member.FullName} className="adminprofile-pic" />
) : member.Gender === "male" ? (
  <img className="admindummy-image" src="./male-default-profile.png" alt="dummy" />
) : (
  <img className="admindummy-image" src="./female-default-profile.png" alt="dummy" />
)}


    {/* Expand / Collapse icon */}
    <div style={{ textAlign: 'center', marginTop: '5px' }}>
      {expanded ? (
        <ExpandLessIcon style={{ color: 'black' }} />
      ) : (
        <ExpandMoreIcon style={{ color: 'black' }} />
      )}
    </div>

    {/* Extra Info */}
    {expanded && (
      <div className="adminfield-group-container"> 
     
        <div className="adminfield-group">
          <h5 className='adminteam-page-h5'>Institute Email</h5>
          <p>{member. InstituteEmail}</p>
        </div>
        <div className="adminfield-group">
          <h5 className='adminteam-page-h5'>Role</h5>
          <p>{member.role}</p>
        </div>
        <div className="adminfield-group">
          <h5 className='adminteam-page-h5'>Study Year</h5>
          <p>{member.studyYear}</p>
        </div>
        <div className="adminfield-group">
          <h5 className='adminteam-page-h5'>Mobile</h5>
          <p>{member.mobile}</p>
        </div>
        <div className="adminfield-group">
          <h5 className='adminteam-page-h5'>Bio</h5>
          <p>{member.bio}</p>
        </div>
        <div className="adminfield-group">
          <h5 className='adminteam-page-h5'>From</h5>
          <p>{new Date(member.from).toLocaleDateString()}</p>
        </div>
        <div className="adminfield-group">
          <h5 className='adminteam-page-h5'>To</h5>
          <p>
            {member.to
              ? new Date(member.to).toLocaleDateString()
              : <span className="highlight">Present</span>}
          </p>
        </div>
        <div className="adminfield-group">
          <h5 className='adminteam-page-h5'>Active</h5>
          <p>{member.isActive ? <span className="yes">Yes</span> : <span className="no">No</span>}</p>
        </div>
        <div className="adminfield-group">
          <h5 className='adminteam-page-h5'>Batch</h5>
          <p>{member.batch}</p>
        </div>
      </div>
    )}
  </div>
);

const TeamPage = () => {
  const context = useContext(eyantraContext);
  const [teams, setTeams] = useState([]);
  const [open, setOpen] = useState(false);
  const [hoverIndex, setHoverIndex] = useState(null);
  const [searchBatch, setSearchBatch] = useState(defaultBatch); // Default batch search
  const [showFilter, setShowFilter] = useState(false);

  // Sync teams from context
  useEffect(() => {
    if (context.teamMembers) {
      setTeams(context.teamMembers);
    }
  }, [context.teamMembers]);

  // Filter by batch
  const filteredTeam = teams.filter(
    (member) =>
      member.batch &&
      member.batch.trim().toLowerCase().includes(searchBatch.trim().toLowerCase())
  );
  const deleteRequestedUser=async(email)=>{
    try{
    const response = await fetch(`${API_BASE}/api/teams/delete/teamMember/${email}`, {
  method: 'DELETE', 
});
  if(response.status===200){
        context.getTeamMembers();
        alert("deleted SuccessFully");

      }

    }catch(err){
      alert('failed to delete')
      console.log(err);
    }
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

  return (
    <div className="adminteam-page">
      {/* Drawer for Adding Member */}
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
        <TeamMemberForm />
      </SwipeableDrawer>

     
     

       <div className='adminAddTeamIcon'>
        <AddIcon onClick={() => setOpen(true)} style={{ color: 'black', fontSize: 40 }} />
      

       </div>
      <div className="adminfilter-btn" onClick={() => setShowFilter(!showFilter)}>
        
        {showFilter ? (
          <img className="adminfilter-icon" src="../remove-filter.png" alt="cancel" />
        ) : (
          <img className="adminfilter-icon" src="../filter-team.png" alt="filter" />
        )}
      </div>

      {showFilter && (
        <div style={{width:'100%'}}>
          <input
            type="text"
            placeholder="Enter batch (e.g., 2025-2026)"
            value={searchBatch}
            onChange={(e) => setSearchBatch(e.target.value)}
            className="adminInput-Field-Team"
            
          />
        </div>
      )}

     
      <h1 className='adminteam-page-h1'>batch ({searchBatch})</h1>
      {filteredTeam.length > 0 ? (
        <div className="adminteam-list">
          {filteredTeam.map((member, index) => (
            <MemberCard
             deleteRequestedUser={deleteRequestedUser}
              key={member._id}
              member={member}
              expanded={hoverIndex === index}
              onHover={(state) => () => setHoverIndex(state ? index : null)}
            />
          ))}
        </div>
      ) : (
           < div style={{display:'flex', flexDirection:"column",alignItems:"center"}}>
            <img className='eyantra-events-empty' src="../eyantra-empty.webp" alt="empty-imag"/>
              <p className="adminempty-msg">No team members found for batch "{searchBatch}"</p>
       </div>
      
      )}

     
     
    </div>
  );
};

export default TeamPage;
