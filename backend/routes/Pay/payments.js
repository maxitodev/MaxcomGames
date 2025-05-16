const express = require('express');
const router = express.Router();
const paypal = require('@paypal/checkout-server-sdk');
const mercadopago = require('../../config/MercadoPago/MercadoPago');
const config = require('../../config/Paypal/Paypal');

// Load Stripe secret key from environment variable
const stripeSecretKey = process.env.STRIPE_SECRET_KEY;
if (!stripeSecretKey) {
  throw new Error('STRIPE_SECRET_KEY is not set in environment variables');
}
const Stripe = require('stripe');
const stripe = Stripe(stripeSecretKey); 

// Reemplazar las variables base por valores obtenidos desde el .env
const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3000';
const backendUrl = process.env.BACKEND_URL || 'http://localhost:5000';

// Configuración de PayPal
const environment = new paypal.core.SandboxEnvironment(
  config.PAYPAL_CLIENT_ID,
  config.PAYPAL_SECRET
);
const client = new paypal.core.PayPalHttpClient(environment);

// Ruta para crear la orden de PayPal
router.post('/paypal/create-order', async (req, res) => {
  const { amount } = req.body;

  const request = new paypal.orders.OrdersCreateRequest();
  request.requestBody({
    intent: 'CAPTURE',
    purchase_units: [{
      amount: {
        currency_code: 'MXN',
        value: amount.toString()
      }
    }],
    application_context: {
      return_url: `${backendUrl}/api/payments/paypal/success`, // URL de éxito
      cancel_url: `${backendUrl}/api/payments/paypal/cancel`  // URL de cancelación
    }
  });

  try {
    const response = await client.execute(request);
    const approvalUrl = response.result.links.find(link => link.rel === 'approve').href;
    res.json({ approvalLink: approvalUrl });
  } catch (error) {
    console.error('Error en PayPal:', error);
    res.status(500).json({ error: 'Error al crear la orden' });
  }
});

// Ruta de Éxito (pago completado)
router.get('/paypal/success', async (req, res) => {
  const { token } = req.query; // <-- Aquí se obtiene el ID de la orden

  // Capturar el pago usando el token (order ID)
  const request = new paypal.orders.OrdersCaptureRequest(token);
  try {
    const response = await client.execute(request);
    const order = response.result;

    if (order.status === 'COMPLETED') {
      console.log('Pago exitoso:', order);
      return res.redirect(`${frontendUrl}/confirmacion`);
    } else {
      return res.status(400).json({ error: 'El pago no se completó' });
    }
  } catch (error) {
    console.error('Error al capturar el pago:', error);
    return res.status(500).json({ error: 'Error interno del servidor' });
  }
});

// Ruta de Fracaso (pago cancelado o error)
router.get('/paypal/cancel', (req, res) => {
  console.log('Pago cancelado por el usuario');
  res.redirect(`${frontendUrl}/pago-invalido`);
});

router.post('/mercadopago/create-preference', async (req, res) => {
  const { items } = req.body;

  // Verificar que los items estén presentes
  if (!items || !Array.isArray(items)) {
    return res.status(400).json({ message: 'Items no proporcionados o no es un arreglo' });
  }

  // Estructura de la preferencia
  const preferenceData = {
    items: items.map(item => ({
      title: item.name,
      unit_price: parseFloat(item.price),
      quantity: parseInt(item.quantity),
    })),
    back_urls: {
      success: `${frontendUrl}/confirmacion`, // URL de éxito
      failure: `${frontendUrl}/pago-invalido`,   // URL de fallo
      pending: `${frontendUrl}/pago-pendiente`,  // URL de pago pendiente
    },
    auto_return: 'approved', // Redirigir automáticamente al usuario después del pago
  };

  try {
    const response = await mercadopago.preference.create({ body: preferenceData });
    console.log("Respuesta completa de MercadoPago:", response);
    if (!response || !response.init_point) {
      throw new Error('La respuesta de MercadoPago no contiene init_point');
    }
    res.json({ init_point: response.init_point });
  } catch (error) {
    console.error('Error al crear preferencia de pago:', error);
    res.status(500).json({ message: 'Error al crear preferencia de pago', error: error.message });
  }
});

router.post('/create-checkout-session', async (req, res) => {
  try {
    const { items, total } = req.body;
    
    if (!items || !Array.isArray(items)) {
      return res.status(400).json({ error: 'Datos de productos inválidos' });
    }

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: items.map(item => ({
        price_data: {
          currency: 'mxn',
          product_data: { 
            name: item.name,
            images: [item.image]
          },
          unit_amount: Math.round(item.price * 100),
        },
        quantity: item.quantity,
      })),
      mode: 'payment',
      success_url: `${frontendUrl}/confirmacion?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${frontendUrl}/pago-invalido`,
      metadata: {
        user_id: req.headers.authorization.split(' ')[1]
      }
    });

    console.log('Sesión de Stripe creada:', session.id);
    res.json({ url: session.url });

  } catch (error) {
    console.error('Error en Stripe:', error.raw ? error.raw.message : error);
    res.status(500).json({ 
      error: 'Error al crear la sesión de pago',
      details: error.raw ? error.raw.message : error.message 
    });
  }
});

module.exports = router;