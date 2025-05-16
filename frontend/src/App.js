import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import axios from 'axios';
import Navbar from './components/Menú/Navbar/Navbar';
import SidebarMenu from './components/Menú/SidebarMenu/SidebarMenu';
import Home from './components/Tienda/Tienda';
import Catalogo from './components/Tienda/Catalogo/Catalogo';
import Ofertas from './components/Tienda/Ofertas/Ofertas';
import Membresias from './components/Tienda/Membresias/Membresia';
import Login from './components/Auth/Iniciar Sesión/Login';
import Register from './components/Auth/Crear Cuenta/Register';
import Terms from './components/Auth/Crear Cuenta/Terminos de Uso/Terms';
import ProtectedRoute from './components/Routes/ProtectedRoute';
import ProductoDetalle from './components/Tienda/ProductoSeleccionado/ProductoDetalle';
import ProcesoPago from './components/Pagos/ProcesoPago/ProcesodePago';
import Confirmacion from './components/Pagos/Confirmacion/Confirmación';
import MisPedidos from './components/MisPedidos/MisPedidos';
import FAQ from './components/Soporte/PreguntasF/PreguntasF';
import Ayuda from './components/Soporte/Ayuda/Ayuda';
import ScrollToTop from './ScrollToTop';
import SearchResults from './components/Menú/SearchResults/SearchResults';
import ForgotPassword from './components/Auth/RepContraseña/ForgotPassword';
import ResetPassword from './components/Auth/RepContraseña/ResetPassword';
import Footer from './components/Footer/Footer';
import About from './components/About/About';
import PagoInvalido from './components/Pagos/PagoInvalido/PagoInvalido';
import PagoPendiente from './components/Pagos/PagoPendiente/PagoPendiente';
import Sandbox from './components/Pagos/ProcesoPago/Sandbox/Sandbox';
import ReportarProblema from './components/Soporte/ReportarProblema/ReportarProblema';

const App = () => {
  const [isCartOpen, setIsCartOpen] = useState(false);
  const toggleCart = () => setIsCartOpen(prev => !prev);

  useEffect(() => {
    axios.interceptors.response.use(
      response => response,
      error => {
        if (error.response?.status === 401) {
          localStorage.removeItem('token');
          window.location.href = '/login';
        }
        return Promise.reject(error);
      }
    );
  }, []);

  return (
    <Router>
      <ScrollToTop />
      <div className="app-container full-height"> {/* Agregamos la clase 'full-height' */}
        <SidebarMenu />
        <Navbar isCartOpen={isCartOpen} toggleCart={toggleCart} />
        <div className="app-content">
          <Routes>
            {/* Rutas públicas */}
            <Route path="/" element={<Home />} />
            <Route path="/comprar/:id" element={<ProductoDetalle toggleCart={toggleCart} />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/terms" element={<Terms />} />
            <Route path="/faq" element={<FAQ />} />
            <Route path="/ayuda" element={<Ayuda />} />
            <Route path="/ofertas" element={<Ofertas toggleCart={toggleCart} />} />
            <Route path="/busqueda" element={<SearchResults />} />
            <Route path="/membresias" element={<Membresias toggleCart={toggleCart} />} />
            <Route path="/catalogo" element={<Catalogo toggleCart={toggleCart} />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/reset-password/:token" element={<ResetPassword />} />
            <Route path="/about" element={<About />} />
            <Route path="/pago-invalido" element={<PagoInvalido />} />
            <Route path="/pago-pendiente" element={<PagoPendiente />} />
            <Route path="/sandbox" element={<Sandbox />} />
            {/* Rutas protegidas */}
            <Route 
              path="/products" 
              element={
                <ProtectedRoute>
                  <div>Componente de productos protegido</div>
                </ProtectedRoute>
              }
            />
            <Route 
              path="/procesopago" 
              element={
                <ProtectedRoute>
                  <ProcesoPago />
                </ProtectedRoute>
              }
            />
            <Route 
              path="/confirmacion" 
              element={
                <ProtectedRoute>
                  <Confirmacion /> 
                </ProtectedRoute>
              }
            />
            <Route 
              path="/mis-pedidos" 
              element={
                <ProtectedRoute>
                  <MisPedidos />
                </ProtectedRoute>
              }
            />
            <Route 
              path="/reportar-problema" 
              element={
                <ProtectedRoute>
                  <ReportarProblema />
                </ProtectedRoute>
              } 
            />
            {/* Ruta para páginas no encontradas */}
            <Route path="*" element={<div>Página no encontrada</div>} />
          </Routes>
        </div>
        <Footer />
      </div>
    </Router>
  );
};

export default App;