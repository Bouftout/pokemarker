// route.js - route module.

const express = require("express"),
    connection = require('../connectdb').db,
    control = express.Router();



control.get("/deck", (req, res) => {

    //Get tout les deck
    connection.query(`SELECT * FROM deck`, function (error, results, fields) {
        if (error) throw error;
        res.json(results);
    });

});


control.get("/:user/pokemon", (req, res) => {

    connection.query(`SELECT givenname FROM pokemon INNER JOIN accounts ON pokemon.idaccounts = accounts.id WHERE accounts.username = ?`, [req.params.user], function (error, results, fields) {
        if (error) throw error;
        res.json(results);
    });

});

//Get des pokémon avec le nom de l'utulisateur par rcontrolort au surnom(givenname)
control.get("/pokemon/:givenname", (req, res) => {

    connection.query(`SELECT accounts.username,pokemon.id,givenname,pv,nv,forcer,def,vitesse,specialatt,specialdef,evvitesse,evspeatt,evspedef,evdef,evatt,evpv,iv,nature FROM pokemon INNER JOIN accounts ON pokemon.idaccounts = accounts.id WHERE pokemon.givenname = ?`, [req.params.givenname], function (error, results, fields) {
        if (error) throw error;
        res.json(results);
    });

});

control.get("/pokemon", (req, res) => {

    console.log("[getroute] Get pokemon route");

    connection.query("SELECT accounts.username,pokemon.id,surnom,description,nature.natur FROM pokemon INNER JOIN nature ON pokemon.id_nature = nature.id INNER JOIN possede ON pokemon.id = possede.id_pokemon INNER JOIN accounts ON pokemon.id_accounts = accounts.id GROUP by pokemon.id;", function (error, results, fields) {
        
        var jsonres = results;
        if (error){
            console.warn(error)
            res.status(503).send(error);
        } 

        connection.query("SELECT statistique.namestat,valeur FROM possede INNER JOIN statistique ON possede.id_statistique = statistique.id where id_pokemon = ?;",[results[0].id], function (err, ress, fiel) {

            if (err){
                console.warn(err)
                res.status(503).send(err);
            } 


            jsonres.push(ress);

            res.json(jsonres);
        })

        

    });

});


module.exports = control;