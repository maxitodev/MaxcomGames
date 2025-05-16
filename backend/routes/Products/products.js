const express = require('express');
const router = express.Router();
const Product = require('../../models/Products');

// Generar un ID aleatorio único de 6 cifras
const generateRandomID = async () => {
  const min = 100000;
  const max = 999999;
  let randomID;

  while (true) {
    randomID = Math.floor(Math.random() * (max - min + 1)) + min;
    const existingProduct = await Product.findOne({ ID_Producto: randomID });
    if (!existingProduct) break; // Salir si el ID es único
  }

  return randomID;
};

// Ruta para agregar productos
router.post('/add', async (req, res) => {
  const { Nombre_Producto, Descripción, Precio, Categoría, Imagen_URL, Stock } = req.body;

  if (!Nombre_Producto || !Descripción || !Precio || !Categoría) {
    return res.status(400).json({ message: 'Todos los campos requeridos deben estar presentes' });
  }

  try {
    const ID_Producto = await generateRandomID();

    const newProduct = new Product({
      ID_Producto,
      Nombre_Producto,
      Descripción,
      Precio,
      Categoría,
      Imagen_URL: Imagen_URL || '',
      Stock: Stock || 0,
    });

    const savedProduct = await newProduct.save();

    res.status(201).json({
      message: 'Producto creado con éxito',
      product: savedProduct,
    });
  } catch (error) {
    console.error('Error al crear el producto:', error);
    res.status(500).json({ message: 'Error inesperado al crear el producto', error });
  }
});

// Ruta para obtener productos por categoría
router.get('/', async (req, res) => {
  const { categoria } = req.query;
  try {
    const query = categoria ? { Categoría: new RegExp(`^${categoria}$`, 'i') } : {};
    const products = await Product.find(query);

    res.status(200).json({
      total: products.length,
      products: products || [], // Asegura que siempre retorne un array
    });
  } catch (error) {
    console.error('Error al obtener productos:', error);
    res.status(500).json({ message: 'Error al obtener productos', error });
  }
});

module.exports = router;

// Ruta para eliminar todos los productos
router.delete('/deleteAll', async (req, res) => {
  try {
    const result = await Product.deleteMany({}); // Elimina todos los documentos de la colección

    res.status(200).json({
      message: 'Todos los productos han sido eliminados',
      deletedCount: result.deletedCount,
    });
  } catch (error) {
    console.error('Error al eliminar todos los productos:', error);
    res.status(500).json({ message: 'Error inesperado al eliminar los productos', error });
  }
});

// Ruta para agregar múltiples productos
router.post('/addMany', async (req, res) => {
  const products = req.body;

  if (!Array.isArray(products) || products.length === 0) {
    return res.status(400).json({ message: 'Se debe enviar un array de productos' });
  }

  try {
    // Generar un ID único para cada producto
    const productsWithIDs = await Promise.all(
      products.map(async (product) => {
        const ID_Producto = await generateRandomID();
        return { ...product, ID_Producto }; // Añade ID_Producto al producto
      })
    );

    // Insertar productos con IDs generados
    const newProducts = await Product.insertMany(productsWithIDs);

    res.status(201).json({
      message: 'Productos agregados con éxito',
      products: newProducts,
    });
  } catch (error) {
    console.error('Error al agregar múltiples productos:', error);
    res.status(500).json({ message: 'Error inesperado al agregar productos', error });
  }
});

// Ruta para eliminar todas las promociones
router.delete('/deletePromotions', async (req, res) => {
  try {
    // Eliminar todos los productos con categoría "Promoción"
    const result = await Product.deleteMany({ Categoría: "Promoción" });

    res.status(200).json({
      message: 'Promociones eliminadas con éxito',
      deletedCount: result.deletedCount, // Número de documentos eliminados
    });
  } catch (error) {
    console.error('Error al eliminar las promociones:', error);
    res.status(500).json({ message: 'Error inesperado al eliminar las promociones', error });
  }
});

// Ruta para buscar productos por nombre (búsqueda parcial, insensible a mayúsculas/minúsculas)
router.get('/search', async (req, res) => {
  const { query } = req.query;
  if (!query) {
    return res.status(400).json({ message: 'El query de búsqueda es requerido' });
  }
  try {
    // Se utiliza una expresión regular para buscar coincidencias parciales en Nombre_Producto
    const products = await Product.find({ Nombre_Producto: new RegExp(query, 'i') });
    res.status(200).json({
      total: products.length,
      products: products
    });
  } catch (error) {
    console.error('Error al buscar productos:', error);
    res.status(500).json({ message: 'Error al buscar productos', error });
  }
});

// (Otras rutas de productos, por ejemplo agregar, eliminar, etc.)

// Esta ruta DEBE definirse al final para que no interfiera con otras rutas fijas
router.get('/:id', async (req, res) => {
  try {
    // Convertimos a número para evitar problemas, si es que el ID es numérico en la base de datos
    const productId = Number(req.params.id);
    if (isNaN(productId)) {
      return res.status(400).json({ message: 'El ID del producto debe ser numérico' });
    }
    const product = await Product.findOne({ ID_Producto: productId });
    if (!product) return res.status(404).json({ message: 'Producto no encontrado' });
    res.status(200).json(product);
  } catch (error) {
    console.error('Error al obtener el producto:', error);
    res.status(500).json({ message: 'Error al obtener el producto', error });
  }
});