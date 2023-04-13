
// createroute.js - create route module.

const express = require("express"),
    control = express.Router(),
    connection = require('../connectdb.js').db;


//Création d'un deck
control.post('/create/equipe', function (req, res) {


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