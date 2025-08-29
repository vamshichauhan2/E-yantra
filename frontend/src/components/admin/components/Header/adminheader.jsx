import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Sidebar, Menu, MenuItem } from 'react-pro-sidebar';
import { FaBars } from 'react-icons/fa';
import ModalPopup from '../../../Modelpopup/modalpopup';

//import 'react-pro-sidebar/dist/css/styles.css';
import SwipeableDrawer from '@mui/material/SwipeableDrawer';
import Cookies from 'js-cookie';
import './header.css'; 
import MessagesList from '../MessagesList/message';
import ChangePassword from '../../Auth/ChangePassword/changepassword';

const AdminHeader = () => {
  const navigate = useNavigate();
   const [modalIsOpen, setModalIsOpen] = useState(false);
   

  // State for desktop drawers (unchanged)
  const [drawerOpen, setDrawerOpen] = useState(false);

  const [messageDrawerOpen, setMessageDrawerOpen] = useState(false);
  const [changePasswordDrawerOpen, setChangePasswordDrawerOpen] = useState(false);

  // Mobile Sidebar toggle state (for react-pro-sidebar)
  const [mobileSidebarToggled, setMobileSidebarToggled] = useState(false);

  const [showMore, setShowMore] = useState(false);
  const moreMenuRef = useRef(null);

  // Close all drawers except mobile sidebar
  const closeAllDrawers = () => {
    setDrawerOpen(false);
    setMessageDrawerOpen(false);
    setChangePasswordDrawerOpen(false);
  };

  const logout = () => {
    Cookies.remove('jwt_token');
    sessionStorage.removeItem('role');
    closeAllDrawers();
    setMobileSidebarToggled(false);
    const token = Cookies.get('jwt_token');
    if (!token) {
      navigate('/admin/login');
    }
  };

  const openMessageDrawer = () => {
    closeAllDrawers();
    setMobileSidebarToggled(false);
    setTimeout(() => setMessageDrawerOpen(true), 100);
  };

  const openChangePasswordDrawer = () => {
    closeAllDrawers();
    setMobileSidebarToggled(false);
    setTimeout(() => setChangePasswordDrawerOpen(true), 100);
  };

   // Desktop drawer toggle handlers (unchanged)
  const toggleDrawer = (openState) => (event) => {
    if (event?.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) return;
    setDrawerOpen(openState);
  };

  const toggleMessageDrawer = (openState) => (event) => {
    if (event?.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) return;
    setMessageDrawerOpen(openState);
  };

  const toggleChangePasswordDrawer = (openState) => (event) => {
    if (event?.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) return;
    setChangePasswordDrawerOpen(openState);
  };

  // Handle "More" toggle (unchanged)
  const toggleMoreMenu = () => setShowMore((prev) => !prev);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (moreMenuRef.current && !moreMenuRef.current.contains(event.target)) {
        setShowMore(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="Navbar">
      <img  onClick={()=>setModalIsOpen(true)} className="eyantra-Logo" src="../eyantraLogo.jpeg" alt="E-YANTRA" />

      {/* Desktop Menu unchanged */}
      <ul className="Nav-items">
        <li className="Nav-item"><Link className="Nav-Anchor" to="/admin/home">Home</Link></li>
        <li className="Nav-item"><Link className="Nav-Anchor" to="/admin/dashboard">Dashboard</Link></li>
        <li className="Nav-item"><Link className="Nav-Anchor" to="/admin/events">Events</Link></li>
        <li className="Nav-item"><Link className="Nav-Anchor" to="/admin/notifications">Notifications</Link></li>
        <li className="Nav-item"><Link className="Nav-Anchor" to="/admin/team">Team</Link></li>
        <li className="Nav-item"><Link className="Nav-Anchor" to="/admin/resources">Resources</Link></li>
        <li className="Nav-item"><Link className="Nav-Anchor" to="/admin/projects">Project</Link></li>

        {/* "More" Dropdown */}
        <li className="Nav-item" ref={moreMenuRef}>
          <p className="Nav-Anchor" onClick={toggleMoreMenu}>
            More ▾
          </p>
          {showMore && (
            <ul className="More-Dropdown">
              <li className="Nav-item">
                <p onClick={openChangePasswordDrawer} className="Nav-Anchor">Change Password</p>
              </li>
              <li className="Nav-item">
                <p onClick={logout} className="Nav-Anchor">Logout</p>
              </li>
               <li className='Nav-item'>
                <Link className="Nav-Anchor" to="/admin/resetusers">Reset Users</Link>
              </li>
              <li className="Nav-item">
                <img onClick={openMessageDrawer} className="Message-icon" src="../icons8-notifications-50.png" alt="notifications" />
              </li>
            </ul>
          )}
        </li>
      </ul>


      {
         
           <ModalPopup  modalIsOpen={modalIsOpen} setModalIsOpen={setModalIsOpen} value={true}/>
           

      }

      {/* Mobile Menu */}
      <div className="Navbar-Menu">
        <div onClick={() => setMobileSidebarToggled(true)} style={{ cursor: 'pointer' }}>
          <FaBars size={24} color="#000" />
        </div>

        {/* Mobile Sidebar from react-pro-sidebar */}
        <Sidebar
          toggled={mobileSidebarToggled}
          onToggle={setMobileSidebarToggled}
          breakPoint="md"
          style={{ height: '100vh', position: 'fixed', zIndex: 1300,padding:0,margin:0}}
          className="Nav-Items-Mobile-view"
        >
          <p 
            className="Close-btn" 
            onClick={() => setMobileSidebarToggled(false)} 
            style={{ cursor: 'pointer', padding: '10px', fontWeight: 'bold' }}
          >
            X
          </p>
          <ul className="Nav-Items-Mobile">
            <li className="Nav-item"><Link onClick={() => setMobileSidebarToggled(false)} className="Nav-Anchor" to="/admin/home">Home</Link></li>
            <li className="Nav-item"><Link onClick={() => setMobileSidebarToggled(false)} className="Nav-Anchor" to="/admin/dashboard">Dashboard</Link></li>
            <li className="Nav-item"><Link onClick={() => setMobileSidebarToggled(false)} className="Nav-Anchor" to="/admin/events">Events</Link></li>
            <li className="Nav-item"><Link onClick={() => setMobileSidebarToggled(false)} className="Nav-Anchor" to="/admin/notifications">Notifications</Link></li>
            <li className="Nav-item"><Link onClick={() => setMobileSidebarToggled(false)} className="Nav-Anchor" to="/admin/resources">Resources</Link></li>
            <li className="Nav-item"><Link onClick={() => setMobileSidebarToggled(false)} className="Nav-Anchor" to="/admin/team">Team</Link></li>
            <li className="Nav-item"><Link onClick={() => setMobileSidebarToggled(false)} className="Nav-Anchor" to="/admin/projects">Project</Link></li>
            <li className="Nav-item">
              <img 
                onClick={() => { openMessageDrawer(); setMobileSidebarToggled(false); }} 
                className="Message-icon" 
                src="../icons8-notifications-50.png" 
                alt="notifications" 
              />
            </li>
            <li className="Nav-item">
              <p onClick={() => { openChangePasswordDrawer(); setMobileSidebarToggled(false); }} className="Nav-Anchor">Change Password</p>
            </li>
            <li className='Nav-item'>
                <Link className="Nav-Anchor" to="/admin/resetusers">Reset Users</Link>
              </li>
            <li className="Nav-item">
              <p onClick={() => { logout(); setMobileSidebarToggled(false); }} className="Nav-Anchor">Logout</p>
            </li>
          </ul>
        </Sidebar>

        {/* Desktop SwipeableDrawers remain unchanged */}

        <SwipeableDrawer
          anchor="right"
          open={drawerOpen}
          onClose={toggleDrawer(false)}
          onOpen={toggleDrawer(true)}
        >
          <div
            className="Nav-Items-Mobile-view"
            role="presentation"
            onClick={() => setDrawerOpen(false)}
            onKeyDown={() => setDrawerOpen(false)}
          >
            <p className="Close-btn" onClick={() => setDrawerOpen(false)}>X</p>
            <ul className="Nav-Items-Mobile">
              <li className="Nav-item"><Link className="Nav-Anchor" to="/admin/home">Home</Link></li>
              <li className="Nav-item"><Link className="Nav-Anchor" to="/admin/dashboard">Dashboard</Link></li>
              <li className="Nav-item"><Link className="Nav-Anchor" to="/admin/events">Events</Link></li>
              <li className="Nav-item"><Link className="Nav-Anchor" to="/admin/notifications">Notifications</Link></li>
              <li className="Nav-item"><Link className="Nav-Anchor" to="/admin/resources">Resources</Link></li>
              <li className="Nav-item"><Link className="Nav-Anchor" to="/admin/team">Team</Link></li>
              <li className="Nav-item"><Link className="Nav-Anchor" to="/admin/projects">Project</Link></li>
              <li className="Nav-item">
                <img 
                  onClick={() => { setMessageDrawerOpen(true); setDrawerOpen(false); }} 
                  className="Message-icon" 
                  src="../icons8-notifications-50.png" 
                  alt="notifications" 
                />
              </li>
              <li className="Nav-item">
                <p onClick={() => { openChangePasswordDrawer(); setDrawerOpen(false); }} className="Nav-Anchor">
                  Change Password
                </p>
              </li>
              <li className='Nav-item'>
                <Link className="Nav-Anchor" to="/admin/resetusers">Reset Users</Link>
              </li>
              <li className="Nav-item">
                <p onClick={() => { logout(); setDrawerOpen(false); }} className="Nav-Anchor">
                  Logout
                </p>
              </li>
            </ul>
          </div>
        </SwipeableDrawer>

        <SwipeableDrawer
          anchor="right"
          open={messageDrawerOpen}
          onClose={toggleMessageDrawer(false)}
          onOpen={toggleMessageDrawer(true)}
          PaperProps={{
            sx: { m: 0, p: 0, boxSizing: 'border-box' },
          }}
          ModalProps={{
            keepMounted: true,
           
          }}
        >
          <div className="side-bar-both-view">
            <p className="Close-btn-message" onClick={() => setMessageDrawerOpen(false)}>X</p>
            <MessagesList />
          </div>
        </SwipeableDrawer>

        <SwipeableDrawer
          anchor="right"
          open={changePasswordDrawerOpen}
          onClose={toggleChangePasswordDrawer(false)}
          onOpen={toggleChangePasswordDrawer(true)}
          PaperProps={{
            sx: { m: 0, p: 0, boxSizing: 'border-box' },
          }}
          ModalProps={{
            keepMounted: true,
            BackdropProps: { sx: { backgroundColor: 'rgba(0,0,0,0.5)' } },
          }}
        >
          <div className="side-bar-both-view">
            <p className="Close-btn-message" onClick={() => setChangePasswordDrawerOpen(false)}>X</p>
            <ChangePassword />
          </div>
        </SwipeableDrawer>
      </div>
    </div>
  );
};

export default AdminHeader;
