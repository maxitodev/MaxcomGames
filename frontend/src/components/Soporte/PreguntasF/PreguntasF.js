import React, { useState } from 'react';
import './PreguntasF.css'; // Importa los estilos CSS

const FAQ = () => {
  // Estado para manejar qué pregunta está desplegada
  const [activeIndex, setActiveIndex] = useState(null);

  // Datos de las preguntas y respuestas
  const faqData = [
    {
      question: '¿Cómo recibo mi CD Key después de la compra?',
      answer: 'Una vez que completes tu compra, recibirás un correo electrónico con tu CD Key y las instrucciones para activarlo en la plataforma correspondiente.',
    },
    {
      question: '¿Qué métodos de pago aceptan?',
      answer: 'Aceptamos tarjetas de crédito/débito, PayPal y otros métodos de pago electrónicos. Todos los pagos son procesados de forma segura.',
    },
    {
      question: '¿Puedo devolver o cambiar un CD Key?',
      answer: 'Los CD Keys no son reembolsables ni intercambiables una vez que han sido enviados, ya que son productos digitales y no pueden ser recuperados.',
    },
    {
      question: '¿Qué hago si mi CD Key no funciona?',
      answer: 'Si tienes problemas con tu CD Key, contáctanos a través de nuestro soporte técnico con el comprobante de compra y te ayudaremos a resolver el problema.',
    },
    {
      question: '¿Cuánto tiempo tarda en llegar mi CD Key?',
      answer: 'La mayoría de los CD Keys se envían de forma instantánea después de la compra. En algunos casos, puede haber un pequeño retraso, pero nunca más de 24 horas.',
    },
  ];

  // Función para manejar el clic en una pregunta
  const handleQuestionClick = (index) => {
    if (activeIndex === index) {
      setActiveIndex(null); // Cierra la pregunta si ya está abierta
    } else {
      setActiveIndex(index); // Abre la pregunta seleccionada
    }
  };

  return (
    <div className="faq-container">
      <h1>Preguntas Frecuentes</h1>
      <div className="faq-list">
        {faqData.map((item, index) => (
          <div key={index} className="faq-item">
            <div
              className={`faq-question ${activeIndex === index ? 'active' : ''}`}
              onClick={() => handleQuestionClick(index)}
            >
              {item.question}
              <span className="faq-icon">{activeIndex === index ? '-' : '+'}</span>
            </div>
            {activeIndex === index && (
              <div className="faq-answer">
                <p>{item.answer}</p>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default FAQ;