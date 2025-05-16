const express = require('express');
const router = express.Router();
const transporter = require('../../config/Gmail/Gmail');
const Pedido = require('../../models/Pedido'); 

router.post('/contacto', async (req, res) => {
  const { nombre, correo, asunto, mensaje } = req.body;

  try {
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: process.env.EMAIL_USER, // Cambiar si deseas enviar a otro correo
      subject: `Nuevo mensaje de ayuda: ${asunto}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #ddd; border-radius: 8px; overflow: hidden;">
          <div style="background-color:rgb(0, 119, 255); color: white; padding: 20px; text-align: center;">
            <h1 style="margin: 0;">Mensaje de Soporte</h1>
          </div>
          <div style="padding: 20px; line-height: 1.6; color: #333;">
            <p><strong>Nombre:</strong> ${nombre}</p>
            <p><strong>Correo:</strong> <a href="mailto:${correo}" style="color:rgb(0, 162, 255);">${correo}</a></p>
            <p><strong>Asunto:</strong> ${asunto}</p>
            <p><strong>Mensaje:</strong></p>
            <div style="background-color: #f9f9f9; padding: 15px; border-left: 4px solidrgb(76, 122, 175); margin-top: 10px;">
              ${mensaje}
            </div>
          </div>
          <div style="background-color: #f1f1f1; color: #777; padding: 10px; text-align: center; font-size: 12px;">
            <p>Este mensaje fue enviado desde el formulario de soporte de tu aplicación (MAXCOMGAMES).</p>
          </div>
        </div>
      `,
    });

    res.status(200).json({ message: 'Correo enviado con éxito' });
  } catch (error) {
    console.error('Error al enviar correo:', error); // Verifica este log
    res.status(500).json({ message: 'Error al enviar el correo' });
  }
});

router.post('/report', async (req, res) => {
  const { orderId, producto, detalles } = req.body;

  try {
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: process.env.EMAIL_USER,
      subject: `Reporte de problema en pedido ${orderId}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #ddd; border-radius: 8px; overflow: hidden;">
          <div style="background-color:rgb(0, 119, 255); color: white; padding: 20px; text-align: center;">
            <h1 style="margin: 0;">Reporte de problema</h1>
          </div>
          <div style="padding: 20px; line-height: 1.6; color: #333;">
            <h2 style="color: #333; margin-bottom: 10px;">Pedido: ${orderId}</h2>
            <h3 style="color: #333; margin-bottom: 10px;">Producto con problema</h3>
            <div style="background-color: #f9f9f9; padding: 15px; border-left: 4px solidrgb(76, 122, 175); margin-top: 10px;">
              <p><strong>Nombre:</strong> ${producto.Nombre}</p>
              <p><strong>Cantidad:</strong> ${producto.Cantidad}</p>
              <p><strong>Precio:</strong> $${producto.PrecioUnitario.toFixed(2)} MXN</p>
            </div>
            <h3 style="color: #333; margin-bottom: 10px;">Detalles del problema</h3>
            <p>${detalles}</p>
          </div>
          <div style="background-color: #f1f1f1; color: #777; padding: 10px; text-align: center; font-size: 12px;">
            <p>Este reporte fue enviado desde el formulario de soporte de tu aplicación (MAXCOMGAMES).</p>
          </div>
        </div>
      `,
    });
    res.status(200).json({ message: 'Reporte enviado con éxito' });
  } catch (error) {
    console.error('Error al enviar reporte:', error);
    res.status(500).json({ message: 'Error al enviar el reporte' });
  }
});
module.exports = router;
