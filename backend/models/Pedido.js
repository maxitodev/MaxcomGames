const mongoose = require('mongoose');

const pedidoSchema = new mongoose.Schema({
  ID_Usuario: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  Productos: [{
    ID_Producto: { type: Number, required: true },
    Nombre: { type: String, required: true },
    Cantidad: { type: Number, required: true },
    PrecioUnitario: { type: Number, required: true },
    Imagen: { type: String, required: true }, // Campo para la imagen
  }],
  MontoTotal: {
    type: Number,
    required: true,
  },
  Fecha_Pedido: {
    type: Date,
    default: Date.now,
  },
  MetodoPago: {
    type: String,
    required: true,
  },
  Estado: {
    type: String,
    enum: ['Pendiente','Entregado', 'Cancelado'],
    default: 'Pendiente',
  },
  Codigo_Descuento: {
    type: String,
    required: false,
  },
});

const Pedido = mongoose.model('Pedido', pedidoSchema);
module.exports = Pedido;