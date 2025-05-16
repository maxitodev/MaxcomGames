import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import './Navbar.css';
import LoginPopup from './LoginPopup';
import SidebarCart from '../SidebarCart/SidebarCart';
import SidebarMenu from '../SidebarMenu/SidebarMenu';
import logo from '../../../assets/images/logo.png'; // Importa el logo directamente
import CartIcon from '../../../assets/icons/cart.png'; // Import the SVG image
import SearchIcon from '../../../assets/icons/search.svg'; // Import the new search icon
import axiosInstance from '../../../utils/AxiosInstance';

const Navbar = () => {
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [cartCount, setCartCount] = useState(0);
  const [searchActive, setSearchActive] = useState(false);
  const popupRef = useRef(null);
  const cartRef = useRef(null);
  const menuRef = useRef(null);
  const navigate = useNavigate();

  const decodeToken = useCallback((token) => {
    try {
      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const payload = JSON.parse(atob(base64));
      return payload;
    } catch (error) {
      console.error('Error al decodificar el token:', error);
      return null;
    }
  }, []);

  const checkTokenValidity = useCallback(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      setIsLoggedIn(false);
      return false;
    }
    const payload = decodeToken(token);
    if (!payload || !payload.exp) {
      localStorage.removeItem('token');
      setIsLoggedIn(false);
      return false;
    }
    const currentTime = Date.now() / 1000;
    if (payload.exp < currentTime) {
      localStorage.removeItem('token');
      setIsLoggedIn(false);
      return false;
    }
    setIsLoggedIn(true);
    return true;
  }, [decodeToken]);

  useEffect(() => {
    checkTokenValidity();
  }, [checkTokenValidity]);

  const useClickOutside = (ref, isOpen, onClose) => {
    useEffect(() => {
      const handleClickOutside = (event) => {
        if (ref.current && !ref.current.contains(event.target) && isOpen) {
          onClose();
        }
      };
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [ref, isOpen, onClose]);
  };

  useClickOutside(popupRef, isPopupOpen, () => setIsPopupOpen(false));
  useClickOutside(cartRef, isCartOpen, () => setIsCartOpen(false));
  useClickOutside(menuRef, isMenuOpen, () => setIsMenuOpen(false));

  const togglePopup = useCallback(() => setIsPopupOpen((prev) => !prev), []);
  const toggleCart = useCallback(() => setIsCartOpen((prev) => !prev), []);
  const toggleMenu = useCallback(() => setIsMenuOpen((prev) => !prev), []);

  const handleLogout = useCallback(() => {
    localStorage.removeItem('token');
    setIsLoggedIn(false);
    window.location.reload();
  }, []);

  const goToHome = useCallback(() => navigate('/'), [navigate]);

  const handleCartClick = () => {
    if (checkTokenValidity()) {
      toggleCart();
    } else {
      navigate('/login');
    }
  };

  const handleMisPedidosClick = () => {
    if (checkTokenValidity()) {
      navigate('/mis-pedidos');
    } else {
      navigate('/login');
    }
  };

  const handleSearch = () => {
    if (searchTerm.trim() !== '') {
      navigate(`/busqueda?query=${encodeURIComponent(searchTerm)}`);
    }
  };

  const fetchCartCount = useCallback(async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      setCartCount(0);
      return;
    }
    try {
      const response = await axiosInstance.get(`/carritos/mi-carrito?timestamp=${Date.now()}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const productos = response.data.productos || [];
      const count = productos.reduce((acc, item) => acc + (item.quantity || 1), 0);
      setCartCount(count);
    } catch (error) {
      console.error('Error fetching cart count', error);
      setCartCount(0);
    }
  }, []);

  useEffect(() => {
    fetchCartCount();
  }, [fetchCartCount, isCartOpen]);

  // Nuevo: Actualiza automáticamente el contador cada 10 segundos
  useEffect(() => {
    const intervalId = setInterval(() => {
      fetchCartCount();
    }, 100);
    return () => clearInterval(intervalId);
  }, [fetchCartCount]);

  useEffect(() => {
    if (!isMenuOpen && !isCartOpen) {
      setSearchTerm('');
    }
  }, [isMenuOpen, isCartOpen]);

  // Nuevo: navegación automática basada en el estado de la barra de búsqueda
  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      if (searchTerm.trim() === '' && searchActive) {
        navigate('/');
        setSearchActive(false);
      } else if (searchTerm.trim() !== '') {
        navigate(`/busqueda?query=${encodeURIComponent(searchTerm)}`);
      }
    }, 300);
    return () => clearTimeout(delayDebounceFn);
  }, [searchTerm, navigate, searchActive]);

  return (
    <>
      <nav className="navbar">
        <div className="navbar-left">
          <button className="menu-button" onClick={toggleMenu}>☰</button>
          <div className="logo" onClick={goToHome} style={{ cursor: 'pointer' }}>
            <img 
              src={logo} // Usa la variable importada
              alt="Logo" 
              style={{ height: '40px', width: 'auto' }} // Ajusta el tamaño según sea necesario
            />
          </div>
        </div>
        <div className="navbar-center">
          <div className="search-container">
            <input
              type="text"
              className="search-bar"
              placeholder="Buscar..."
              value={searchTerm}
              onChange={(e) => {
                const val = e.target.value;
                setSearchTerm(val);
                if (val.trim() !== '') {
                  setSearchActive(true);
                }
              }}
              onKeyDown={(e) => { if (e.key === 'Enter') handleSearch(); }}
            />
            <button className="search-button" onClick={handleSearch}>
              <img src={SearchIcon} alt="Buscar" />
            </button>
          </div>
        </div>
        <div className="navbar-right">
          {isLoggedIn ? (
            <button className="icon-button" onClick={handleLogout}>Cerrar Sesión</button>
          ) : (
            <button className="icon-button" onClick={togglePopup}>Iniciar Sesión</button>
          )}
          <button className="icon-button" onClick={handleMisPedidosClick}>Mis Pedidos</button>
          <button className="icon-button" onClick={handleCartClick}>
            <div style={{ position: 'relative', display: 'inline-block' }}>
              <img src={CartIcon} alt="Carrito" style={{ height: '32px', width: '32px' }} />
              <span className="cart-counter">{cartCount > 99 ? '+99' : cartCount}</span>
            </div>
            <span className="cart-text">Carrito</span>
          </button>
        </div>
      </nav>
      <div ref={popupRef}>
        <LoginPopup isOpen={isPopupOpen} togglePopup={togglePopup} />
      </div>
      <div ref={cartRef}>
        <SidebarCart isOpen={isCartOpen} toggleCart={toggleCart} />
      </div>
      <div ref={menuRef}>
        <SidebarMenu isOpen={isMenuOpen} toggleMenu={toggleMenu} isLoggedIn={isLoggedIn} />
      </div>
    </>
  );
};

export default Navbar;
