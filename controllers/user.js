//Importation des packages
const bcrypt = require('bcrypt'); //Permet de crypter des informations
const jwt = require('jsonwebtoken'); //Permet de créer des token aléatoire et introuvable (pour sécuriser la connexion au compte)

//Importation du modéle de création utilisateur
const User = require('../models/User');

//Exportation de 'signup'
exports.signup = (req, res, next) => {
    bcrypt.hash(req.body.password, 10) //Hashage du password avec bcrypt (hash 10 fois (+ la hashage est élevé, + le script met du temps à se terminer))
    .then(hash => { //Création de l'utilisateur
        const user = new User({
            email: req.body.email, //Récupèration du corps de la requête email
            password: hash //Hash le password au moment de la création
        });
        user.save() //Sauvegarde de l'utilisateur vers la BDD
        .then(() => res.status(201).json({ message: 'Utilisateur créé avec succès' })) //Renvoi un message si succès
        .catch(error => res.status(400).json({ error })); //Renvoi une erreur si fail
    })
    .catch(error => res.status(500).json({ error })); //Renvoi une erreur si fail
};

//Exportation de 'login'
exports.login = (req, res, next) => {
    User.findOne({ email: req.body.email }) //Cherche l'adresse mail rentrée par l'utilisateur dans la BDD
    .then(user => {
        if (!user) { //Si aucune adresse mail trouvé, renvoi une erreur
            return res.status(401).json({ error }); //Retourne l'erreur en question
        }
        bcrypt.compare(req.body.password, user.password) //Compare les hashages utilisés
        .then(valid => {
            if(!valid) { //Si le password est faux, renvoi une erreur
                return res.status(401).json({ error }); //Retourne l'erreur en question
            }
            res.status(200).json({ //Si le password est correct, renvoi 'user id, un token random, et une date d'expiration du token'
                userId: user._id, //Renvoi userId
                token: jwt.sign( //Renvoi un token
                    { userId: user._id }, //Renvoi l'userId , un token random et une date d'expiration
                    'RANDOM_TOKEN_SECRET',
                    { expiresIn: '24h' } //Le token expire après 24h
                )
            });
        })  
        .catch(error => res.status(500).json({ error })); //Renvoi une erreur si fail
    })
    .catch(error => res.status(500).json({ error })); //Renvoi une erreur si fail
};