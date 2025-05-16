const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const authRoutes = require('./routes/Auth/auth');
const usuariosRoutes = require('./routes/User/usuarios');
const productRoutes = require('./routes/Products/products');
const carritoRoutes = require('./routes/Cart/carritos');
const descuentosRoutes = require('./routes/Disscount/descuentos');
const paymentsRoutes = require('./routes/Pay/payments');
const pedidosRoutes = require('./routes/Orders/pedidos');
const soporteRoutes = require('./routes/Support/soporte');

const app = express();
const PORT = process.env.PORT || 5000;

// Leer orígenes permitidos desde variables de entorno y limpiar espacios
const getAllowedOrigins = () => {
  const env = process.env.NODE_ENV || 'development';
  const origins = env === 'production'
    ? process.env.ALLOWED_ORIGINS_PROD
    : process.env.ALLOWED_ORIGINS_DEV;
  return origins
    ? origins.split(',').map(origin => origin.trim()).filter(Boolean)
    : ['http://localhost:3000'];
};
const allowedOrigins = getAllowedOrigins();

// Middleware CORS
app.use(cors({
  origin: function (origin, callback) {
    // Permitir peticiones sin origen (como Postman) o si el origen está permitido
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('No permitido por CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

// Middleware para parsear JSON
app.use(express.json());

// Servir archivos estáticos desde la carpeta "public/uploads"
app.use('/uploads', express.static(path.join(__dirname, 'public', 'uploads')));

// Servir frontend estático en producción
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, 'public')));
  app.get('*', (req, res, next) => {
    // Si la ruta empieza por /api o /uploads, pasar al siguiente middleware
    if (req.path.startsWith('/api') || req.path.startsWith('/uploads')) return next();
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
  });
}

// Conexión a MongoDB con opciones recomendadas
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('Conectado a MongoDB'))
  .catch((error) => {
    console.error('Error en la conexión:', error);
    process.exit(1);
  });

// Usar rutas
app.use('/api/auth', authRoutes);
app.use('/api/usuarios', usuariosRoutes);
app.use('/api/products', productRoutes);
app.use('/api/carritos', carritoRoutes);
app.use('/api/descuentos', descuentosRoutes);
app.use('/api/payments', paymentsRoutes);
app.use('/api/pedidos', pedidosRoutes);
app.use('/api/soporte', soporteRoutes);

// Manejar rutas no encontradas
app.use((req, res, next) => {
  res.status(404).json({ message: 'Ruta no encontrada' });
});

// Manejo de errores global
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Algo salió mal en el servidor' });
});

// Iniciar el servidor
app.listen(PORT, '0.0.0.0', () => {
  });