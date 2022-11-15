//Importation des packages
const express = require('express');
const router = express.Router();

//Importation du controllers 'user.js'
const userCtrl = require('../controllers/user');

//Importation du middleware password qui permet de vérifier si le password est valide, sinon renvoi un message d'erreur
const verifyPassword = require('../middleware/password');

//Création des routes
router.post('/signup', verifyPassword, userCtrl.signup); //Route pour créer un compte, vérifie le password
router.post('/login', userCtrl.login); //Route pour se connecter au compte

//Exportation des routes
module.exports = router;