const express = require('express')
const userCtrl = require('../controllers/userCtrl')

// Appeler les fonction des routes de l'API

exports.router = (() => {
    const apiRouter = express.Router();
    // Créer une route qui permet de s'enregistrer avec la fonction ci dessous / fonction qui va faire le register

    apiRouter.route("/user/register").post(userCtrl.register)
    apiRouter.route("/user/login").post(userCtrl.login);

    return apiRouter;
})();


