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

app.set('view engine', 'ejs')

app.use('/src', express.static(path.join(__dirname, 'src')))

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
    secret: 'eg[isfd-8yF9-7wwzd2315df{}+Ijsli;;to8',
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

        console.log("\x1b[33m",`Deploy sur serveur automatique`);
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

    // Mes route (GetRoute)
    const getroute = require("./controller/getroute.js");
    app.use("/get/", getroute);


    // Mes route (createRoute)
    const createroute = require("./controller/createroute.js");
    app.use("/create/", createroute);

});




//Delete par rapport avec un id et un pokémon
app.delete("/delete/:idpoke/pokemon", (req, res) => {

    //req.session.userid est enregistrer si on se connecte ou crée sont compte et correspond a l'id de son compte dans ça basse de donnée.
    if (req.session.loggedin) {
        connection.query(`DELETE FROM \`pokemon\` WHERE pokemon.idaccounts = ? AND pokemon.id = ?`, [req.session.userid, req.params.idpoke], function (error, results, fields) {
            if (error) throw error;
            console.log(results.affectedRows);
            if (results.affectedRows > 0) {
                res.json({ "delete": true })
            } else {
                res.json({ "delete": false })
            }
        });
    } else {
        res.json({ "delete": "doncconnect" })
    }

});


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


//Page de Déconnexion de son compte
app.get('/disco', function (req, res) {

    if (req.session.loggedin) {
        req.session.destroy();
        res.redirect("/")
    } else {
        res.redirect("/")
    }

})






// Pokemon socket.io
const io = require("socket.io")(server);

// server-side
io.on("connection", (socket) => {
    // console.log("Connection:" + socket.id); // x8WIv7-mJelg7on_ALbx


    //Des que tu est connecter il va executer ce qu'il a dedans :
    socket.conn.on("upgrade", () => {
        const upgradedTransport = socket.conn.transport.name;
        console.log(upgradedTransport) // ws
    });


    //Connection :
    socket.on("connectpoke", async (room) => {

        try {
            const clients = io.sockets.adapter.rooms.get(`pokeroom${room}`);
            const numClients = clients ? clients.size : 0;
            console.log(numClients)
            console.log('[socket]', 'join room :', `pokeroom${room}`)
            socket.join(`pokeroom${room}`);
            io.to(`pokeroom${room}`).emit('newplayer', `pokeroom${room}`, Number(numClients) + 1);

        } catch (e) {
            console.log('[error]', 'join room :', e);
            socket.emit('error', 'couldnt perform requested action');
        }

    });


    //Deconnection :
    socket.on("disconnect", async () => {
        console.log("Une personne s'est déconnecter")
    });

    socket.on('disconnecting', function () {

        //Deconnection
        console.log('[socket]', 'leave room !', socket.rooms);
        socket.rooms = null;
    });


    socket.on("sendpoke", async (room, namepoke) => {
        console.log('[socket]', 'leave room :', room);
        await socket.to(`pokeroom${room}`).emit(`recevoirpoke`, namepoke);
        // await io.emit(`recevoirpoke`, namepoke);

    })

    socket.on("foisdeuxserv", async (room, atk) => {

        // await io.to(`pokeroom${room}`).emit(`foisdeux`, atk);


    })


    socket.on("winner", async (username1, username2, pvwinner, vainqueur, p1pokename, p2pokename) => {
        console.log('[socket]', 'winner :');
        console.log(username1 + username2 + pvwinner + vainqueur + "\n")



        connection.query(`INSERT INTO \`historique\` VALUES (test(),(SELECT id FROM accounts WHERE username = ?),(SELECT id FROM accounts WHERE username = ?),?,?,?,?)`, [username1, username2, pvwinner, vainqueur, p1pokename, p2pokename], function (err, results, fields) {
            // If there is an issue with the query, output the error
            if (err) {
                return console.log(err);
            }

        });


    })



});
