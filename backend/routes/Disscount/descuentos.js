const express = require('express');
const router = express.Router();
const Descuento = require('../../models/Descuentos');

// Crear un nuevo descuento (dar de alta)
router.post('/crear', async (req, res) => {
  try {
    const { ID_Usuario, Codigo_Descuento, Descripcion, Descuento: porcentaje, Fecha_Expiracion } = req.body;
    
    // Validar que todos los campos sean proporcionados
    if (!ID_Usuario || !Codigo_Descuento || !Descripcion || !porcentaje || !Fecha_Expiracion) {
      return res.status(400).json({ msg: 'Faltan datos requeridos' });
    }
    
    // Verificar que el código no exista ya
    const existing = await Descuento.findOne({ Codigo_Descuento });
    if (existing) {
      return res.status(400).json({ msg: 'El código de descuento ya existe' });
    }
    
    // Crear una nueva instancia del descuento
    const nuevoDescuento = new Descuento({
      ID_Usuario,
      Codigo_Descuento,
      Descripcion,
      Descuento: porcentaje,
      Fecha_Expiracion: new Date(Fecha_Expiracion)
    });
    
    // Guardar el nuevo descuento en la base de datos
    await nuevoDescuento.save();
    
    // Responder con éxito
    res.status(201).json({ msg: 'Descuento creado exitosamente', descuento: nuevoDescuento });
  } catch (error) {
    console.error('Error al crear descuento:', error);
    res.status(500).json({ msg: 'Error al crear descuento' });
  }
});

// Listar todos los descuentos
router.get('/', async (req, res) => {
  try {
    const descuentos = await Descuento.find();
    res.json(descuentos);
  } catch (error) {
    console.error('Error al obtener descuentos:', error);
    res.status(500).json({ msg: 'Error al obtener descuentos' });
  }
});

// Actualizar un descuento existente
router.put('/actualizar/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { ID_Usuario, Codigo_Descuento, Descripcion, Descuento: porcentaje, Fecha_Expiracion } = req.body;
    const descuentoActualizado = await Descuento.findByIdAndUpdate(
      id,
      {
        ID_Usuario,
        Codigo_Descuento,
        Descripcion,
        Descuento: porcentaje,
        Fecha_Expiracion: new Date(Fecha_Expiracion)
      },
      { new: true }
    );
    if (!descuentoActualizado) {
      return res.status(404).json({ msg: 'Descuento no encontrado' });
    }
    res.json({ msg: 'Descuento actualizado exitosamente', descuento: descuentoActualizado });
  } catch (error) {
    console.error('Error al actualizar descuento:', error);
    res.status(500).json({ msg: 'Error al actualizar descuento' });
  }
});

// Eliminar un descuento
router.delete('/eliminar/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const descuentoEliminado = await Descuento.findByIdAndDelete(id);
    if (!descuentoEliminado) {
      return res.status(404).json({ msg: 'Descuento no encontrado' });
    }
    res.json({ msg: 'Descuento eliminado exitosamente' });
  } catch (error) {
    console.error('Error al eliminar descuento:', error);
    res.status(500).json({ msg: 'Error al eliminar descuento' });
  }
});

// Ruta para aplicar descuento (ya existente)
router.post('/aplicar', async (req, res) => {
  try {
    const { codigo } = req.body;
    if (!codigo) {
      return res.status(400).json({ msg: 'El código es requerido' });
    }
    
    const descuento = await Descuento.findOne({ Codigo_Descuento: codigo });
    if (!descuento) {
      return res.status(404).json({ msg: 'Código de descuento no encontrado' });
    }
    
    if (descuento.Fecha_Expiracion < new Date()) {
      return res.status(400).json({ msg: 'El código de descuento ha expirado' });
    }
    
    return res.json({ descuento: descuento.Descuento });
  } catch (error) {
    console.error('Error al aplicar el descuento:', error);
    res.status(500).json({ msg: 'Error al aplicar el descuento' });
  }
});

module.exports = router;
