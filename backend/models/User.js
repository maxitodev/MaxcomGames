const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  ID_Usuario: {
    type: Number,
    required: true,
    unique: true,
  },
  Nombre: {
    type: String,
    required: true,
  },
  Correo: {
    type: String,
    required: true,
    unique: true,
  },
  Contraseña: {
    type: String,
    required: function () {
      return this.Tipo_Autenticación !== 'Google';
    },
  },
  Tipo_Autenticación: {
    type: String,
    enum: ['manual', 'Google'],
    default: 'manual',
  },
  resetToken: String,
  resetTokenExpiration: Date,
});

module.exports = mongoose.model('User', userSchema);