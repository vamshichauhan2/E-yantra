import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Sidebar } from 'react-pro-sidebar';
import { FaBars } from 'react-icons/fa';
import './header.css';
import ModalPopup from '../../Modelpopup/modalpopup';

const Header = () => {
  // Sidebar toggle state (for react-pro-sidebar)
  const [modalIsOpen, setModalIsOpen] = useState(false);
   
  const [mobileSidebarToggled, setMobileSidebarToggled] = useState(false);

  return (
    <div className='Navbar'>
      <img onClick={()=>setModalIsOpen(true)}className="eyantra-Logo" src="./eyantraLogo.jpeg" alt="E-YANTRA" />
       
      {/* Desktop Menu */}
      <ul className='Nav-items'>
        <li className='Nav-item'><Link className='Nav-Anchor' to="/">Home</Link></li>
        <li className='Nav-item'><Link className='Nav-Anchor' to="/about">About</Link></li>
        <li className='Nav-item'><Link className='Nav-Anchor' to="/team">Team</Link></li>
        <li className='Nav-item'><Link className='Nav-Anchor' to="/event">Event</Link></li>
        <li className='Nav-item'><Link className='Nav-Anchor' to="/project">Project</Link></li>
        <li className='Nav-item'><Link className='Nav-Anchor' to="/resources">Resource</Link></li>
        <li className='Nav-item'><Link className='Nav-Anchor' to="/contact">Contact</Link></li>
      </ul>
      

      {/* Mobile Menu */}
      <div className='Navbar-Menu'>
        {/* Hamburger Icon */}
        <div onClick={() => setMobileSidebarToggled(true)} style={{ cursor: 'pointer' }}>
          <FaBars size={24} color="#000" />
        </div>
        <div style={{margin:0,padding:0}}>
          
        <ModalPopup  modalIsOpen={modalIsOpen} setModalIsOpen={setModalIsOpen} value={false}/>

        </div>
       
        {/* Sidebar for Mobile */}
        <Sidebar
          toggled={mobileSidebarToggled}
          onToggle={setMobileSidebarToggled}
          breakPoint="md"
          style={{ height: '100vh', position: 'fixed', zIndex: 1300, padding: 0, margin: 0 }}
          className="Nav-Items-Mobile-view"
        >
          <p
            className="Close-btn"
            onClick={() => setMobileSidebarToggled(false)}
            style={{ cursor: 'pointer', padding: '10px', fontWeight: 'bold' }}
          >
            X
          </p>

          <ul className='Nav-Items-Mobile'>
            <li className='Nav-item'><Link onClick={() => setMobileSidebarToggled(false)} className='Nav-Anchor' to="/">Home</Link></li>
            <li className='Nav-item'><Link onClick={() => setMobileSidebarToggled(false)} className='Nav-Anchor' to="/about">About</Link></li>
            <li className='Nav-item'><Link onClick={() => setMobileSidebarToggled(false)} className='Nav-Anchor' to="/team">Team</Link></li>
            <li className='Nav-item'><Link onClick={() => setMobileSidebarToggled(false)} className='Nav-Anchor' to="/event">Event</Link></li>
            <li className='Nav-item'><Link onClick={() => setMobileSidebarToggled(false)} className='Nav-Anchor' to="/project">Project</Link></li>
            <li className='Nav-item'><Link onClick={() => setMobileSidebarToggled(false)} className='Nav-Anchor' to="/resources">Resource</Link></li>
            <li className='Nav-item'><Link onClick={() => setMobileSidebarToggled(false)} className='Nav-Anchor' to="/contact">Contact</Link></li>
          </ul>
        </Sidebar>
      </div>
    </div>
  );
};

export default Header;
