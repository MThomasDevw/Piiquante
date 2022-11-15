//Importation des packages
const express = require('express'); //Créer des applications web avec node
const mongoose = require('mongoose'); //Connexion à la BDD mongodb
const bodyParser = require('body-parser'); //Analyse les corps des requêtes et ajoute la propriété "req.body"
const path = require('path'); //Travaille avec les chemins des fichiers

//Importation packages de sécurité
const helmet = require('helmet'); //Sécurisé les en-tête http de notre app

//Importation des routes
const saucesRoutes = require('./routes/sauces'); //Routes des sauces
const userRoutes = require('./routes/user'); //Routes des utilisateurs

require('dotenv').config(); //Importation du packages dotenv qui permet de protéger les informations de connexion vers la BDD

mongoose.connect('mongodb+srv://cryptoto47:tomtom47@projet6.2da4rfu.mongodb.net/?retryWrites=true&w=majority',
  { useNewUrlParser: true,
    useUnifiedTopology: true })
  .then(() => console.log('Connexion à MongoDB réussie !'))
  .catch(() => console.log('Connexion à MongoDB échouée !'));
  
const app = express();

app.use(helmet({crossOriginResourcePolicy: false})); //Sécurise les en-tête http de notre app

//Ajout des privilèges
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
  next();
});


app.use(bodyParser.json());//Parse le body en objet json utilisable


//Ajout des routes
app.use('/images', express.static(path.join(__dirname, 'images'))); //Route images et enregistre l'image dans le dossier "images"
app.use('/api/auth', userRoutes); //Route vers l'authentification login et signup
app.use('/api/sauces', saucesRoutes); //Route vers les sauces

//Exportation de app
module.exports = app;