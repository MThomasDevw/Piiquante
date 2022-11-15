const multer = require('multer'); //Importation de multer qui permet de vérifier les images

const MIME_TYPES = { //Permet d'autoriser seulement les extensions d'images ci-dessous
  'image/jpg': 'jpg', //Autorise JPG, JPEG et PNG pour éviter les envoi de script
  'image/jpeg': 'jpg',
  'image/png': 'png'
};

const storage = multer.diskStorage({ //Enregistre l'images dans le dossier 'images' du server
  destination: (req, file, callback) => {
    callback(null, 'images');
  },
  filename: (req, file, callback) => { 
    let name = file.originalname.split(' ').join('_'); //Remplace les espaces par des tirets
    const extension = MIME_TYPES[file.mimetype]; //Vérifie si l'image à la bonne extension ci dessus
    // name = name.replace("." + extension, "_");
    callback(null, name + Date.now() + '.' + extension); //Rajoute au nom, la date pour l'authenticité et éviter les doubles images + le . et l'extension
  }
});

//Exportation du module
module.exports = multer({storage: storage}).single('image');