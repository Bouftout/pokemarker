// route.js - route module for check auth.

const express = require("express"),
    control = express.Router(),
    { XXHash32 } = require('xxhash-addon'),
    validator = require('validator'),
    config = require('../config/config.json'),
    jwt = require('jsonwebtoken'),
    connection = require('../connectdb').db; //Ficher de connection bdd

//Function pour check si il est connecter ou pas
function checkAuth(req, res, next) {

    if (!verifjwt(req)) {
        res.redirect("/login");
    } else {
        next();
    }

}

control.get("/co", checkAuth, (req, res) => {

    res.send("Bien connecté !");

});

//Render  la création de deck
control.get("/createdeck", checkAuth, (req, res) => {

    let usernames = req.session.username;

    res.render("createdeck", {
        username: usernames
    });

});

//Page pour faire combattre 2 pokémon entre eux
control.get("/play", checkAuth, (req, res) => {

    res.render("play", {
        username: req.session.username
    });

});


// Page d'affichage de deck
app.get("/equipe", checkAuth, (req, res) => {
    
    res.render("equipe", {
        username: req.session.username
    });

});



//Function de random
function rand(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min)) + min;
}


var poke = null;
const fetchpoke = async () => {
    const settings = { // Paramètres de la requête
        method: 'GET',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
        },
    };
    const res = await fetch(`https://api-pokemon-fr.vercel.app/api/v1/pokemon`, settings); // Requête
    if (res.ok) {
        poke = await res.json();
    }
};

fetchpoke();



//render la page de création de pokémon
control.get("/pokemarker", checkAuth, (req, res) => {


    try {
        let nb = rand(0, poke.length);
        console.log(poke[nb])
        let usernames = req.session.username;

        res.render("createpokemon", {
            username: usernames, pokemon: poke[nb].name.fr, sprite: poke[nb].sprites.regular
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

// La function a besoin du req et res de express + de l'username et de l'id qui s'occupera de les mettre en session
function createjwt(req, res, username, userid) {


    //Token gestion :
    const passjwt = jwt.sign({ username: username, id: userid }, config.jwt, { expiresIn: '30d' });

    let options = {
        maxAge: 30 * 86400000, // expire après 30 jour
    }

    // Set cookie
    res.cookie('token', passjwt, options);

    console.log("[Jwt] create jwt : " + passjwt);

    req.session.loggedin = true;
    req.session.userid = userid;
    req.session.username = username;
}

function verifjwt(req) {
    let verify;
    try {
        const token = req.cookies.token;

        if (!token) {
            console.warn(`[Auth] Token *vide*: ${token}`)
            verify = false;
        } else {
            console.log(`[Auth] Token: ${token}`)
            verify = jwt.verify(token, config.jwt);
            req.session.loggedin = true;
            console.log("data verify", verify)
            req.session.userid = verify.id;
            req.session.username = verify.username;
           // console.log("[session]", req.session)
        }
    } catch (e) {
        console.warn(e);
        verify = false
    }

    return verify;
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
                console.log("[checkauth] create accounts", results)

                createjwt();

                //Dans la session on enregistre l'id de l'utulisateur,son username et si il est log.
                req.session.userid = results.insertId;
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


//Automatic login
control.post('/jwt', function (req, res) {

    let password = hash3(req.body.password);
    let username = validate(req.body.username);
    console.log("\x1b[90m" + `L'utulisateur ${username} avec le mt ${password}`);

    if (username && password && username != undefined && password != undefined) {

        try {
            const verify = verifjwt(req);
            if (verify) {

                req.session.userid = results.insertId;
                req.session.loggedin = true;
                req.session.username = username;

                // petit message pour prevenir que le compte a bien été login.
                res.status(200).json({ "login": true })

                return res.end();
            } else {
                // Access Denied
                return res.status(500).send(error);
            }

        } catch (error) {
            console.log(error)
            // Access Denied
            return res.status(404).send(error);
        }

    } else {

        res.json({ "login": false })
        res.end();

    }

})




control.post('/auth', function (req, res) {

    let password = hash3(req.body.password);
    let username = validate(req.body.username);

    console.log("\x1b[90m" + `L'utulisateur ${username} avec le mt ${password}`);

    if (username && password && username != undefined && password != undefined) {

        connection.query(`SELECT id,username FROM accounts WHERE username = ? AND password = ?`, [username, password], function (error, results, fields) {
            if (error) {
                console.error("\x1b[31m", "[Error] checkauthroute.js\n Print du result : " + results + "\nErreur : ", error);
                return res.json({ "login": false });
            }
            if (results.length > 0) {

                createjwt(req, res, username, results[0].id); // Création du jwt

                res.redirect("/pokemon"); // Redirection vers /pokemon


            } else {
                console.error("\x1b[31m", "[Error] checkauthroute.js\n Print du result :\n", results);
                return res.status(503).send(results);
            }

        });
    } else {
        res.json({ "login": false })
        res.end();
    }



});






module.exports = control;