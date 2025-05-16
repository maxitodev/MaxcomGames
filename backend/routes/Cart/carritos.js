const express = require('express');
const Carrito = require('../../models/Carrito');
const DetalleCarrito = require('../../models/DetalleCarrito');
const Producto = require('../../models/Products'); // Modelo de producto
const verifyToken = require('../../middlewares/verifyToken'); // Middleware para verificar token
const router = express.Router();

router.get('/mi-carrito', verifyToken, async (req, res) => {
  try {
    const carrito = await Carrito.findOne({ ID_Usuario: req.user.id });
    // Si no hay carrito, devolver un carrito vacío en lugar de un error 404
    if (!carrito) {
      return res.status(200).json({ carrito: null, productos: [] });
    }

    const detallesCarrito = await DetalleCarrito.find({ ID_Carrito: carrito.ID_Carrito });
    const productos = await Promise.all(
      detallesCarrito.map(async (detalle) => {
        const producto = await Producto.findOne({ ID_Producto: detalle.ID_Producto });
        if (!producto) {
          console.warn(`Producto con ID ${detalle.ID_Producto} no encontrado`);
          return null;
        }
        return {
          id: producto.ID_Producto,
          name: producto.Nombre_Producto,
          price: producto.Precio,
          image: producto.Imagen_URL,
          quantity: detalle.Cantidad,
        };
      })
    );

    const productosValidos = productos.filter((prod) => prod !== null);

    res.status(200).json({
      carrito: {
        ID_Carrito: carrito.ID_Carrito,
        ID_Usuario: carrito.ID_Usuario,
        Estado: carrito.Estado,
      },
      productos: productosValidos,
    });
  } catch (error) {
    console.error('Error al obtener el carrito:', error.message);
    res.status(500).json({ error: 'Error al obtener el carrito' });
  }
});

// **2. Añadir un producto al carrito**
router.post('/add-to-cart', verifyToken, async (req, res) => {
  const { productId, quantity } = req.body;

  // Validar que productId y quantity estén presentes
  if (!productId || !quantity || quantity <= 0) {
    return res.status(400).json({ error: 'Datos inválidos' });
  }

  try {
    // Buscar o crear el carrito del usuario
    let carrito = await Carrito.findOne({ ID_Usuario: req.user.id });
    if (!carrito) {
      carrito = new Carrito({
        ID_Carrito: Math.floor(100000 + Math.random() * 900000),
        ID_Usuario: req.user.id,
        Estado: 'Creado',
      });
      await carrito.save();
    }

    // Verificar si el producto ya está en el carrito
    let detalle = await DetalleCarrito.findOne({
      ID_Carrito: carrito.ID_Carrito,
      ID_Producto: productId,
    });

    if (detalle) {
      // Si el producto ya está en el carrito, actualizar la cantidad
      detalle.Cantidad += quantity;
    } else {
      // Si no está en el carrito, crear un nuevo detalle
      detalle = new DetalleCarrito({
        ID_Carrito: carrito.ID_Carrito,
        ID_Producto: productId,
        Cantidad: quantity,
        Estado: 'Creado',
      });
    }

    await detalle.save();
    res.status(200).json({ message: 'Producto añadido al carrito correctamente' });
  } catch (error) {
    console.error('Error al añadir el producto al carrito:', error.message);
    res.status(500).json({ error: 'Error al añadir el producto al carrito' });
  }
});

// **3. Actualizar el carrito con nuevos productos**
router.post('/actualizar', verifyToken, async (req, res) => {
  const { productos } = req.body; // Array de productos con ID y cantidad

  try {
    // Buscar el carrito del usuario
    const carrito = await Carrito.findOne({ ID_Usuario: req.user.id });
    if (!carrito) {
      return res.status(404).json({ message: 'Carrito no encontrado' });
    }

    // Limpiar los detalles anteriores del carrito
    await DetalleCarrito.deleteMany({ ID_Carrito: carrito.ID_Carrito });

    // Insertar nuevos detalles del carrito
    const detalles = productos.map((prod) => ({
      ID_Carrito: carrito.ID_Carrito,
      ID_Producto: prod.id,
      Cantidad: prod.quantity,
      Estado: 'Creado',
    }));

    await DetalleCarrito.insertMany(detalles);
    res.status(200).json({ message: 'Carrito actualizado correctamente' });
  } catch (error) {
    console.error('Error al actualizar el carrito:', error.message);
    res.status(500).json({ error: 'Error al actualizar el carrito' });
  }
});

// **4. Eliminar completamente un producto del carrito**
router.delete('/remove-all-from-cart/:productId', verifyToken, async (req, res) => {
  const { productId } = req.params;
  const productIdAsNumber = Number(productId);
  const userId = req.user.id;

  try {
    // Buscar el carrito del usuario
    const carrito = await Carrito.findOne({ ID_Usuario: userId });
    if (!carrito) {
      return res.status(404).json({ error: 'Carrito no encontrado' });
    }

    // Eliminar el detalle del producto del carrito
    const result = await DetalleCarrito.deleteOne({
      ID_Carrito: carrito.ID_Carrito,
      ID_Producto: productIdAsNumber,
    });

    if (result.deletedCount === 0) {
      return res.status(404).json({ error: 'Producto no encontrado en el carrito' });
    }

    // Devolver una respuesta exitosa
    res.status(200).json({
      message: 'Producto eliminado completamente del carrito',
      productId: productIdAsNumber,
    });
  } catch (error) {
    console.error('Error al eliminar producto:', error.message);
    res.status(500).json({ error: 'Error al eliminar el producto del carrito' });
  }
});

// **5. Reducir la cantidad de un producto en el carrito**
router.delete('/remove-from-cart/:productId', verifyToken, async (req, res) => {
  const { productId } = req.params;
  const productIdAsNumber = Number(productId);
  const userId = req.user.id;

  try {
    // Buscar el carrito del usuario
    const carrito = await Carrito.findOne({ ID_Usuario: userId });
    if (!carrito) {
      return res.status(404).json({ error: 'Carrito no encontrado' });
    }

    // Buscar el detalle del producto en el carrito
    const detalle = await DetalleCarrito.findOne({
      ID_Carrito: carrito.ID_Carrito,
      ID_Producto: productIdAsNumber,
    });

    if (!detalle) {
      return res.status(404).json({ error: 'Producto no encontrado en el carrito' });
    }

    // Reducir la cantidad en 1
    detalle.Cantidad -= 1;

    if (detalle.Cantidad <= 0) {
      // Eliminar el detalle si la cantidad es 0 o menor
      await DetalleCarrito.deleteOne({ _id: detalle._id });
    } else {
      // Guardar el detalle actualizado
      await detalle.save();
    }

    // Devolver una respuesta exitosa
    res.status(200).json({
      message: 'Unidad eliminada correctamente',
      productId: productIdAsNumber,
    });
  } catch (error) {
    console.error('Error al eliminar unidad:', error.message);
    res.status(500).json({ error: 'Error al actualizar la cantidad' });
  }
});

module.exports = router;