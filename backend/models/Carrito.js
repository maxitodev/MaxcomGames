const mongoose = require('mongoose');

const carritoSchema = new mongoose.Schema({
  ID_Carrito: {
    type: Number,
    unique: true,
    required: true,
  },
  ID_Usuario: {
    type: mongoose.Schema.Types.ObjectId, // Relación con el modelo User
    ref: 'User',
    required: true,
  },
  Fecha_Creacion: {
    type: Date,
    default: Date.now,
  },
  Estado: {
    type: String,
    enum: ['Creado', 'Pagado', 'Entregado', 'Cancelado'],
    required: true,
  },
  Fecha_Pago: {
    type: Date,
    required: false,
  },
  Codigo_Descuento: {
    type: String,
    maxlength: 10,
    required: false,
  },
});

const Carrito = mongoose.model('Carrito', carritoSchema);
module.exports = Carrito;