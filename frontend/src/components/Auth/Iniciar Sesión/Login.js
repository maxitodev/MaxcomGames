import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { GoogleOAuthProvider, GoogleLogin } from '@react-oauth/google';
import axiosInstance from '../../../utils/AxiosInstance';
import './Login.css';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();

  // Función para login manual usando axios con withCredentials
  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axiosInstance.post(
        '/auth/login',
        { Correo: email, Contraseña: password },
        { withCredentials: true }
      );
      handlePostLogin(data.token);
    } catch (error) {
      console.error('Error en inicio de sesión manual:', error);
      setErrorMessage(
        error.response?.data?.message || 'Error al iniciar sesión'
      );
    }
  };

  // Función para éxito con Google usando axios con withCredentials
  const handleGoogleSuccess = async (credentialResponse) => {
    try {
      const { data } = await axiosInstance.post(
        '/auth/google',
        { token: credentialResponse.credential },
        { withCredentials: true }
      );
      handlePostLogin(data.token);
    } catch (error) {
      console.error('Error en inicio de sesión con Google:', error);
      setErrorMessage(
        error.response?.data?.message || 'Error con Google'
      );
    }
  };

  // Función común post-login
  const handlePostLogin = (token) => {
    localStorage.setItem('token', token); // Guardar token en localStorage
    syncCart(token); // Sincronizar carrito
    navigate('/'); // Redirigir al usuario a la página principal
    window.location.reload(); // Recargar la página para aplicar cambios
  };

  // Sincronizar carrito
  const syncCart = async (token) => {
    const storedCart = JSON.parse(localStorage.getItem('carrito')) || [];
    if (storedCart.length > 0) {
      try {
        await axiosInstance.post(
          '/cart/actualizar',
          { productos: storedCart },
          {
            withCredentials: true,
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        localStorage.removeItem('carrito'); // Limpiar el carrito local
      } catch (error) {
        console.error('Error al sincronizar carrito:', error);
        setErrorMessage('Error al sincronizar el carrito');
      }
    }
  };

  return (
    <div className="login-container">
      <h2>Iniciar Sesión</h2>
      {errorMessage && <p className="error-message">{errorMessage}</p>}

      {/* Formulario de inicio de sesión manual */}
      <form className="login-form" onSubmit={handleLogin}>
        <input
          type="email"
          placeholder="Correo electrónico"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Contraseña"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit">Iniciar Sesión</button>
      </form>

      {/* Botón de inicio de sesión con Google */}
      <div className="google-login">
        <GoogleOAuthProvider clientId={process.env.REACT_APP_GOOGLE_CLIENT_ID}>
          <GoogleLogin
            onSuccess={handleGoogleSuccess}
            onError={() => {
              console.error('Error al autenticar con Google');
              setErrorMessage('Error con Google');
            }}
            text="continue_with"
            shape="rectangular"
          />
        </GoogleOAuthProvider>
      </div>

      {/* Enlace para crear una cuenta */}
      <p className="create-account-link">
        ¿No tienes cuenta? <Link to="/register">Crear Cuenta</Link>
      </p>

      <p className="forgot-password-link">
        <Link to="/forgot-password">¿Olvidaste tu contraseña?</Link>
      </p>
    </div>
  );
};

export default Login;