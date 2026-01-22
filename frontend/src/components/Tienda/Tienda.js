// Archivo Tienda.js
import React, { useEffect, useState } from 'react';
import Slider from 'react-slick';
import { Link, useNavigate } from 'react-router-dom';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import './variables.css';
import './base.css';
import './banner-promocion.css';
import './banner-oferta.css';
import './responsive.css';
import axiosInstance from '../../utils/AxiosInstance';

const Banner = ({ categoria, title, sliderSettings, noDataMessage, showNotification }) => {
  const [items, setItems] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchItems = async () => {
      try {
        const response = await axiosInstance.get(`/products`, {
          params: { categoria },
        });
        setItems(Array.isArray(response.data.products) ? response.data.products : []);
      } catch (error) {
        console.error(`Error al obtener los productos de ${categoria}:`, error);
        setItems([]);
      }
    };
    fetchItems();
  }, [categoria]);

  const addToCart = async (product) => {
    const token = localStorage.getItem('token');
    
    if (!token) {
      navigate('/login');
      return;
    }

    try {
      const response = await axiosInstance.post(
        `/carritos/add-to-cart`,
        {
          productId: product.ID_Producto,
          quantity: 1,
        },
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log(response.data.message);
      showNotification();
    } catch (error) {
      if (error.response) {
        console.error('Error al añadir el producto:', error.response.data);
      } else {
        console.error('Error al comunicarse con el backend:', error);
      }
    }
  };

  return (
    <div className={`banner-container ${categoria.toLowerCase()}-container`}>
      {categoria === "Promoción" && title && <h2 className="banner-title">{title}</h2>}
      {categoria === "Oferta" && title && (
        <Link to="/ofertas" className="banner-title-button">
          {title}
        </Link>
      )}
      {items.length > 0 ? (
        <Slider {...sliderSettings}>
          {items.map((item) => (
            <div 
              key={item.ID_Producto} 
              className="banner-slide"
            >
              {categoria === "Promoción" ? (
                <div className="banner-slide-inner">
                  <Link to={`/comprar/${item.ID_Producto}`} className="banner-image-link">
                    <img src={item.Imagen_URL} alt={item.Nombre_Producto} className="banner-image" />
                  </Link>
                  <div className="banner-content">
                    <Link to={`/comprar/${item.ID_Producto}`} className="banner-button">Comprar Ahora</Link>
                  </div>
                </div>
              ) : (
                <div className="banner-product">
                  <Link to={`/comprar/${item.ID_Producto}`} className="banner-image-link">
                    <img src={item.Imagen_URL} alt={item.Nombre_Producto} className="banner-image" />
                  </Link>
                  <h3 className="banner-item-title">{item.Nombre_Producto}</h3>
                  <div className="banner-product-price">${item.Precio} MXN</div>
                  <div className="banner-buttons">
                    <Link to={`/comprar/${item.ID_Producto}`} className="banner-buy-button">Comprar Ahora</Link>
                    <button
                      type="button"
                      className="banner-cart-button"
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        addToCart(item);
                      }}
                    >
                      Añadir al Carrito
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </Slider>
      ) : (
        <p className="no-data-message">{noDataMessage}</p>
      )}
    </div>
  );
};

const Tienda = () => {
  const [notification, setNotification] = useState(false);

  const handleShowNotification = () => {
    setNotification(true);
    setTimeout(() => setNotification(false), 3000);
  };

  const promocionSettings = {
    dots: true,
    infinite: true,
    speed: 1000,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
    centerMode: true,
    centerPadding: '20%',
    arrows: true,
    swipe: true,
    swipeToSlide: true,
    touchThreshold: 10,
    responsive: [
      {
        breakpoint: 768,
        settings: {
          centerPadding: '0',
          slidesToShow: 1,
          slidesToScroll: 1,
          arrows: true,
          dots: true
        }
      }
    ]
  };

  const ofertaSettings = {
    dots: true,
    infinite: true,
    speed: 600,
    slidesToShow: 4,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 4000,
    arrows: true,
    swipe: true,
    swipeToSlide: true,
    touchThreshold: 10,
    responsive: [
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
          arrows: true,
          dots: true
        }
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
          arrows: true,
          dots: true
        }
      }
    ]
  };

  return (
    <div>
      <Banner
        categoria="Promoción"
        title="Promociones del día"
        sliderSettings={promocionSettings}
        noDataMessage="No hay productos en promoción disponibles."
        showNotification={handleShowNotification}
      />
      <div className="texto-post-banner">
        <h3>Los mejores precios en Videojuegos...</h3>
      </div>
      <Banner
        categoria="Oferta"
        title="OFERTAS"
        sliderSettings={ofertaSettings}
        noDataMessage="No hay productos en oferta disponibles."
        showNotification={handleShowNotification}
      />
      {notification && (
        <div className="notification-message">
          Producto agregado al carrito exitosamente
        </div>
      )}
    </div>
  );
};

export default Tienda;