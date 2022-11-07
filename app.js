const express = require('express');
const mongoose = require('mongoose');

const app = express();
const userRoutes = require('./routes/user');


mongoose.connect('mongodb+srv://cryptoto47:tomtom47@projet6.2da4rfu.mongodb.net/?retryWrites=true&w=majority',
  { useNewUrlParser: true,
    useUnifiedTopology: true })
  .then(() => console.log('Connexion à MongoDB réussie !'))
  .catch(() => console.log('Connexion à MongoDB échouée !'));

app.use((req, res) =>{
    res.json('requete bien recu');
});
app.use('/api/auth', userRoutes);
module.exports = app;