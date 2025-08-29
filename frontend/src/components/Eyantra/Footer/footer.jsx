import React from 'react';
import './footer.css'

const Footer = () => {
  return (
    <footer className='footer-section'>
      
     
      <div className='footer-follow-us'>
        <h3>Follow Us</h3>
        <ul className='Follow-US-Container'>
          <li className='follow-us-container'>
            <img  className='icon-image' src="./icons8-facebook-48.png" alt="facebook"/>
            <a className='follow-us-Anchor-Tag' href="https://facebook.com" target="_blank" rel="noopener noreferrer">Facebook</a></li>
          <li className='follow-us-container'>
            <img  className='icon-image' src="./icons8-x-50.png" alt="twitter"/>
            <a className='follow-us-Anchor-Tag'  href="https://twitter.com" target="_blank" rel="noopener noreferrer">Twitter</a></li>
          <li className='follow-us-container'>
              <img   className='icon-image' src="./icons8-instagram-48.png" alt="facebook"/>
            <a className='follow-us-Anchor-Tag'  href="https://instagram.com" target="_blank" rel="noopener noreferrer">Instagram</a></li>
          <li className='follow-us-container'>
              <img className='icon-image' src="./icons8-linkedin-48.png" alt="facebook"/>
            <a className='follow-us-Anchor-Tag'  href="https://linkedin.com" target="_blank" rel="noopener noreferrer">LinkedIn</a></li>
        </ul>
      </div>

      <p className='' >
        © {new Date().getFullYear()} NIT ANDHRA PRADESH, E-YANTHRA CLUB. All Rights Reserved.
      </p>
    </footer>
  );
};

export default Footer;
