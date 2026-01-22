import React from 'react';
import { Link } from 'react-router-dom';
import './SidebarMenu.css';
import emailIcon from '../../../assets/icons/email.png';
import whatsappIcon from '../../../assets/icons/whatsapp.png';

const SidebarMenu = ({ isOpen, toggleMenu }) => {
  const token = localStorage.getItem('token');

  const handleLogout = () => {
    localStorage.removeItem('token');
    toggleMenu();
    window.location.reload();
  };

  return (
    <>
      {/* Overlay oscuro */}
      <div 
        className={`sidebar-overlay ${isOpen ? 'active' : ''}`} 
        onClick={toggleMenu}
        aria-hidden="true"
      />
      
      {/* Sidebar Menu */}
      <div className={`sidebar-menu ${isOpen ? 'open' : ''}`} role="navigation">
        <div className="sidebar-header">
          <h2>Menú</h2>
          <button className="close-button" onClick={toggleMenu} aria-label="Cerrar menú">✕</button>
        </div>
        
        <div className="sidebar-content">
          <ul>
            <li>
              <Link to="/" onClick={toggleMenu}>
                <span className="menu-icon">🏠</span>
                Inicio
              </Link>
            </li>
            <li>
              <Link to="/ofertas" onClick={toggleMenu}>
                <span className="menu-icon">🔥</span>
                Ofertas
              </Link>
            </li>
            <li>
              <Link to="/membresias" onClick={toggleMenu}>
                <span className="menu-icon">⭐</span>
                Membresías
              </Link>
            </li>
            <li>
              <Link to="/catalogo" onClick={toggleMenu}>
                <span className="menu-icon">🎮</span>
                Catálogo
              </Link>
            </li>
            <li>
              <Link to="/faq" onClick={toggleMenu}>
                <span className="menu-icon">❓</span>
                Preguntas Frecuentes
              </Link>
            </li>
            <li>
              <Link to="/ayuda" onClick={toggleMenu}>
                <span className="menu-icon">💬</span>
                Ayuda
              </Link>
            </li>
          </ul>
          
          <div className="menu-actions">
            {token ? (
              <button className="sidebar-button" onClick={handleLogout}>Cerrar Sesión</button>
            ) : (
              <>
                <Link to="/login" className="sidebar-button" onClick={toggleMenu}>Iniciar Sesión</Link>
                <Link to="/register" className="sidebar-button secondary" onClick={toggleMenu}>Crear Cuenta</Link>
              </>
            )}
          </div>
          
          <div className="menu-contact">
            <h3>Contacto</h3>
            <div className="contact-info">
              <a href="mailto:max.sanchezd13@gmail.com" className="contact-link">
                <img src={emailIcon} alt="" className="icon" />
                max.sanchezd13@gmail.com
              </a>
              <a href="https://wa.me/525633988464" target="_blank" rel="noopener noreferrer" className="contact-link">
                <img src={whatsappIcon} alt="" className="icon" />
                +52 1 5633988464
              </a>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default SidebarMenu;