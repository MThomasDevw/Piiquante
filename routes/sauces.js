//Importation des packages
const express = require('express'); //Importation d'express
const router = express.Router(); //Importation de la fonction Router d'express pour créer des objets router à partir de la l. 9

const sauceCtrl = require('../controllers/sauces'); //Importation du controller sauces
const auth = require('../middleware/auth'); //Importation du middleware d'authentification
const multer = require('../middleware/multer-config'); //Importation de la configuration de multer (gère les images)

router.post('/', auth, multer, sauceCtrl.createSauce); //Route qui ajoute une sauce (auth= authentification obligatoire, multer = gère les images)
router.put('/:id', auth, multer, sauceCtrl.modifySauce); //Route qui modifie la sauce (auth = seul le user qui à créer la sauce peut la modif)
router.delete('/:id', auth, sauceCtrl.deleteSauce); //Route qui supprime la sauce (auth = seul le user qui à créer la sauce peut la suppr)
router.get('/', auth, sauceCtrl.getAllSauces); //Route qui récupèrer toutes les sauce dans la bdd (auth = seul les users connectés peuvent accèder aux sauces)
router.get('/:id', auth, sauceCtrl.getOneSauce); //Route qui récupère seulement l'id de la sauce demander (auth = seul les users connectés peuvent accèder aux sauces)
router.post('/:id/like', auth, sauceCtrl.likeSauce); //Route qui ajoute ou suppr un like à la sauce 

//Exportation des routes
module.exports = router;