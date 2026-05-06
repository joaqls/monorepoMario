const express = require('express');
const router = express.Router();
const Personaje = require('../models/Personaje');
const multer = require('multer');
const path = require('path');

// Configuración de subida
const storage = multer.diskStorage({
  destination: './uploads',
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});
const upload = multer({ storage });

// GET todos
router.get('/', async (req, res) => {
  const personajes = await Personaje.find();
  res.json(personajes);
});

// POST con imagen
router.post('/', upload.single('imagen'), async (req, res) => {
  const nuevo = new Personaje({
    nombre: req.body.nombre,
    categoria: req.body.categoria,
    nivel: req.body.nivel,
    imagen: req.file ? req.file.filename : ''
  });

  await nuevo.save();
  res.json(nuevo);
});

// DELETE por id
router.delete('/:id', async (req, res) => {
  try {
    const eliminado = await Personaje.findByIdAndDelete(req.params.id);

    if (!eliminado) {
      return res.status(404).json({ mensaje: 'No encontrado' });
    }

    res.json({ mensaje: 'Personaje eliminado' });
  } catch (error) {
    res.status(500).json({ error: 'Error al eliminar' });
  }
});

module.exports = router; 
