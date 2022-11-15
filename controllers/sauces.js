//Importation des packages
const fs = require('fs'); //Signifie 'file-system' ajoute des fonctions pour modifier le système de fichier et la suppression de fichier
 
const Sauce = require('../models/Sauce'); //Importation du modéle de sauce

//Exportations des controllers
exports.createSauce = (req, res, next) => { //Permet de faire la logique de création de sauce
    const sauceObject = JSON.parse(req.body.sauce); //Parse le corps de la requête sauce en objet js utilisable
    delete sauceObject._id; //Suppression du champ 'id' du corps de sauceObject
    const sauce = new Sauce({ //Création de la sauce grace a 'new'
        ...sauceObject, //Opération spread qui récupére toutes les infos du body
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`, //Récupère dynamiquement l'url de l'image
        //${req.protocol} = http ou https, ${req.get('host')} = host du serveur (ex: localhost), /images/ = dossier images, ${req.file.filename} = nom de l'image
        likes: 0, //Set les likes à 0
        dislikes: 0 //Set les dilikes à 0
    });
    sauce.save() //Sauvegarde de la sauce dans la BDD
    .then(() => res.status(201).json({ message: 'Sauce créée!'})) //Renvoi un message si la sauce est valide
    .catch(error => res.status(400).json({ error })); //Renvoi une erreur si la sauce est invalide
};

exports.modifySauce = (req, res, next) => {
    if (req.file) {
        // si l'image est modifiée, il faut supprimer l'ancienne image dans le dossier /image
        Sauce.findOne({ _id: req.params.id }) //Récupère la sauce choisie
            .then(sauce => { //Si on récupère l'id de la sauce
                const filename = sauce.imageUrl.split('/images/')[1]; //Supprime l'image 1 à partir de l'image choisie (donc suppr l'image en question)
                fs.unlink(`images/${filename}`, () => { //Unlink l'image de la sauce
                    // une fois que l'ancienne image est supprimée dans le dossier /image, on peut mettre à jour le reste
                    const sauceObject = {
                        ...JSON.parse(req.body.sauce),
                        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
                    }
                    Sauce.updateOne({ _id: req.params.id }, { ...sauceObject, _id: req.params.id }) //Update l'image
                        .then(() => res.status(200).json({ message: 'Sauce modifiée!' })) //Si l'opération fonctionne renvoi un message 
                        .catch(error => res.status(400).json({ error })); //Si l'opération échoue renvoi une erreur
                })
            })
            .catch(error => res.status(500).json({ error }));
    } else {
        // si l'image n'est pas modifiée
        const sauceObject = { ...req.body };
        Sauce.updateOne({ _id: req.params.id }, { ...sauceObject, _id: req.params.id })
            .then(() => res.status(200).json({ message: 'Sauce modifiée!' }))
            .catch(error => res.status(400).json({ error }));
    }
};

exports.deleteSauce = (req, res, next) => {
    Sauce.findOne({ __id: req.params.id })
    .then(sauce => {
        const filename = sauce.imageUrl.split('/images/')[1];
        fs.unlink(`images/${filename}`, () => {
            Sauce.deleteOne({ _id: req.params.id })
            .then(() => res.status(200).json({ message:'Sauce supprimée!' }))
            .catch(error => res.status(400).json({ error }));
        });
    })
    .catch(error => res.status(500).json({ error }));
};

exports.getAllSauces = (req, res, next) => { //Récupère toutes les sauces
    Sauce.find()
    .then(sauces => res.status(200).json( sauces ))
    .catch(error => res.status(400).json({ error }));
};

exports.getOneSauce = (req, res, next) => { //Récupère la sauce en choisie
    Sauce.findOne({ _id: req.params.id })
    .then(sauce => res.status(200).json( sauce ))
    .catch(error => res.status(404).json({ error }));
};

exports.likeSauce = (req, res, next) => { //Ajoute un like ou un dislikes et les supprime en recliquant
    const userId = req.body.userId; //Récupère l'id de l'user qui clique
    const like = req.body.like;  //Récupère le like
    const sauceId = req.params.id; //Récupère l'id de la sauce
    Sauce.findOne({ _id: sauceId })
        .then(sauce => {
            //Nouvelles valeurs à modifier
            const newValues = {
                usersLiked: sauce.usersLiked,
                usersDisliked: sauce.usersDisliked,
                likes: 0,
                dislikes: 0
            }
            // Différents cas:
            switch (like) {
                case 1:  // CAS: sauce liked
                    newValues.usersLiked.push(userId);
                    break;
                case -1:  // CAS: sauce disliked
                    newValues.usersDisliked.push(userId);
                    break;
                case 0:  // CAS: Annulation du like/dislike
                    if (newValues.usersLiked.includes(userId)) {
                        // si on annule le like
                        const index = newValues.usersLiked.indexOf(userId);
                        newValues.usersLiked.splice(index, 1);
                    } else {
                        // si on annule le dislike
                        const index = newValues.usersDisliked.indexOf(userId);
                        newValues.usersDisliked.splice(index, 1);
                    }
                    break;
            };
            // Calcul du nombre de likes / dislikes
            newValues.likes = newValues.usersLiked.length;
            newValues.dislikes = newValues.usersDisliked.length;
            // Modification de la sauce avec les nouvelles valeurs
            Sauce.updateOne({ _id: sauceId }, newValues )
                .then(() => res.status(200).json({ message: 'Sauce notée!' }))
                .catch(error => res.status(400).json({ error }))  
        })
        .catch(error => res.status(500).json({ error }));
}