const { MercadoPagoConfig, Preference } = require('mercadopago');

const mercadopago = new MercadoPagoConfig({
  accessToken: process.env.MERCADOPAGO_ACCESS_TOKEN,
});

const preference = new Preference(mercadopago);

module.exports = { mercadopago, preference };