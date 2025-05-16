const mongoose = require('mongoose');
const detalleCarritoSchema = new mongoose.Schema({
  ID_Carrito: {
    type: Number,
    required: true,
  },
  ID_Producto: {
    type: Number,
    required: true,
  },
  Cantidad: {
    type: Number,
    required: true,
  },
  Estado: {
    type: String,
    enum: ['Creado', 'Pagado', 'Entregado', 'Cancelado'],
    required: true,
  },
});

// Crear un índice único para evitar duplicados
detalleCarritoSchema.index({ ID_Carrito: 1, ID_Producto: 1 }, { unique: true });

const DetalleCarrito = mongoose.model('DetalleCarrito', detalleCarritoSchema);
module.exports = DetalleCarrito;