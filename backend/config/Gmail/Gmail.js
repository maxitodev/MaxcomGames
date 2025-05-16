const nodemailer = require("nodemailer");

// Configuración para SMTP (ejemplo con Google Workspace)
const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  auth: {
    user: process.env.EMAIL_USER, 
    pass: process.env.EMAIL_PASSWORD, 
  },
});

module.exports = transporter;