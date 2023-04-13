// route.js - route module for check auth.

const express = require("express"),
    control = express.Router(),
    { XXHash32 } = require('xxhash-addon'),
    validator = require('validator'),
    connection = require('../connectdb').db; //Ficher de connection bdd

//Function pour check si il est connecter ou pas
function checkAuth(req, res, next) {
    if (!req.session.loggedin) {
        res.redirect("/login");
    } else {
        next();
    }
}

//Render  la création de deck
control.get("/createdeck", checkAuth, (req, res) => {

    let usernames = req.session.username;

    res.render("createdeck", {
        username: usernames
    });

});

//Page pour faire combattre 2 pokémon entre eux
control.get("/play", checkAuth, (req, res) => {
    res.render("play");
});

//render la page de création de pokémon
control.get("/pokemarker", checkAuth, (req, res) => {
    try {
        let usernames = req.session.username;

        res.render("createpokemon", {
            username: usernames
        });
    } catch (e) {
        res.send(e)
    }

});

// Le Login et l'inscription :

//si il a une entrée utulisateur et que on veut la vérifier utuliser cette function
function validate(string) {
    return validator.escape(string);
}


//Function de hashage
function hash3(passwords) {

    const salute = `U@1${passwords}ds-`;
    const buf_salute = Buffer.from(salute);
    const newpassword = XXHash32.hash(buf_salute).toString('hex');
    return validate(newpassword);

}

// Création de compte :
control.post('/create', function (req, res) {
    console.log(req.body)
    if (req.body.email == "" || !req.body.email || req.body.email == null || req.body.email == undefined) {
        req.body.email = "no" // si le email est vide ou n'existe pas, on lui donne un email "no" pour éviter les erreurs.
    }
    //Vérification de la sécurité de l'entrée utilisateur avec validator.
    let email = validate(req.body.email);
    let username = validate(req.body.username);
    let password = hash3(req.body.password); //hashage du mot de passe


    // Vérification de l'existence du compte
    if (username && password) { // si les champs sont remplis



        //Exemple d'insertion sql : INSERT INTO `accounts` (`id`, `username`, `password`, `highscore1`) VALUES (1, 'test', 'test', 0);
        connection.query(`INSERT INTO accounts (username, password, email) VALUES (?,?,?)`, [username, password, email], function (err, results, fields) {
            // If there is an issue with the query, output the error
            if (err) {
                console.log(err);
                return res.json({ "create": `${err}` })
            }
            if (results.protocol41 == true) { // Si le compte existe déjà on enregistre son username dans la session, et fait que il soit loggé.

                req.session.userid = results[0].id;
                req.session.loggedin = true;
                req.session.username = username;


                // petit message pour prevenir que le compte a bien été créer.
                res.json({ "create": true })
            } else {
                res.json({ "create": false })
            }
            res.end();
        });



    } else {
        res.json({ "create": false })
    }
});


control.post('/auth', function (req, res) {

    let password = hash3(req.body.password);
    let username = validate(req.body.username);

    console.log("\x1b[90m", `L'utulisateur ${username} avec le mt ${password}`);

    if (username && password && username != undefined && password != undefined) {

        connection.query(`SELECT id,username FROM accounts WHERE username = ? AND password = ?`, [username, password], function (error, results, fields) {
            if (error) {
                console.error("\x1b[31m","[Error] checkauthroute.js\n Print du result :\n", error);
                return res.json({ "login": false });
            }
            if (results.length > 0) {
                req.session.loggedin = true;
                req.session.username = username;
                req.session.userid = results[0].id; //enregistrement de l'id de l'utulisateur dans un session

                // petit message pour prevenir que le compte a bien été login.
                res.json({ "login": true })

                return res.end();
            } else {
                console.error("\x1b[31m","[Error] checkauthroute.js\n Print du result :\n", results);
                return res.json({ "login": false });
            }

        });
    } else {
        res.json({ "login": false })
        res.end();
    }



});



module.exports = control;