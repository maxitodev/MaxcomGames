import React from 'react';
import { Link } from 'react-router-dom';
import './SidebarMenu.css';
import emailIcon from '../../../assets/icons/email.png';
import whatsappIcon from '../../../assets/icons/whatsapp.png';

const SidebarMenu = ({ isOpen, toggleMenu }) => {
  const token = localStorage.getItem('token'); // Check for token in localStorage

  const handleLogout = () => {
    localStorage.removeItem('token'); // Remove token from localStorage
    toggleMenu(); // Close the menu
    window.location.reload(); // Reload the page to reflect changes
  };

  return (
    <div className={`sidebar-menu ${isOpen ? 'open' : ''}`}>
      <button className="close-button" onClick={toggleMenu}>✖</button>
      <h2>Menú</h2>
      <ul>
        <li>
          <Link to="/" onClick={toggleMenu}>Inicio</Link>
        </li>
        <li>
          <Link to="/ofertas" onClick={toggleMenu}>Ofertas</Link>
        </li>
        <li>
        <Link to="/membresias" onClick={toggleMenu}>Membresias</Link>
        </li>
        <li>
          <Link to="/catalogo" onClick={toggleMenu}>Catálogo</Link>
        </li>
        <li>
          <Link to="/faq" onClick={toggleMenu}>Preguntas Frecuentes</Link>
        </li>
        <li>
          <Link to="/ayuda" onClick={toggleMenu}>Ayuda</Link>
        </li>
      </ul>
      <div className="menu-actions">
        {token ? (
          <button className="sidebar-button" onClick={handleLogout}>Cerrar Sesión</button>
        ) : (
          <>
            <Link to="/login" className="sidebar-button" onClick={toggleMenu}>Ingresar</Link>
            <Link to="/register" className="sidebar-button" onClick={toggleMenu}>Crear Cuenta</Link>
          </>
        )}
      </div>
      <div className="menu-contact">
        <h3>CONTACTO</h3>
        <div className="contact-info">
          <a href="mailto:max.sanchezd13@gmail.com" className="contact-link">
            <img src={emailIcon} alt="Email" className="icon" /> max.sanchezd13@gmail.com
          </a>
          <a href="https://wa.me/525633988464" target="_blank" rel="noopener noreferrer" className="contact-link">
            <img src={whatsappIcon} alt="WhatsApp" className="icon" /> WhatsApp +52 1 5633988464
          </a>
          {/* 
          <div className="social-links">
            <a href="https://facebook.com/tupagina" target="_blank" rel="noopener noreferrer">
              <img src={facebookIcon} alt="Facebook" className="icon" />
            </a>
            <a href="https://twitter.com/tupagina" target="_blank" rel="noopener noreferrer">
              <img src={twitterIcon} alt="Twitter" className="icon" />
            </a>
            <a href="https://instagram.com/tupagina" target="_blank" rel="noopener noreferrer">
              <img src={instagramIcon} alt="Instagram" className="icon" />
            </a>
          </div>
          */}
        </div>
      </div>
    </div>
  );
};

export default SidebarMenu;