import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../../../utils/AxiosInstance';
import './Register.css';

const Register = () => {
  const [formData, setFormData] = useState({
    Nombre: '',
    Correo: '',
    Contraseña: '',
    Terminos: false,
  });
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState(false); // Nuevo estado para el mensaje de éxito
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value,
    });
    setErrorMessage(''); // Elimina el mensaje de error al modificar
  };

  const handleTermsClick = () => {
    navigate('/terms'); // Redirige a la página de términos
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.Terminos) {
      setErrorMessage('Debes aceptar los términos de uso.');
      return;
    }
    // Validar formato de correo
    const emailRegex = /^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/;
    if (!emailRegex.test(formData.Correo)) {
      setErrorMessage('El formato del correo electrónico es inválido.');
      return;
    }
    // Validar contraseña segura: 
    // Al menos 8 caracteres, una mayúscula, una minúscula, un dígito y un símbolo.
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/;
    if (!passwordRegex.test(formData.Contraseña)) {
      setErrorMessage('La contraseña debe tener al menos 8 caracteres, mayúsculas, minúsculas, números y un símbolo.');
      return;
    }

    try {
      await axiosInstance.post('/usuarios', {
        Nombre: formData.Nombre,
        Correo: formData.Correo,
        Contraseña: formData.Contraseña,
      });
      setSuccessMessage(true);
      setTimeout(() => navigate('/login'), 5000);
    } catch (error) {
      setErrorMessage(error.response?.data?.message || 'Error al registrar usuario.');
    }
  };

  if (successMessage) {
    return (
      <div className="success-container">
        <h2 className="success-message">¡Usuario registrado exitosamente!</h2>
        <p className="redirect-message">Serás redirigido para Iniciar Sesión en 5 segundos...</p>
      </div>
    );
  }

  return (
    <div className="register-container">
      <h2>Crear Cuenta</h2>
      {errorMessage && <p className="error-message">{errorMessage}</p>}
      <form className="register-form" onSubmit={handleSubmit}>
        <input
          type="text"
          name="Nombre"
          placeholder="Nombre completo"
          value={formData.Nombre}
          onChange={handleChange}
          onFocus={() => setErrorMessage('')} 
          required
        />
        <input
          type="email"
          name="Correo"
          placeholder="Correo electrónico"
          value={formData.Correo}
          onChange={handleChange}
          onFocus={() => setErrorMessage('')} 
          required
        />
        <input
          type="password"
          name="Contraseña"
          placeholder="Contraseña"
          value={formData.Contraseña}
          onChange={handleChange}
          onFocus={() => setErrorMessage('')} 
          required
        />
        <div className="terms-checkbox">
          <input
            type="checkbox"
            name="Terminos"
            checked={formData.Terminos}
            onChange={handleChange}
          />
          <label onClick={handleTermsClick}>
            Acepto Términos de Uso
          </label>
        </div>
        <button type="submit">Crear Cuenta</button>
      </form>
    </div>
  );
};

export default Register;
