//Importation des packages
const mongoose = require('mongoose'); 

//Schema de création de sauce
const sauceSchema = mongoose.Schema({
    userId: { type: String, required: true }, //UserID en string
    name: { type: String, required: true }, //nom de la sauce en string 
    manufacturer: { type: String, required: true }, //nom du créateur en string
    description: { type: String, required: true }, //description de la sauce en string
    mainPepper: { type: String, required: true }, //aliment principale de la recette en string
    imageUrl: { type: String, required: true }, //image de la sauce en string
    heat: { type: Number, required: true }, //chauffe en number
    likes: { type: Number, required: true }, //likes en number
    dislikes: { type: Number, required: true }, //dislikes en number
    usersLiked: { type: Array, required: true }, //user qui ont like dans un tableau de string
    usersDisliked: { type: Array, required: true } //user qui ont dislike dans un tableau de string
});

//Exportation du module 'sauceSchema'
module.exports = mongoose.model('Sauce', sauceSchema);