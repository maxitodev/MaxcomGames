import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const ScrollToTop = () => {
  const location = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0); // Desplaza la ventana al principio
  }, [location.pathname]); // Se ejecuta cada vez que cambia la ruta

  return null; // Este componente no renderiza nada
};

export default ScrollToTop;