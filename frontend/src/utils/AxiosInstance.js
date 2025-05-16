import axios from 'axios';

// Leer la variable de entorno
const API_URL = process.env.REACT_APP_API_URL;

// Crear una instancia de Axios
const axiosInstance = axios.create({
  baseURL: API_URL,
  timeout: 3000,
  headers: {
    'Content-Type': 'application/json',
  },
});

export default axiosInstance;