//Tout les npm utilisé pour le projet.
const mysql = require('mysql'),
    express = require('express'),
    session = require('express-session'),
    path = require('path'),
    cookieParser = require('cookie-parser'),
    port = (process.env.PORT || process.env.ALWAYSDATA_HTTPD_PORT || 8100),
    ip = (process.env.IP || process.env.ALWAYSDATA_HTTPD_IP),
    validator = require('validator'),
    helmet = require("helmet"),
    { XXHash32 } = require('xxhash-addon'),
    { exec } = require('child_process'),
    fs = require('fs');
    app = express();

app.set('view engine', 'ejs')

app.use('/src', express.static(path.join(__dirname, 'src')))

server = app.listen(port, ip, err => {
    err ?
        console.log("Error in server setup") :
        console.log(`Worker ${process.pid} started\nServeur lancer sur: http://localhost:${port}`);
});

const connection = mysql.createConnection({ //connection bdd
    host: 'mysql-pokemarker.alwaysdata.net',
    user: '288618_pokemarke',
    password: 'totoni13',
    database: 'pokemarker_index'
});

app.use(cookieParser()); //Pour pouvoir utiliser les cookie.
app.use(express.json()); // for parsing application/json
app.use(express.urlencoded({ extended: true }));
app.disable('x-powered-by'); //Désactive le header x-powered-by
app.use(session({
    cookieName: 'session',
    secret: 'eg[isfd-8yF9-7wwzd2315df{}+Ijsli;;to8',
    expires: new Date(Date.now() + (30 * 86400 * 1000)),
    httpOnly: true,
    secure: true,
    ephemeral: true,
    resave: true,
    saveUninitialized: true
}));


setInterval(function () {
    ftpdeploy()
}, (20 * 60) * 1000) // Time upload en minute(celui de gauche)

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

        console.log(`Deploy sur serveur automatique`);
    });
}



//Function pour check si il est connecter ou pas
function checkAuth(req, res, next) {
    if (!req.session.loggedin) {
      res.redirect("/login");
    } else {
      next();
    }
  }

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

//Render la page accueil qui correspont donc a la page que l'utulisateur verra la 1ière fois qui viens sur le site
app.get('/', function (req, res) {
    res.render("index")
});

//Affichage de la page login si on pas connecté sinon on redirige vers l'accueil.
app.get("/login", (req, res) => {
    if (!req.session.loggedin) {
        res.render("login")
    } else {
        res.redirect('/')
    }
});

//Si il n'a pas de compte on affiche la page create.ejs sinon on redirige vers /pokémon
app.get("/create", (req, res) => {
    if (!req.session.loggedin) {
        res.render("create")
    } else {
        res.redirect('/pokemon')
    }
});

//Render la page pokémon,si on est connecté donner aussi l'username de l'utulisateur enregistrer dans la session
app.get("/pokemon", (req, res) => {

    if (!req.session.loggedin) {
        res.render("pokemon")
    } else {
        let usernames = req.session.username;

        res.render("pokemon", {
            username: usernames
        });
    }
});

//Render  la création de deck
app.get("/createdeck",checkAuth, (req, res) => {

        let usernames = req.session.username;

        res.render("createdeck", {
            username: usernames
        });
    
});

//Création d'un deck
app.post('/create/deck', function (req, res) {


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

// Debut gestion de page


//render la page
app.get("/pokemarker",checkAuth, (req, res) => {
    try {
        let usernames = req.session.username;

        res.render("createpokemon", {
            username: usernames
        });
    } catch(e){
        res.send(e)
    }

});

//Page pour faire combattre 2 pokémon entre eux
app.get("/play",checkAuth, (req, res) => {
    res.render("play");
});

//Page d'historique(affichage de tout les combat pokémon auparavant)
app.get("/historique", (req, res) => {
    res.render("historique")
});

//Page de déconnexion
app.get("/patchnote", (req, res) => {
    res.render("patchnote");
});

app.get("/deck", (req, res) => {
    res.render("deck");
});

//Page de déconnexion
app.get("/logout", (req, res) => {
    req.session.destroy(); // détruire la session
    res.redirect("/login"); // rediriger vers /login(page de connexion)
});


//Fin Gestion de page

app.get("/get/deck", (req, res) => {

    //Get tout les deck
    connection.query(`SELECT * FROM deck`, function (error, results, fields) {
        if (error) throw error;
        res.json(results);
    });

});


app.get("/get/:user/pokemon", (req, res) => {

    connection.query(`SELECT givenname FROM pokemon INNER JOIN accounts ON pokemon.idaccounts = accounts.id WHERE accounts.username = ?`, [req.params.user], function (error, results, fields) {
        if (error) throw error;
        res.json(results);
    });

});

//Get des pokémon avec le nom de l'utulisateur par rapport au surnom(givenname)
app.get("/get/pokemon/:givenname", (req, res) => {

    connection.query(`SELECT accounts.username,pokemon.id,givenname,pv,nv,forcer,def,vitesse,specialatt,specialdef,evvitesse,evspeatt,evspedef,evdef,evatt,evpv,iv,nature FROM pokemon INNER JOIN accounts ON pokemon.idaccounts = accounts.id WHERE pokemon.givenname = ?`, [req.params.givenname], function (error, results, fields) {
        if (error) throw error;
        res.json(results);
    });

});

app.get("/get/pokemon", (req, res) => {

    connection.query("SELECT accounts.username,pokemon.id,nv,name,surnom,original,'date',description FROM pokemon INNER JOIN accounts ON pokemon.id_accounts = accounts.id;", function (error, results, fields) {
        if (error) throw error;
        res.json(results);
    });

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
        nomdonner = validate(req.body.nomdonner),
            pv = validate(req.body.pv),
            forcer = validate(req.body.forcer),
            defense = validate(req.body.defense),
            vitesse = validate(req.body.vitesse),
            specialatt = validate(req.body.specialatt),
            specialdef = validate(req.body.specialdef),
            iv = rand(0, 31),
            nature = validate(req.body.nature),
            idutilisateur = validate(req.body.username);
        evvitesse = rand(0, 31),
            evspeatt = rand(0, 31),
            evspedef = rand(0, 31),
            evdef = rand(0, 31),
            evatt = rand(0, 31),
            nv = 1,
            evpv = rand(0, 31);


        //,evpv,evatt,evdef,evattspeatt,evdefspedef,evvitesse
        //(SELECT id FROM accounts WHERE username = "toni")

        if (nom && nomdonner && pv && forcer && defense && vitesse && specialdef && specialatt && iv) { // si les champs sont remplis

            //insert into pokemon values (getmaxidpoke(),1,'Vektor','15','15','15','15','5','15',2,27,23,26,8,11,4,'fortencss',(SELECT id FROM accounts WHERE username = "toni"),'vektor');
            connection.query(`insert into pokemon values (getmaxidpoke(),?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,(SELECT id FROM accounts WHERE username = ?),?)`, [nv, nom, pv, forcer, defense, vitesse, specialatt, specialdef, evvitesse, evspeatt, evspedef, evdef, evatt, evpv, iv, nature, idutilisateur, nomdonner], function (error, results, fields) {
                // If there is an issue with the query, output the error
                if (error) {
                    console.log(error);
                    return res.json({ "create": `${error}` })
                }
                if (results.protocol41 == true) { // Si le compte existe déjà on enregistre son username dans la session, et fait que il soit loggé.

                    console.log("crée")
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


// Création de compte :
app.post('/create', function (req, res) {
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
        connection.query(`INSERT INTO \`accounts\`(\`id\` , \`username\`, \`password\`, \`email\`) VALUES (getmaxid(),?,?,?)`, [username, password, email], function (err, results, fields) {
            // If there is an issue with the query, output the error
            if (err) {
                console.log(err);
                return res.json({ "create": `${err}` })
            }
            if (results.protocol41 == true) { // Si le compte existe déjà on enregistre son username dans la session, et fait que il soit loggé.

                connection.query(`SELECT id FROM accounts WHERE id = getmaxid()-1`, function (error, resultid, fields) {
                    // If there is an issue with the query, output the error
                    if (error) {
                        console.log(error);
                        return res.json({ "create": `${error}` })
                    }
                    req.session.userid = resultid[0].id;
                });

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


app.post('/auth', function (req, res) {

    let password = hash3(req.body.password);
    let username = validate(req.body.username);

    console.log("pass " + password);
    console.log("user " + username);

    if (username && password && username != undefined && password != undefined) {
        connection.query(`SELECT id,username FROM accounts WHERE username = ? AND password = ?`, [username, password], function (error, results, fields) {
            if (error) {
                console.log(error);
                return res.json({ "login": false });
            }
            console.log(results);
            if (results.length > 0) {
                req.session.loggedin = true;
                req.session.username = username;
                req.session.userid = results[0].id; //enregistrement de l'id de l'utulisateur dans un session
                // petit message pour prevenir que le compte a bien été login.
                res.json({ "login": true })
                return res.end();
            } else {
                console.log("tome")
                return res.json({ "login": false });
            }
        });
    } else {
        res.json({ "login": false })
        res.end();
    }



});


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
