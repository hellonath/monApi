
const models = require('../models')
const validator = require('validator')
const bcrypt = require('bcrypt') 
const jwtUtils = require('../utiles/jwtUtils')

module.exports = {
register : (req, res) => {
    let pseudo = req.body.pseudo;
    let email = req.body.email;
    let password = req.body.password;

    if(password =="" || email =="" || pseudo ==""){
       return res.status(500).json({error: "un ou plusieurs champs sont vides"})
    }

    if(!validator.isEmail(email)){
       return res.status(500).json({error: "Ton Email n'est pas valide !!!"})
    }

    models.Users.findOne({
        attributes: ["email"],
        where : {email:email}
    })
    .then ((userFound) => {
        if(!userFound){
            bcrypt.hash(password, 5,(error, bcryptedPassword) => {

            let newUser = models.Users.create({
                pseudo: pseudo,
                email: email,
                password: bcryptedPassword
            })
            .then((newUser) => {
                console.log(newUser);
                return res.status(200).json({sucess : "Utilisateur créé", newUser});
            })
            .catch((err) => {
                console.log(err);
            });
    })
        } else {
            return res.status(400).json ({ error : 'Utilisateur déjà créé, créer un nouveau'});
        }
    })
    .catch ((err) => {
        return res.status(400).json({ error : "Impossible de vérifier l'utilisateur" + err});
    })
},

login: (req, res) => {

    let email = req.body.email;
    let password = req.body.password;

    if(password =="" || email ==""){
       return res.status(500).json({error: "un ou plusieurs champs sont vides"})
    }

    if(!validator.isEmail(email)){
       return res.status(500).json({error: "Ton email n'est pas valide !!!"})
    }
    // Select * from Users where email = "email du User"
    models.Users.findOne({
        where : {email:email}
    })
    .then((Userfound) => {
        if(Userfound) {
            bcrypt.compare(password, Userfound.password, (errorBcrypt, resBcrypt) => {
                if (resBcrypt) {
                    res.status(200).json({
                        sucess: "ok loged",
                        userId: Userfound.id,
                        token: jwtUtils.generateTokenForUser(Userfound),
                    });
                }else{
                    res.status(400).json({ error: "mot de passe incorrect" });
                }
            });
        } else {
            res.status(404).json({ error: "utilisateur non trouvé" });
        }
    })
    .catch((err) => {
        return res.status(500).json({ error : "Impossible de vous connecter " /*car je ne vous trouve pas dans la DBB*/ + err});
    })
},
}

