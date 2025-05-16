import React, { useState } from 'react';
import './Sandbox.css';

const Sandbox = () => {
  const [copyNotification, setCopyNotification] = useState('');

  const copyToClipboard = async (text) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopyNotification(`Copiado: ${text}`);
    } catch {
      setCopyNotification("No se pudo copiar el texto");
    }
    setTimeout(() => setCopyNotification(''), 2000);
  };

  return (
    <div className="sandbox-page">
      <div className="container">
        <h2>🔒 Credenciales de Prueba (Utiliza los datos proporcionados para el pago)</h2>
        <div className="test-credentials">
          <div className="credential-section">
            <h4>PayPal (Inicia sesión con la cuenta):</h4>
            <ul>
              <li>
                Correo: <code>sb-cnxlo30887622@personal.example.com</code>
                <button
                  onClick={() => copyToClipboard('sb-cnxlo30887622@personal.example.com')}
                  aria-label="Copiar correo de PayPal"
                >
                  Copiar
                </button>
              </li>
              <li>
                Contraseña: <code>$EP=5qY.</code>
                <button
                  onClick={() => copyToClipboard('$EP=5qY.')}
                  aria-label="Copiar contraseña de PayPal"
                >
                  Copiar
                </button>
              </li>
            </ul>
          </div>
          <div className="credential-section">
            <h4>MercadoPago (Usa la opción Tarjeta de crédito):</h4>
            <ul>
              <li>
                Titular: <code>APRO</code>
                <button onClick={() => copyToClipboard('Apro')} aria-label="Copiar titular de MercadoPago">Copiar</button>
              </li>
              <li>
                Tarjeta: <code>5474 9254 3267 0366</code>
                <button onClick={() => copyToClipboard('5474 9254 3267 0366')} aria-label="Copiar número de tarjeta MercadoPago">Copiar</button>
              </li>
              <li>
                Vencimiento: <code>11/30</code>
                <button onClick={() => copyToClipboard('11/30')} aria-label="Copiar fecha de vencimiento MercadoPago">Copiar</button>
              </li>
              <li>
                CVV: <code>123</code>
                <button onClick={() => copyToClipboard('123')} aria-label="Copiar CVV MercadoPago">Copiar</button>
              </li>
            </ul>
          </div>
          <div className="credential-section">
            <h4>Stripe (Tarjeta de Crédito/Débito):</h4>
            <ul>
              <li>
                Tarjeta: <code>4242 4242 4242 4242</code>
                <button
                  onClick={() => copyToClipboard('4242 4242 4242 4242')}
                  aria-label="Copiar número de tarjeta Stripe"
                >
                  Copiar
                </button>
              </li>
              <li>
                Vencimiento: <code>12/34</code>
                <button onClick={() => copyToClipboard('12/34')} aria-label="Copiar fecha de vencimiento Stripe">Copiar</button>
              </li>
              <li>
                CVC: <code>123</code>
                <button onClick={() => copyToClipboard('123')} aria-label="Copiar CVC Stripe">Copiar</button>
              </li>
            </ul>
          </div>
          <p className="disclaimer">* Estas son credenciales de prueba para uso académico</p>
        </div>
        {copyNotification && <div className="copy-notification">{copyNotification}</div>}
      </div>
    </div>
  );
};

export default Sandbox;
