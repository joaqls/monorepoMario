require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/uploads', express.static('uploads'));

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('✅ MongoDB conectado'))
  .catch(err => console.log('❌ Error Mongo:', err));

const personajesRoutes = require('./routes/personajes');
app.use('/api/personajes', personajesRoutes);

app.get('/', (req, res) => {
  res.send('API funcionando 🚀');
});

app.listen(4000, () => console.log('Servidor en http://localhost:4000'));
