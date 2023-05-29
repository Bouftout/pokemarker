//Tout les npm utilisé pour le projet.
const express = require('express'),
    session = require('express-session'),
    path = require('path'),
    cookieParser = require('cookie-parser'),
    port = (process.env.PORT || process.env.ALWAYSDATA_HTTPD_PORT || 8100),
    ip = (process.env.IP || process.env.ALWAYSDATA_HTTPD_IP),
    helmet = require("helmet"),
    { exec } = require('child_process'),
    config = require("./config/config.json")
    fs = require('fs');

app = express();

app.set('view engine', 'ejs');

app.use('/src', express.static(path.join(__dirname, 'src')));

server = app.listen(port, ip, err => {
    err ?
        console.log("Error in server setup") :
        console.log(`Worker ${process.pid} started\nServeur lancer sur: http://localhost:${port}`);

});



app.use(cookieParser(config.cookiesecret)); //Pour pouvoir utiliser les cookie.
app.use(express.json()); // for parsing application/json
app.use(express.urlencoded({ extended: true }));
app.disable('x-powered-by'); //Désactive le header x-powered-by
app.use(session({
    cookieName: 'session',
    secret: config.secret_session,
    expires: 30 * 86400000,
    httpOnly: true,
    secure: true,
    ephemeral: true,
    resave: true,
    saveUninitialized: true
}));


setInterval(function () {
    ftpdeploy()
}, ((10 * 60) * 1000)) // Time upload en minute(celui de gauche) ((20 * 60) * 1000)

function ftpdeploy() {
    exec('npm run deploy', (error, stdout, stderr) => {
        if (error) {
            console.error(`error: ${error.message}`);
            return;
        }
        if (stderr) {
            console.error(`stderr: ${stderr}`);
            return;
        }

        console.log("\x1b[33m", `Deploy sur serveur automatique`);
    });
}

// Mes route (Tout mes get qui ne nécessite pas de checkAuth)
const route = require("./controller/route.js");
app.use("/", route);


//Connection via un ficher a la bdd
let dbsql = require('./connectdb');

dbsql.init(function (error) {

    // Mes route (CheckAuth)
    const checkauthroute = require("./controller/checkauthroute.js");
    app.use("/", checkauthroute);

    // Socket.js
    const socketjs = require("./controller/socket.js");
    app.use("/", socketjs);

    // Mes route (GetRoute)
    const getroute = require("./controller/getroute.js");
    app.use("/get/", getroute);


    // Mes route (createRoute)
    const createroute = require("./controller/createroute.js");
    app.use("/create/", createroute);

    // Mes route (deleteroute)
    const delroute = require("./controller/deleteroute.js");
    app.use("/delete/", delroute);

});






/* FUNCTION A REFAIRE
//Get la table historique de sql
app.get("/get/historique", (req, res) => {

    connection.query('SELECT idacc1,idacc2,pv,vainqueur FROM historique', function (error, results, fields) {
        if (error) throw error;
        res.json(results);
    });

});

app.get("/get/historique/pokemon/:id/:acc", (req, res) => {

    let acc = req.params.acc;
    let id = req.params.id;
    console.log("[Info] Get historique Pokémon acc :" + acc)
    // Commande sql pour récupérer tout les pokémon
    // SELECT pokemon.*,accounts.username FROM historique INNER JOIN pokemon on pokemon.idaccounts = historique.idacc1 INNER JOIN accounts ON historique.idacc1 = accounts.id WHERE accounts.id = ? GROUP BY id',[req.params.id],

    if (acc == 1) {
        //Si compte 1 gagne :
        // Commande sql qui recupere le nom du compte,et les stats du pokémon (pour le compte 1):
        connection.query('SELECT accounts.username,pokemon.* FROM historique INNER JOIN pokemon on pokemon.idaccounts = historique.idacc1 INNER JOIN accounts ON historique.idacc1 = accounts.id WHERE accounts.id = ? AND pokemon.givenname = (SELECT poke1 FROM historique WHERE idacc1 = ?) GROUP BY id', [id, id], function (error, results, fields) {
            if (error) throw error;
            res.json(results);
        });
    } else {
        //Sinon si c'est pas le compte 1
        // Commande sql qui recupere le nom du compte,et les stats du pokémon (pour le compte 2):
        connection.query('SELECT accounts.username,pokemon.* FROM historique INNER JOIN pokemon on pokemon.idaccounts = historique.idacc2 INNER JOIN accounts ON historique.idacc2 = accounts.id WHERE accounts.id = ? AND pokemon.givenname = (SELECT poke2 FROM historique WHERE idacc2 = ?) GROUP BY id', [id, id], function (error, results, fields) {
            if (error) throw error;
            res.json(results);
        });
    }



});
*/


