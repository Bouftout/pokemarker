// route.js - route module.

const express = require("express"),
    mysql = require('mysql'),
    config = require("../config/config.json"),
    control = express.Router();

const connection = mysql.createConnection({ //connection bdd
    host: config.host,
    user: config.user,
    password: config.password,
    database: config.database
});

connection.connect();


control.get("/get/deck", (req, res) => {

    //Get tout les deck
    connection.query(`SELECT * FROM deck`, function (error, results, fields) {
        if (error) throw error;
        res.json(results);
    });

});


control.get("/get/:user/pokemon", (req, res) => {

    connection.query(`SELECT givenname FROM pokemon INNER JOIN accounts ON pokemon.idaccounts = accounts.id WHERE accounts.username = ?`, [req.params.user], function (error, results, fields) {
        if (error) throw error;
        res.json(results);
    });

});

//Get des pokémon avec le nom de l'utulisateur par rcontrolort au surnom(givenname)
control.get("/get/pokemon/:givenname", (req, res) => {

    connection.query(`SELECT accounts.username,pokemon.id,givenname,pv,nv,forcer,def,vitesse,specialatt,specialdef,evvitesse,evspeatt,evspedef,evdef,evatt,evpv,iv,nature FROM pokemon INNER JOIN accounts ON pokemon.idaccounts = accounts.id WHERE pokemon.givenname = ?`, [req.params.givenname], function (error, results, fields) {
        if (error) throw error;
        res.json(results);
    });

});

control.get("/get/pokemon", (req, res) => {

    connection.query("SELECT accounts.username,pokemon.id,nv,name,surnom,original,'date',description FROM pokemon INNER JOIN accounts ON pokemon.id_accounts = accounts.id;", function (error, results, fields) {
        if (error) throw error;
        res.json(results);
    });

});


module.exports = control;