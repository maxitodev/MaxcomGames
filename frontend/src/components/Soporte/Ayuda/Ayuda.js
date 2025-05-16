import React, { useState } from 'react';
import './Ayuda.css'; // Importa los estilos CSS
import EmailIcon from '../../../assets/icons/email.png'; // Icono de correo
import WhatsAppIcon from '../../../assets/icons/whatsapp.png'; // Icono de WhatsApp
import axiosInstance from '../../../utils/AxiosInstance';

const Ayuda = () => {
  const [formData, setFormData] = useState({
    nombre: '',
    correo: '',
    asunto: '',
    mensaje: '',
  });

  const [notification, setNotification] = useState({ message: '', type: '' });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axiosInstance.post('/soporte/contacto', formData);
      if (response.status === 200) {
        setNotification({ message: 'Mensaje enviado con éxito', type: 'success' });
        setFormData({
          nombre: '',
          correo: '',
          asunto: '',
          mensaje: '',
        });
      } else {
        setNotification({ message: 'Error al enviar el mensaje', type: 'error' });
      }
    } catch (error) {
      console.error('Error al enviar el mensaje:', error);
      setNotification({ message: 'Error al enviar el mensaje', type: 'error' });
    }
  };

  return (
    <div className="ayuda-container">
      <h1>Centro de Ayuda</h1>
      <p>Estamos aquí para ayudarte. Contáctanos a través de los siguientes medios:</p>

      {/* Información de contacto */}
      <div className="contacto-info">
        <div className="contacto-item">
          <img src={EmailIcon} alt="Icono de correo" className="contact-icon" />
          <a href="mailto:max.sanchezd13@gmail.com" className="contact-link">
            max.sanchezd13@gmail.com
          </a>
        </div>
        <div className="contacto-item">
          <img src={WhatsAppIcon} alt="Icono de WhatsApp" className="contact-icon" />
          <a href="https://wa.me/+5215633988464" target="_blank" rel="noopener noreferrer" className="contact-link">
            Chatea por WhatsApp
          </a>
        </div>
      </div>

      {/* Notificación */}
      {notification.message && (
        <div className={`notification ${notification.type}`}>
          {notification.message}
        </div>
      )}

      {/* Formulario de contacto */}
      <form className="contacto-form" onSubmit={handleSubmit}>
        <h2>Envíanos un mensaje</h2>
        <div className="form-group">
          <label htmlFor="nombre">Nombre:</label>
          <input
            type="text"
            id="nombre"
            name="nombre"
            value={formData.nombre}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="correo">Correo electrónico:</label>
          <input
            type="email"
            id="correo"
            name="correo"
            value={formData.correo}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="asunto">Asunto:</label>
          <input
            type="text"
            id="asunto"
            name="asunto"
            value={formData.asunto}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="mensaje">Mensaje:</label>
          <textarea
            id="mensaje"
            name="mensaje"
            value={formData.mensaje}
            onChange={handleChange}
            required
          />
        </div>
        <button type="submit" className="submit-button">Enviar</button>
      </form>

      {/* Enlace a preguntas frecuentes */}
      <div className="faq-link">
        <p>¿Tienes más preguntas? Visita nuestra <a href="/faq">página de preguntas frecuentes</a>.</p>
      </div>
    </div>
  );
};

export default Ayuda;