//Importation des packages
const jwt = require('jsonwebtoken'); //Importation de 'jsonwebtoken' pour créer des token aléatoire et unique pour la connexion

//Exportation du module de token
module.exports = (req, res, next) => {
    try{
        const token = req.headers.authorization.split(' ')[1];//Fonction split qui récupére tout le header après l'espace 
        const decodedToken = jwt.verify(token, 'RANDOM_TOKEN_SECRET'); //Fontion 'verify' de 'jsonwebtoken' qui décode le token, si mauvais renvoi une erreur
        const userId = decodedToken.userId; //Extraction du userId grace au token
        if (req.body.userId && req.body.userId !== userId) { //Vérification du userId et du userId extrait du token, si pas les mêmes renvoi une erreur
            throw 'User ID non valable'; //Renvoi un message d'erreur
        } else {
            next(); //Si ci-dessus se passe correctement, passe au middleware suivant
        }
    } catch (error) { //Si rien ne se passe comme prévu renvoi une erreur ou un message
        console.log(error);
        res.status(401).json({ error: error | 'Requête non authentifiée!' });
    }
};