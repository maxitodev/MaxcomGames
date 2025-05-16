const express = require('express');
const router = express.Router();
const Carrito = require('../../models/Carrito');
const DetalleCarrito = require('../../models/DetalleCarrito');
const Pedido = require('../../models/Pedido');
const Producto = require('../../models/Products');
const verifyToken = require('../../middlewares/verifyToken');
const transporter = require('../../config/Gmail/Gmail'); // <-- Importar transporter para enviar correos
const User = require('../../models/User'); // <-- Importar el modelo User para obtener el email
// Agregar variable para URL del frontend
const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3000';

router.post('/confirmar', verifyToken, async (req, res) => {
  try {
    // 1. Recuperar el carrito del usuario
    const carrito = await Carrito.findOne({ ID_Usuario: req.user.id });
    if (!carrito) {
      return res.status(404).json({ error: 'Carrito no encontrado' });
    }

    // 2. Recuperar los detalles del carrito
    const detallesCarrito = await DetalleCarrito.find({ ID_Carrito: carrito.ID_Carrito });

    // 3. Obtener los productos completos para calcular el total
    const productos = await Promise.all(
      detallesCarrito.map(async (detalle) => {
        const producto = await Producto.findOne({ ID_Producto: detalle.ID_Producto });
        return {
          ID_Producto: producto.ID_Producto,
          Nombre: producto.Nombre_Producto,
          Cantidad: detalle.Cantidad,
          PrecioUnitario: producto.Precio,
          Imagen: producto.Imagen_URL, // Incluir la imagen del producto
        };
      })
    );

    // 4. Calcular el monto total (sin IVA)
    const subtotal = productos.reduce((acc, prod) => acc + (prod.PrecioUnitario * prod.Cantidad), 0);
    const paymentFees = {
      paypal: 0.05,
      mercadopago: 0.03,
      creditcard: 0.02
    };
    const fee = req.body.metodoPago ? subtotal * paymentFees[req.body.metodoPago] : 0;
    // Asegurar que si hay código de descuento se aplique un 10% (ejemplo)
    let discountPercentage = 0; // valor por defecto 0%
    if (req.body.codigoDescuento) {
      discountPercentage = 10; // Se aplica un descuento del 10% al total
    }
    const discountAmount = (subtotal + fee) * (discountPercentage / 100);
    const total = subtotal + fee - discountAmount;

    // Mapear el valor del método de pago a la etiqueta deseada.
    const rawMetodoPago = req.body.metodoPago || req.query.metodoPago; // se obtendrá de body o query string
    const metodoPagoMap = {
      paypal: 'Paypal',
      mercadopago: 'Mercadopago',
      creditcard: 'Tarjeta de crédito/débito'
    };
    const metodoPagoDisplay = typeof rawMetodoPago === 'string'
      ? (metodoPagoMap[rawMetodoPago.toLowerCase()] || rawMetodoPago)
      : rawMetodoPago;

    // 5. Guardar el pedido en la colección `Pedido`
    const nuevoPedido = new Pedido({
      ID_Usuario: req.user.id,
      Productos: productos,
      MontoTotal: total,
      MetodoPago: metodoPagoDisplay, // Se utiliza la etiqueta formateada
      Codigo_Descuento: req.body.codigoDescuento,
    });
    await nuevoPedido.save();

    // Enviar correo de confirmación con desglose del pedido y entrega de CDKEYS
    const user = await User.findById(req.user.id);
if (user && user.Correo) {
  const fecha = new Date().toLocaleDateString('es-MX');
  // Se muestra el número completo del pedido en mayúsculas
  const numeroPedido = nuevoPedido._id.toString().toUpperCase();
  
  const productosHtml = nuevoPedido.Productos.map((prod, index) => `
    <tr>
      <td style="padding: 12px; border-bottom: 1px solid #f0f0f0">
        <img src="cid:image${index}" alt="${prod.Nombre}" style="width: 64px; height: 64px; object-fit: cover; border-radius: 4px;">
      </td>
      <td style="padding: 12px; border-bottom: 1px solid #f0f0f0">
        ${prod.Nombre}<br>
        <small>Cantidad: ${prod.Cantidad}</small>
      </td>
      <td style="padding: 12px; border-bottom: 1px solid #f0f0f0">
        $${prod.PrecioUnitario.toFixed(2)}
      </td>
    </tr>
  `).join('');

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: user.Correo,
    subject: '✅ Pedido Confirmado - MAXCOMGAMES',
    html: `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <title>Confirmación de Pedido</title>
          <style>
            body { font-family: 'Arial', sans-serif; line-height: 1.6; max-width: 680px; margin: 0 auto; padding: 20px; }
            .container { border: 1px solid #f0f0f0; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 4px rgba(0,0,0,0.05); }
            .header { background:rgb(44, 44, 44); color: white; padding: 20px; text-align: center; }
            .header img { max-width: 150px; }
            .content { padding: 20px; }
            .footer { background: #f8f9fa; padding: 15px; text-align: center; border-top: 1px solid #e7e7e7; }
            .button { background: #3498db; color: white; padding: 12px 24px; border-radius: 4px; text-decoration: none; display: inline-block; }
            .button:hover { background: #2980b9; }
            .divider { border-bottom: 1px solid #e7e7e7; margin: 20px 0; }
            .total { font-weight: bold; font-size: 1.1em; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>Pedido Confirmado</h1>
              <p>¡Hola ${user.Nombre || 'Cliente'}, tu pedido está en camino!</p>
            </div>
            
            <div class="content">
              <h2>Detalles del Pedido</h2>
              <p><strong>Número de Pedido:</strong> ${numeroPedido}</p>
              <p><strong>Fecha:</strong> ${fecha}</p>
              <p><strong>Método de Pago:</strong> ${nuevoPedido.MetodoPago}</p>
              
              <table style="width: 100%; margin: 20px 0;">
                ${productosHtml}
              </table>

              <div class="divider"></div>
              
              <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
                <span>Subtotal:&nbsp; </span>
                <span>$${subtotal.toFixed(2)}</span>
              </div>
              <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
                <span>Service Fee (${req.body.metodoPago ? paymentFees[req.body.metodoPago] * 100 : 0}%):&nbsp; </span>
                <span>$${fee.toFixed(2)}</span>
              </div>
              ${ discountAmount > 0 ? `
              <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
                <span>Descuento:&nbsp; </span>
                <span>- $${discountAmount.toFixed(2)}</span>
              </div>` : '' }
              <div class="total" style="display: flex; justify-content: space-between; margin-top: 15px;">
                <span>Total:&nbsp; </span>
                <span>$${total.toFixed(2)}</span>
              </div>

              <div class="divider"></div>
              
              <h3>¿Qué sigue?</h3>
              <ul style="list-style: none; padding: 0;">
                <li>▶ Recibirás tus CDKEYS en un correo separado</li>
                <li>▶ Podrás ver el estado de tu pedido en <a href="${frontendUrl}/mis-pedidos">Mis Pedidos</a></li>
                <li>▶ Contacta soporte@maxcomgames.com para cualquier consulta</li>
              </ul>
            </div>

            <div class="footer">
              <p>&copy; ${new Date().getFullYear()} MAXCOMGAMES Todos los derechos reservados.</p>
              <p>
              </p>
              <small>Este correo fue enviado automáticamente, no es necesario responder.</small>
            </div>
          </div>
        </body>
      </html>
    `,
    attachments: nuevoPedido.Productos.map((prod, index) => ({
      filename: `product${index}.png`, 
      path: prod.Imagen,
      cid: `image${index}`
    }))
  };
      console.log('mailOptions:', mailOptions); // Verificar opciones del correo
      try {
        const info = await transporter.sendMail(mailOptions);
        console.log('Correo de confirmación enviado, ID:', info.messageId);
      } catch (emailError) {
        console.error('Error al enviar correo de confirmación:', emailError);
      }
    }

    // 6. Eliminar el carrito y sus detalles
    await Carrito.deleteOne({ ID_Usuario: req.user.id });
    await DetalleCarrito.deleteMany({ ID_Carrito: carrito.ID_Carrito });

    // 7. Responder con éxito
    res.status(201).json({ msg: 'Pedido confirmado y carrito eliminado', pedido: nuevoPedido });
  } catch (error) {
    console.error('Error al confirmar el pedido:', error);
    res.status(500).json({ error: 'Error al confirmar el pedido' });
  }
});

// Endpoint para obtener los pedidos del usuario
router.get('/mis-pedidos', verifyToken, async (req, res) => {
  try {
    const pedidos = await Pedido.find({ ID_Usuario: req.user.id });
    res.json(pedidos);
  } catch (error) {
    console.error('Error al obtener los pedidos:', error);
    res.status(500).json({ error: 'Error al obtener los pedidos' });
  }
});

module.exports = router;