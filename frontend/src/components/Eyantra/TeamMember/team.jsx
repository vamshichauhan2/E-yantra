import React, { useContext, useState, useEffect } from 'react';
import eyantraContext from '../../../context/eyantraContext';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import './team.css';

const current = new Date();
const year = current.getFullYear();
const next = year + 1;
const defaultBatch = `${year}-${next}`;

const Team = () => {
  const [team, setTeam] = useState([]);
  const [hoverKey, setHoverKey] = useState(null); // Track which card is expanded
  const [searchBatch, setSearchBatch] = useState(defaultBatch); // Search input state
  const [showFilter, setShowFilter] = useState(false); // Toggle filter visibility
  const context = useContext(eyantraContext);

  useEffect(() => {
    if (context.teamMembers) {
      setTeam(context.teamMembers);
    }
  }, [context.teamMembers]);

  // Filter team by searchBatch, trimming whitespace and ignoring case
  const filteredTeam = team.filter(
    (item) =>
      item.batch &&
      item.batch.trim().toLowerCase().includes(searchBatch.trim().toLowerCase())
  );

  return (
    <div className="team-container">
     
           

      
    

      {/* Button to toggle filter visibility */}
     
        <div 
        className='filter-btn'
          onClick={() => setShowFilter(!showFilter)}
          
        >
          {showFilter ?   <img className='filter-icon' src="./icons8-multiply-50.png" alt='cancel'/>:  <img   className='filter-icon' src="./icons8-filter-50.png" alt='filter'/>}
         
        
      
      </div>
     
      {/* Conditionally render search input */}
      {showFilter && (
        <div  className='publicteam-Input-Box'>
          <input
            type="text"
            placeholder="Enter batch (e.g., 2025-2026)"
            value={searchBatch}
            onChange={(e) => setSearchBatch(e.target.value)}
             className='team-Input-Field-public'
          />
            
        </div>
      )}

    <h4 className="section-heading">Eyantra Club Members</h4>
      {filteredTeam.length > 0 ? (
        <ul className="team-list">
          {filteredTeam.map((item, index) => (
            <li
              key={item._id}
              className="team-item"
              onMouseEnter={() => setHoverKey(index)} // expand on hover
              onMouseLeave={() => setHoverKey(null)}  // collapse on leave
            >
              <div className="member-card">
                 <p className="field-group-p">{item.FullName}</p>
               
                {item.imageUrl && (
                  <div className="member-image">
                    <img
                      src={item.imageUrl}
                      alt={item.instituteEmail}
                      className="profile-pic"
                    />
                  </div>
                )}

                {/* Expand / Collapse Icon */}
                <div style={{ textAlign: 'center', marginTop: '5px' }}>
                  {hoverKey === index ? (
                    <ExpandLessIcon style={{ color: 'black' }} />
                  ) : (
                    <ExpandMoreIcon style={{ color: 'black' }} />
                  )}
                </div>

                {/* Show Details only if hovered */}
                {hoverKey === index && (
                  <div className="field-group-container">
                    <div className="field-group">
                      <h5 className="field-group-h5">Institute Email</h5>
                      <p className="field-group-p">{item.instituteEmail}</p>
                    </div>
                    <div className="field-group">
                      <h5 className="field-group-h5">Role</h5>
                      <p className="field-group-p">{item.role}</p>
                    </div>
                    <div className="field-group">
                      <h5 className="field-group-h5">Study Year</h5>
                      <p className="field-group-p">{item.studyYear}</p>
                    </div>
                    <div className="field-group">
                      <h5 className="field-group-h5">Mobile</h5>
                      <p className="field-group-p">{item.mobile}</p>
                    </div>
                    <div className="field-group">
                      <h5 className="field-group-h5">Bio</h5>
                      <p className="field-group-p">{item.bio}</p>
                    </div>
                    <div className="field-group">
                      <h5 className="field-group-h5">From</h5>
                      <p className="field-group-p">{new Date(item.from).toLocaleDateString()}</p>
                    </div>
                    <div className="field-group">
                      <h5 className="field-group-h5">To</h5>
                      <p className="field-group-p">
                        {item.to ? new Date(item.to).toLocaleDateString() : <span className="highlight">Present</span>}
                      </p>
                    </div>
                    <div className="field-group">
                      <h5 className="field-group-h5">Active</h5>
                      <p className="field-group-p">
                        {item.isActive ? <span className="yes">Yes</span> : <span className="no">No</span>}
                      </p>
                    </div>
                    <div className="field-group">
                      <h5 className="field-group-h5">Batch</h5>
                      <p className="field-group-p">{item.batch}</p>
                    </div>
                  </div>
                )}
              </div>
            </li>
          ))}
        </ul>
      ) : (
        < div style={{display:'flex', flexDirection:"column",alignItems:"center"}}>
            <img className='eyantra-events-empty-team' src="../eyantra-empty.webp" alt="empty-imag"/>
              <p className="adminempty-msg">No team members found for batch "{searchBatch}"</p>
       </div>
      )}
    </div>
  );
};

export default Team;
