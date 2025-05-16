import React, { useEffect } from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem('token');

  useEffect(() => {
    if (!token) {
      alert('Debes iniciar sesión para acceder a esta página.'); // Mensaje opcional
    }
  }, [token]);

  return token ? children : <Navigate to="/" />;
};

export default ProtectedRoute;