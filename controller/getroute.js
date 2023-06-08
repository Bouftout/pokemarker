// route.js - route module.
// Ici il a des /get/ a tout les control !

const express = require("express"),
    connection = require('../connectdb').db,
    control = express.Router();




control.get("/user/pokemon", (req, res) => {

    connection.query(`SELECT pokemon.id,name,surnom,id_equipe FROM pokemon INNER JOIN accounts ON pokemon.id_accounts = accounts.id WHERE accounts.id = ?`, [req.session.userid], function (error, results, fields) {
        if (error) throw error;
        res.json(results);
    });

});


control.get("/idsession/pokemon", (req, res) => {

    console.log("[SQL] Get pokemon route");

    connection.query(`SELECT surnom FROM pokemon WHERE id_accounts = ?`, [req.session.userid], function (error, results, fields) {



        if (error) {
            console.warn(error);
            res.status(503).send(error);
        }


        res.json(results);


    });
});


//Voir les pokémon par rapport a leur surnom(Un peu bugée)
control.get("/player1/pokemon/:surnom", (req, res) => {

    console.log("[SQL] Get *surnom* pokemon");

    connection.query("SELECT accounts.username,pokemon.id,name,surnom,nv,description,nature.natur,description FROM pokemon INNER JOIN nature ON pokemon.id_nature = nature.id INNER JOIN possede ON pokemon.id = possede.id_pokemon INNER JOIN accounts ON pokemon.id_accounts = accounts.id WHERE pokemon.surnom = ? GROUP by pokemon.id;", [req.params.surnom], function (error, results, fields) {

        var jsonres = results;

        if (error) {
            console.warn(error);
            res.status(503).send(error);
        }
        console.log(results[0]);

        if (results[0] !== undefined) {

            connection.query("SELECT statistique.namestat,valeur FROM possede INNER JOIN statistique ON possede.id_statistique = statistique.id where id_pokemon = ?;", [results[0].id], function (err, ress, fiel) {

                if (err) {
                    console.warn(err)
                    res.status(503).send(err);
                }


                jsonres.push(ress);

                res.json(jsonres);
            })

        } else {

            res.sendStatus(503);

        }



    });

});


control.get("/pokemon/:surnom", (req, res) => {

    console.log("[SQL] Get id pokemon grace au surnom");

    connection.query("SELECT pokemon.id FROM pokemon where pokemon.surnom = ?", [req.params.surnom], function (error, results, fields) {
        if (error) throw error;


        console.log(results)

        res.json(results)


    });

});



control.get("/player2/pokemon/:id", (req, res) => {

    console.log("[SQL] Get player2 pokemon with surnom");

    connection.query("SELECT accounts.username,pokemon.id,name,surnom,nv,description,nature.natur FROM pokemon INNER JOIN nature ON pokemon.id_nature = nature.id INNER JOIN possede ON pokemon.id = possede.id_pokemon INNER JOIN accounts ON pokemon.id_accounts = accounts.id WHERE pokemon.id = ? GROUP by pokemon.id;SELECT statistique.namestat,valeur,possede.id_pokemon FROM possede INNER JOIN statistique ON possede.id_statistique = statistique.id WHERE possede.id_pokemon = ?;", [req.params.id, req.params.id], function (error, results, fields) {
        if (error) throw error;


        console.log(results)

        res.json(results)


    });

});



// /get (page voir les pokémon)
control.get("/pokemon", (req, res) => {

    console.log("[SQL] Get pokemon route");

    connection.query("SELECT accounts.username,pokemon.id,name,surnom,nv,description,nature.natur FROM pokemon INNER JOIN nature ON pokemon.id_nature = nature.id INNER JOIN possede ON pokemon.id = possede.id_pokemon INNER JOIN accounts ON pokemon.id_accounts = accounts.id GROUP by pokemon.id;SELECT statistique.namestat,valeur,possede.id_pokemon FROM possede INNER JOIN statistique ON possede.id_statistique = statistique.id;", function (error, results, fields) {
        if (error) throw error;


        console.log(results)

        res.json(results)


    });

});

control.get("/historique", (req, res) => {

    console.log("[SQL] Get historique");

    connection.query(`SELECT accounts.username AS "uservainqueur",id_pokemon_p1_combat AS "idpok1",id_pokemon_p2_combat AS "idpok2",date,pvrestant,id_vainqueur,id_perdant FROM combat INNER JOIN accounts ON combat.id_vainqueur GROUP by combat.id`, function (error, results, fields) {
        if (error) throw error;


        console.log(results)

        res.json(results)


    });

});

control.get("/histo/pokemon/:id/:acc", (req, res) => {

    let acc = req.params.acc,
        id = req.params.id;
    console.log("[Info] Get historique Pokémon acc :" + acc)
    // Commande sql pour récupérer tout les pokémon
    // SELECT pokemon.*,accounts.username FROM historique INNER JOIN pokemon on pokemon.idaccounts = historique.idacc1 INNER JOIN accounts ON historique.idacc1 = accounts.id WHERE accounts.id = ? GROUP BY id',[req.params.id],

    if (acc == 1) {

        //Si compte 1 gagne :
        // Commande sql qui recupere le nom du compte,et les stats du pokémon (pour le compte 1) :
        connection.query('SELECT accounts.username,pokemon.* FROM combat INNER JOIN pokemon ON combat.id_pokemon_p1_combat = pokemon.id INNER JOIN accounts ON pokemon.id_accounts = accounts.id WHERE pokemon.id = ? GROUP by pokemon.id', [id], function (error, results, fields) {
            if (error) throw error;
            res.json(results);
        });

    } else {
        //Sinon si c'est pas le compte 1
        // Commande sql qui recupere le nom du compte,et les stats du pokémon (pour le compte 2) :
        connection.query('SELECT accounts.username,pokemon.* FROM combat INNER JOIN pokemon ON combat.id_pokemon_p2_combat = pokemon.id INNER JOIN accounts ON pokemon.id_accounts = accounts.id WHERE pokemon.id = ? GROUP by pokemon.id', [id], function (error, results, fields) {
            if (error) throw error;
            res.json(results);
        });
    }



});



control.get("/classement", (req, res) => {

    console.log("[SQL] Get classement");

    connection.query(`SELECT accounts.username AS "username",count(id_vainqueur) AS "nbvictoire" FROM combat INNER JOIN accounts ON combat.id_vainqueur = accounts.id GROUP BY id_vainqueur ORDER BY count(id_vainqueur) DESC`, function (error, results, fields) {
        if (error) throw error;


        console.log(results)

        res.json(results)


    });

});



module.exports = control;