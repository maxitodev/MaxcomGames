const express = require('express');
const bcrypt = require('bcrypt');
const User = require('../../models/User');
const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const usuarios = await User.find(); // Obtiene todos los usuarios de la base de datos
    res.json(usuarios);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener usuarios' });
  }
});

router.post('/', async (req, res) => {
  const { Nombre, Correo, Contraseña } = req.body;

  if (!Nombre || !Correo || !Contraseña) {
    return res.status(400).json({ message: 'Todos los campos son obligatorios' });
  }

  // Validar formato de correo
  const emailRegex = /^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/;
  if (!emailRegex.test(Correo)) {
    return res.status(400).json({ message: 'Formato de correo inválido' });
  }

  // Validar que la contraseña sea segura:
  // mínimo 8 caracteres, mayúsculas, minúsculas, un dígito y un símbolo.
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/;
  if (!passwordRegex.test(Contraseña)) {
    return res.status(400).json({ message: 'La contraseña debe tener al menos 8 caracteres, mayúsculas, minúsculas, números y un símbolo.' });
  }

  try {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(Contraseña, salt);

    const nuevoUsuario = new User({
      ID_Usuario: Math.floor(Math.random() * 1000000),
      Nombre,
      Correo,
      Contraseña: hashedPassword,
    });

    const usuarioGuardado = await nuevoUsuario.save();
    console.log('Usuario registrado exitosamente:', usuarioGuardado);
    res.status(201).json({ message: 'Usuario registrado exitosamente', usuarioGuardado });
  } catch (error) {
    if (error.code === 11000) {
      res.status(400).json({ message: 'El correo ya está registrado' });
    } else {
      console.error('Error al registrar usuario:', error);
      res.status(500).json({ message: 'Error del servidor' });
    }
  }
});

module.exports = router;
