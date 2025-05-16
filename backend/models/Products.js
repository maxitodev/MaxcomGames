const mongoose = require('mongoose');

// Generar un ID aleatorio único de 6 cifras
const generateRandomID = async () => {
  const min = 100000;
  const max = 999999;
  let randomID;

  while (true) {
    randomID = Math.floor(Math.random() * (max - min + 1)) + min;
    const existingProduct = await mongoose.models.Product.findOne({ ID_Producto: randomID });
    if (!existingProduct) break; // Salir si el ID es único
  }

  return randomID;
};

// Definición del esquema para el modelo de Producto
const productSchema = new mongoose.Schema({
  ID_Producto: {
    type: Number,
    unique: true,
    required: true,
  },
  Nombre_Producto: {
    type: String,
    required: true,
  },
  Descripción: {
    type: String,
    required: true,
  },
  Precio: {
    type: Number,
    required: true,
  },
  Categoría: {
    type: String,
    required: true,
  },
  Imagen_URL: {
    type: String,
    required: false,
  },
  Stock: {
    type: Number,
    default: 0,
  },
});

// Middleware para asignar automáticamente el ID
productSchema.pre('save', async function (next) {
  if (!this.ID_Producto) {
    try {
      this.ID_Producto = await generateRandomID(); // Generar ID único
      next();
    } catch (error) {
      next(error);
    }
  } else {
    next();
  }
});

const Product = mongoose.model('Product', productSchema);

module.exports = Product;
