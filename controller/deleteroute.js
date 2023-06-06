// route.js - route module.
// Ici il a des /delete/ a tout les control !

const express = require("express"),
    connection = require('../connectdb').db,
    control = express.Router();

//Delete par rapport avec un id et un pokémon
control.delete("/:idpoke/pokemon" ,(req, res) => {

    //req.session.userid est enregistrer si on se connecte ou crée sont compte et correspond a l'id de son compte dans ça basse de donnée.
    if (req.session.loggedin) {
        connection.query(`CALL delpoke(?,?)`, [req.session.userid, req.params.idpoke], function (error, results, fields) {
            if (error) throw error;
            console.log(results);
            if (results.affectedRows > 1) {
                res.json({ "delete": true })
            } else {
                res.json({ "delete": false })
            }
        });
    } else {
        res.json({ "delete": "doncconnect" })
    }

});



module.exports = control;