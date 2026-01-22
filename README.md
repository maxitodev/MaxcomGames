# 🎮 MaxcomGames - E-Commerce

<div align="center">

![MaxcomGames](https://img.shields.io/badge/MaxcomGames-E--Commerce-blue?style=for-the-badge&logo=gamepad&logoColor=white)
![React](https://img.shields.io/badge/React-19.0.0-61DAFB?style=for-the-badge&logo=react&logoColor=white)
![Node.js](https://img.shields.io/badge/Node.js-Express-339933?style=for-the-badge&logo=node.js&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-Database-47A248?style=for-the-badge&logo=mongodb&logoColor=white)

**Plataforma E-Commerce integral para el mercado de videojuegos, consolas y productos gaming**

</div>

---

## 📋 Descripción

**MaxcomGames** es una plataforma E-Commerce diseñada específicamente para el mercado de videojuegos, consolas y productos relacionados. El sistema está pensado para brindar una experiencia de compra moderna, cómoda y segura tanto a los usuarios finales como a los administradores del negocio.

Este proyecto moderniza el proceso de compra para el usuario gamer y optimiza el manejo interno para el propietario o staff de MaxcomGames, proporcionando herramientas completas de gestión y una experiencia de usuario excepcional.

---

## ✨ Características Principales

### 🛒 Para Usuarios
- **Catálogo de Productos** - Navegación intuitiva por videojuegos, consolas y accesorios
- **Sistema de Búsqueda** - Búsqueda avanzada de productos
- **Carrito de Compras** - Gestión completa del carrito con sidebar interactivo
- **Ofertas y Promociones** - Sección dedicada a ofertas especiales
- **Membresías** - Sistema de membresías con beneficios exclusivos
- **Historial de Pedidos** - Seguimiento completo de compras realizadas
- **Soporte al Cliente** - FAQ, ayuda y sistema de reportes

### 💳 Métodos de Pago
- **PayPal** - Pagos seguros internacionales
- **MercadoPago** - Integración completa para LATAM
- **Stripe** - Procesamiento de tarjetas de crédito/débito

### 🔐 Seguridad
- **Autenticación JWT** - Tokens seguros para sesiones
- **Google OAuth** - Inicio de sesión con Google
- **Recuperación de Contraseña** - Sistema de reset vía email
- **Rutas Protegidas** - Acceso controlado a secciones privadas

### 📧 Comunicaciones
- **Notificaciones por Email** - Confirmaciones de compra y actualizaciones
- **Integración Gmail** - Sistema de correos automatizado con Nodemailer

---

## 🛠️ Stack Tecnológico

### Frontend
| Tecnología | Versión | Descripción |
|------------|---------|-------------|
| React | 19.0.0 | Biblioteca principal de UI |
| React Router DOM | 7.4.0 | Navegación SPA |
| Axios | 1.8.4 | Cliente HTTP |
| React Icons | 5.5.0 | Iconografía |
| React Slick | 0.30.3 | Carruseles y sliders |
| JWT Decode | 4.0.0 | Decodificación de tokens |

### Backend
| Tecnología | Versión | Descripción |
|------------|---------|-------------|
| Node.js | - | Runtime de JavaScript |
| Express | 4.21.2 | Framework web |
| MongoDB | - | Base de datos NoSQL |
| Mongoose | 8.12.2 | ODM para MongoDB |
| JWT | 9.0.2 | Autenticación |
| bcrypt | 5.1.1 | Encriptación de contraseñas |
| Nodemailer | 6.10.0 | Envío de emails |

### Integraciones de Pago
| Servicio | Versión |
|----------|---------|
| PayPal SDK | 1.0.3 |
| MercadoPago | 2.3.0 |
| Stripe | 17.7.0 |

---

## 📁 Estructura del Proyecto

```
MaxcomGames/
├── 📂 backend/
│   ├── 📂 config/           # Configuraciones de servicios
│   │   ├── Gmail/           # Configuración de email
│   │   ├── MercadoPago/     # Configuración MercadoPago
│   │   └── Paypal/          # Configuración PayPal
│   ├── 📂 middlewares/      # Middlewares (auth, validación)
│   ├── 📂 models/           # Modelos de MongoDB
│   │   ├── Carrito.js
│   │   ├── Descuentos.js
│   │   ├── DetalleCarrito.js
│   │   ├── Pedido.js
│   │   ├── Products.js
│   │   └── User.js
│   ├── 📂 routes/           # Rutas de la API
│   │   ├── Auth/            # Autenticación
│   │   ├── Cart/            # Carrito de compras
│   │   ├── Disscount/       # Descuentos
│   │   ├── Orders/          # Pedidos
│   │   ├── Pay/             # Pagos
│   │   ├── Products/        # Productos
│   │   ├── Support/         # Soporte
│   │   └── User/            # Usuarios
│   ├── 📂 public/uploads/   # Archivos estáticos
│   ├── index.js             # Punto de entrada
│   └── package.json
│
├── 📂 frontend/
│   ├── 📂 public/           # Assets públicos
│   ├── 📂 src/
│   │   ├── 📂 assets/       # Imágenes e iconos
│   │   ├── 📂 components/   # Componentes React
│   │   │   ├── About/
│   │   │   ├── Auth/        # Login, Register, Reset
│   │   │   ├── Footer/
│   │   │   ├── Menú/        # Navbar, Sidebar, Search
│   │   │   ├── MisPedidos/
│   │   │   ├── Pagos/       # Proceso de pago
│   │   │   ├── Routes/      # Rutas protegidas
│   │   │   ├── Soporte/     # FAQ, Ayuda, Reportes
│   │   │   └── Tienda/      # Catálogo, Ofertas, etc.
│   │   ├── 📂 utils/        # Utilidades (Axios instance)
│   │   ├── App.js
│   │   └── index.js
│   ├── 📂 build/            # Build de producción
│   └── package.json
│
└── README.md
```

---

## 🚀 Instalación y Configuración

### Prerrequisitos
- Node.js (v18 o superior)
- MongoDB (local o Atlas)
- npm o yarn

### 1. Clonar el Repositorio
```bash
git clone https://github.com/tu-usuario/maxcomgames.git
cd maxcomgames
```

### 2. Configurar el Backend

```bash
cd backend
npm install
```

Crear archivo `.env` en la carpeta `backend/`:
```env
# Servidor
PORT=5000

# Base de Datos
MONGO_URI=mongodb://localhost:27017/maxcomgames

# JWT
JWT_SECRET=tu_clave_secreta_jwt

# Frontend URL (para CORS)
FRONTEND_URL=http://localhost:3000

# PayPal
PAYPAL_CLIENT_ID=tu_paypal_client_id
PAYPAL_CLIENT_SECRET=tu_paypal_client_secret

# MercadoPago
MERCADOPAGO_ACCESS_TOKEN=tu_mercadopago_token

# Stripe
STRIPE_SECRET_KEY=tu_stripe_secret_key

# Gmail (Nodemailer)
GMAIL_USER=tu_email@gmail.com
GMAIL_PASS=tu_app_password

# Google OAuth
GOOGLE_CLIENT_ID=tu_google_client_id
```

### 3. Configurar el Frontend

```bash
cd frontend
npm install
```

Crear archivo `.env` en la carpeta `frontend/` (si es necesario):
```env
REACT_APP_API_URL=http://localhost:5000/api
REACT_APP_GOOGLE_CLIENT_ID=tu_google_client_id
```

### 4. Ejecutar en Desarrollo

**Backend:**
```bash
cd backend
npm run dev
```

**Frontend:**
```bash
cd frontend
npm start
```

La aplicación estará disponible en:
- Frontend: `http://localhost:3000`
- Backend API: `http://localhost:5000/api`

---

## 📡 API Endpoints

### Autenticación
| Método | Endpoint | Descripción |
|--------|----------|-------------|
| POST | `/api/auth/register` | Registro de usuario |
| POST | `/api/auth/login` | Inicio de sesión |
| POST | `/api/auth/google` | Login con Google |
| POST | `/api/auth/forgot-password` | Solicitar reset de contraseña |
| POST | `/api/auth/reset-password` | Resetear contraseña |

### Productos
| Método | Endpoint | Descripción |
|--------|----------|-------------|
| GET | `/api/products` | Obtener todos los productos |
| GET | `/api/products/:id` | Obtener producto por ID |
| POST | `/api/products` | Crear producto (admin) |
| PUT | `/api/products/:id` | Actualizar producto (admin) |
| DELETE | `/api/products/:id` | Eliminar producto (admin) |

### Carrito
| Método | Endpoint | Descripción |
|--------|----------|-------------|
| GET | `/api/carritos` | Obtener carrito del usuario |
| POST | `/api/carritos` | Agregar producto al carrito |
| PUT | `/api/carritos/:id` | Actualizar cantidad |
| DELETE | `/api/carritos/:id` | Eliminar del carrito |

### Pagos
| Método | Endpoint | Descripción |
|--------|----------|-------------|
| POST | `/api/payments/paypal` | Procesar pago PayPal |
| POST | `/api/payments/mercadopago` | Procesar pago MercadoPago |
| POST | `/api/payments/stripe` | Procesar pago Stripe |

### Pedidos
| Método | Endpoint | Descripción |
|--------|----------|-------------|
| GET | `/api/pedidos` | Obtener pedidos del usuario |
| GET | `/api/pedidos/:id` | Obtener detalle de pedido |
| POST | `/api/pedidos` | Crear nuevo pedido |

---

## 🖥️ Scripts Disponibles

### Backend
```bash
npm start      # Inicia el servidor en producción
npm run dev    # Inicia el servidor con nodemon (desarrollo)
```

### Frontend
```bash
npm start      # Inicia en modo desarrollo
npm run build  # Genera build de producción
npm test       # Ejecuta tests
```

---

## 🌐 Despliegue

El proyecto está configurado para desplegarse en **Vercel**:

- El archivo `vercel.json` en el backend configura el despliegue serverless
- El frontend puede desplegarse como aplicación estática

### Build de Producción
```bash
# Frontend
cd frontend
npm run build
```

---

## 🤝 Contribución

1. Fork el proyecto
2. Crea tu rama de feature (`git checkout -b feature/NuevaCaracteristica`)
3. Commit tus cambios (`git commit -m 'Agregar nueva característica'`)
4. Push a la rama (`git push origin feature/NuevaCaracteristica`)
5. Abre un Pull Request

---

## 📄 Licencia

Este proyecto está bajo la Licencia ISC.

---

## 👨‍💻 Autor

**MaxcomGames Team**

---

<div align="center">

⭐ **¡Si te gusta el proyecto, dale una estrella!** ⭐

</div>
