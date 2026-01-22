const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const crypto = require('crypto'); // Importar crypto
const User = require('../../models/User');
const { OAuth2Client } = require('google-auth-library');
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
const transporter = require('../../config/Gmail/Gmail'); // Importar transporter

const SECRET_KEY = process.env.JWT_SECRET; // Llave secreta para JWT
const router = express.Router();

// Ruta para el registro de usuarios
router.post('/register', async (req, res) => {
  const { ID_Usuario, Nombre, Correo, Contraseña, Tipo_Autenticación } = req.body;

  try {
    const existingUser = await User.findOne({ Correo });
    if (existingUser) {
      return res.status(400).json({ message: 'El correo ya está registrado' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(Contraseña, salt);

    const newUser = new User({
      ID_Usuario,
      Nombre,
      Correo,
      Contraseña: hashedPassword,
      Tipo_Autenticación: Tipo_Autenticación || 'manual',
    });

    await newUser.save();
    res.json({ message: 'Usuario registrado exitosamente' });
  } catch (error) {
    console.error('Error en registro:', error);
    res.status(500).json({ message: 'Error al registrar usuario' });
  }
});

// Ruta para el inicio de sesión manual
router.post('/login', async (req, res) => {
  const { Correo, Contraseña } = req.body;

  try {
    const user = await User.findOne({ Correo });
    if (!user) return res.status(400).json({ message: 'Usuario no encontrado' });

    const isMatch = await bcrypt.compare(Contraseña, user.Contraseña);
    if (!isMatch) return res.status(400).json({ message: 'Contraseña incorrecta' });

    const token = jwt.sign({ id: user._id, Correo: user.Correo }, SECRET_KEY, { expiresIn: '1d' });
    res.status(200).json({ message: 'Inicio de sesión exitoso', token });
  } catch (error) {
    console.error('Error en login:', error);
    res.status(500).json({ message: 'Error del servidor' });
  }
});

// Ruta para autenticación con Google
router.post('/google', async (req, res) => {
  const { token } = req.body;

  try {
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();
    const { email, name, sub: googleId } = payload;

    let user = await User.findOne({ Correo: email });

    if (!user) {
      user = new User({
        ID_Usuario: Date.now(), // Generar un ID único
        Nombre: name,
        Correo: email,
        Tipo_Autenticación: 'Google',
      });
      await user.save();
    } else if (user.Tipo_Autenticación !== 'Google') {
      return res.status(400).json({ message: 'Usa tu método de autenticación original' });
    }

    const tokenJWT = jwt.sign({ id: user._id, Correo: user.Correo }, SECRET_KEY, { expiresIn: '1d' });
    res.status(200).json({ token: tokenJWT });
  } catch (error) {
    console.error('Error en autenticación Google:', error);
    res.status(500).json({ message: 'Error con Google Auth' });
  }
});

// Nueva ruta: Solicitar recuperación de contraseña
router.post('/forgot-password', async (req, res) => {
  const { Correo } = req.body;

  // Validar que el campo Correo esté presente
  if (!Correo) {
    return res.status(400).json({ message: 'El campo Correo es requerido' });
  }

  try {
    // Buscar al usuario por correo
    const user = await User.findOne({ Correo });

    if (!user) {
      return res.status(404).json({ message: 'Correo no registrado' });
    }

    // Verificar que el usuario tenga una contraseña manual
    if (user.Tipo_Autenticación === 'Google' && !user.Contraseña) {
      return res.status(400).json({ message: 'Usa tu método de autenticación original (Google)' });
    }

    // Generar token y fecha de expiración
    const resetToken = crypto.randomBytes(20).toString('hex');
    user.resetToken = resetToken;
    user.resetTokenExpiration = Date.now() + 3600000; // 1 hora
    await user.save();

    // Enviar correo electrónico con diseño moderno
    await transporter.sendMail({
      from: '"MAXCOMGAMES" <support@maxcomgames.com>',
      to: Correo,
      subject: 'Restablecer Contraseña',
      html: `
        <div style="font-family: 'Arial', sans-serif; max-width: 600px; margin: auto; padding: 20px; background-color: #f9f9f9; border-radius: 10px; box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);">
          <h1 style="text-align: center; color: #007bff; font-size: 24px; margin-bottom: 20px;">Restablecer tu Contraseña</h1>
          <p style="font-size: 16px; color: #333; line-height: 1.5; text-align: center;">
            Hola, hemos recibido una solicitud para restablecer tu contraseña. Haz clic en el botón de abajo para continuar:
          </p>
          <div style="text-align: center; margin: 30px 0;">
            <a href="${frontendUrl}/reset-password/${resetToken}" style="display: inline-block; padding: 15px 30px; background-color: #007bff; color: #fff; text-decoration: none; font-size: 16px; font-weight: bold; border-radius: 5px; box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2); transition: background-color 0.3s ease;">
              Restablecer Contraseña
            </a>
          </div>
          <p style="font-size: 14px; color: #666; text-align: center;">
            Si no solicitaste este cambio, puedes ignorar este correo. Este enlace expirará en 1 hora.
          </p>
          <footer style="margin-top: 20px; text-align: center; font-size: 12px; color: #aaa;">
            &copy; 2025 MAXCOMGAMES. Todos los derechos reservados.
          </footer>
        </div>
      `,
    });

    res.json({ message: 'Correo enviado con éxito' });
  } catch (error) {
    console.error('Error en forgot-password:', error);
    res.status(500).json({ message: 'Error del servidor' });
  }
});
// Nueva ruta: Restablecer contraseña
router.post('/reset-password/:token', async (req, res) => {
  const { token } = req.params;
  const { nuevaContraseña } = req.body;

  // Validar que el campo nuevaContraseña esté presente
  if (!nuevaContraseña) {
    return res.status(400).json({ message: 'El campo nuevaContraseña es requerido' });
  }

  try {
    const user = await User.findOne({
      resetToken: token,
      resetTokenExpiration: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({ message: 'Token inválido o expirado' });
    }

    const salt = await bcrypt.genSalt(10);
    user.Contraseña = await bcrypt.hash(nuevaContraseña, salt);
    user.resetToken = undefined;
    user.resetTokenExpiration = undefined;
    await user.save();

    res.json({ message: 'Contraseña actualizada exitosamente' });
  } catch (error) {
    console.error('Error en reset-password:', error);
    res.status(500).json({ message: 'Error del servidor' });
  }
});

router.post('/set-password', async (req, res) => {
  const { Correo, Contraseña } = req.body;

  try {
    // Buscar al usuario por correo
    const user = await User.findOne({ Correo });

    if (!user) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    // Verificar que el usuario sea de Google
    if (user.Tipo_Autenticación !== 'Google') {
      return res.status(400).json({ message: 'Este usuario no es de Google' });
    }

    // Hashear la nueva contraseña
    const salt = await bcrypt.genSalt(10);
    user.Contraseña = await bcrypt.hash(Contraseña, salt);

    // Cambiar el tipo de autenticación a manual
    user.Tipo_Autenticación = 'manual';

    await user.save();
    res.json({ message: 'Contraseña establecida exitosamente' });
  } catch (error) {
    console.error('Error en set-password:', error);
    res.status(500).json({ message: 'Error del servidor' });
  }
});

module.exports = router;