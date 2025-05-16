import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axiosInstance from '../../../utils/AxiosInstance';
import './ResetPassword.css';

const ResetPassword = () => {
  const [newPassword, setNewPassword] = useState('');
  const [message, setMessage] = useState('');
  const { token } = useParams();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axiosInstance.post(`/auth/reset-password/${token}`, {
        nuevaContraseña: newPassword,
      });
      setMessage('✔️ Contraseña actualizada. Redirigiendo...');
      setTimeout(() => navigate('/login'), 2000);
    } catch (error) {
      setMessage('❌ Error: Token inválido o expirado');
    }
  };

  return (
    <div className="reset-password-container">
      <h2>Restablecer Contraseña</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="password"
          placeholder="Nueva contraseña"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          required
        />
        <button type="submit">Actualizar Contraseña</button>
      </form>
      {message && <p className="status-message">{message}</p>}
    </div>
  );
};

export default ResetPassword;