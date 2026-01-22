import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Footer.css';
import logo2 from '../../assets/images/logo2.png';
import EmailIcon from '../../assets/icons/email.png';      // Icono para correo
import WhatsAppIcon from '../../assets/icons/whatsapp.png';// Icono WhatsApp

const Footer = () => {
  const navigate = useNavigate();

  return (
    <footer className="footer">
      <div className="footer-sections">
        <div className="footer-about">
          <h3>
            <button onClick={() => navigate('/about')} className="footer-button">
              Sobre Mí
            </button>
          </h3>
          <p>
            Max Uriel Sánchez Díaz, ingeniero en Computación de la UAM Cuajimalpa. 
            Apasionado por la tecnología, desarrollo soluciones digitales innovadoras 
            que mejoran la experiencia de usuario.
          </p>
        </div>
        <div className="footer-contact">
          <h3>
            <button onClick={() => navigate('/ayuda')} className="footer-button">
              Contacto
            </button>
          </h3>
          <div className="contact-info">
            {/* Iconos para contacto */}
            <a 
              href="mailto:max.sanchezd13@gmail.com" 
              className="contact-link"
            >
              <img src={EmailIcon} alt="Correo" className="contact-icon" />
              max.sanchezd13@gmail.com
            </a>
            <a 
              href="https://wa.me/525633988464" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="contact-link"
            >
              <img src={WhatsAppIcon} alt="WhatsApp" className="contact-icon" />
              WhatsApp +52 1 5633988464
            </a>
            {/*
            <div className="social-links">
              <a 
                href="https://facebook.com/tupagina" 
                target="_blank" 
                rel="noopener noreferrer"
              >
                <img src={FacebookIcon} alt="Facebook" className="social-icon" />
              </a>
              <a 
                href="https://twitter.com/tupagina" 
                target="_blank" 
                rel="noopener noreferrer"
              >
                <img src={TwitterIcon} alt="Twitter" className="social-icon" />
              </a>
              <a 
                href="https://instagram.com/tupagina" 
                target="_blank" 
                rel="noopener noreferrer"
              >
                <img src={InstagramIcon} alt="Instagram" className="social-icon" />
              </a>
            </div>
            */}
          </div>
        </div>
      </div>
      <div className="footer-logo2">
        <img src={logo2} alt="Logo 2" className="logo2-image" />
      </div>
      <div className="footer-copyright">
        <p>© {new Date().getFullYear()} MAXCOMGAMES. Todos los derechos reservados.</p>
      </div>
    </footer>
  );
};

export default Footer;