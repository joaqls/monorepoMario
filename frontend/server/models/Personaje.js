const mongoose = require('mongoose');

const ItemSchema = new mongoose.Schema({
  nombre: String,
  categoria: String,
  nivel: String
}, { timestamps: true });

module.exports = mongoose.model('Personaje', ItemSchema);
