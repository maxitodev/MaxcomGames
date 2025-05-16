const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const descuentoSchema = new Schema({
  ID_Usuario: {
    type: Number,
    required: true,
    unique: true // Identifica de forma única al usuario
  },
  Codigo_Descuento: {
    type: String,
    required: true,
    unique: true // Código único del descuento
  },
  Descripcion: {  // Nota: se recomienda evitar acentos en los nombres de campos
    type: String,
    required: true
  },
  Descuento: {
    type: Number,
    required: true
  },
  Fecha_Expiracion: {
    type: Date,
    required: true
  }
});

module.exports = mongoose.model('Descuento', descuentoSchema);
