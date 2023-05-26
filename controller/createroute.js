
// createroute.js - create route module.

const express = require("express"),
    control = express.Router(),
    validator = require('validator'),
    connection = require('../connectdb.js').db;

//Function pour valider(anti-sql)
function validate(string) {
    return validator.escape(string);
}
function numvalidate(number) {
    return Number(validator.escape(number));
}

//Function de random
function rand(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min)) + min;
}


//Création d'un pokemon dans la bdd.
app.post('/create/pokemon', function (req, res) {

    if (req.session.loggedin) {
        console.log("create pokemon")
        console.log(req.body);

        //Verification(anti-mysql) + ev et iv random entre 0 et 31
        let nom = validate(req.body.name);
        surnom = validate(req.body.nomdonner),
            pv = numvalidate(req.body.pv),
            forcer = numvalidate(req.body.forcer),
            defense = numvalidate(req.body.defense),
            vitesse = numvalidate(req.body.vitesse),
            specialatt = numvalidate(req.body.specialatt),
            specialdef = numvalidate(req.body.specialdef),
            iv = rand(0, 31),
            nature = numvalidate(req.body.nature), // Récupe le chiffre de la valeur dans le select(chiffre qui correspond a l'id dans la bdd de la table nature)
            username = validate(req.body.username),
            userid = req.session.userid,
            evvitesse = rand(0, 31),
            evspeatt = rand(0, 31),
            evspedef = rand(0, 31),
            evdef = rand(0, 31),
            evatt = rand(0, 31),
            evpv = rand(0, 31),
            sprite = req.body.sprite,
            description = req.body.description
            nv = 1;

        // evpv,evatt,evdef,evattspeatt,evdefspedef,evvitesse
        //(SELECT id FROM accounts WHERE username = "toni")

        if (nom && surnom && pv && forcer && defense && vitesse && specialdef && specialatt && iv) { // si les champs sont remplis

            //IL a 16 statistique
            connection.query(`CALL createpokemon(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)`, [nv, nom, surnom, userid, nature, pv, forcer, defense, vitesse, specialatt, specialdef, evvitesse, evspeatt, evspedef, evdef, evatt, evpv, iv, sprite, description], function (error, results, fields) {
                // If there is an issue with the query, output the error
                if (error) {
                    console.log(error);
                    return res.json({ "create": `${error}` })
                }
                if (results.protocol41 == true) { // Si le compte existe déjà on enregistre son username dans la session, et fait que il soit loggé.

                    console.log("crée");
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

    } else {
        res.json({ "create": "dontconnect" })
    }
})


//Création d'un deck
control.post('/deck', function (req, res) {


    console.log(req.body.length);

    for (i = 0; i < req.body.length; i++) {

        //req.session.userid est enregistrer si on se connecte ou crée sont compte et correspond a l'id de son compte dans ça basse de donnée.
        //on crée donc une ligne comprenant une id,l'id du compte,l'id du pokémon, et le numéro du deck(pour pouvoir gérer que un utulisateur puissent faire plusieur deck)
        connection.query(`insert into deck (idacc,idpok,nbdeck) SELECT ?,?,(SELECT MAX(nbdeck)+1 FROM deck)`, [req.session.userid, req.body[i]], function (error, results, fields) {
            // If there is an issue with the query, output the error
            if (error) {
                console.log(error);
                return res.send("Error")
            }
            if (results.protocol41 == true) {

                console.log(results)
                res.status(200)

            } else {

            }
            res.end();
        });

    }




})


module.exports = control;