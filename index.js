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
    host: 'mysql-casinosio.alwaysdata.net',
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

//Function pour render la page grâce a ejs et envoyer les données.
//Ne pas oublier de lui donner un nom(page voulu qui se situe dans /views),req,res en paramètre.
function renderpage(names, req, res) {
    if (req.session.loggedin == true) {
        let usernames = req.session.username;

        res.render(names, {
            username: usernames
        });
    } else {
        res.redirect("/login");
    }
}

function validate(string) {
    return validator.escape(string);
}


function hash3(passwords) {

    const salute = `U@1${passwords}ds-`;
    const buf_salute = Buffer.from(salute);
    const newpassword = XXHash32.hash(buf_salute).toString('hex');
    return validate(newpassword);

}


// http://localhost:3000/
app.get('/', function (req, res) {
    if (!req.session.loggedin) {
        res.render("index")
    } else {
        res.redirect('/login')
    }
});


app.get("/login", (req, res) => {
    if (!req.session.loggedin) {
        res.render("login")
    } else {
        res.redirect('/pokemon')
    }
});
app.get("/create", (req, res) => {
    if (!req.session.loggedin) {
        res.render("create")
    } else {
        res.redirect('/pokemon')
    }
});
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

app.get("/createdeck", (req, res) => {

    if (!req.session.loggedin) {
        res.render("login")
    } else {
        let usernames = req.session.username;

        res.render("createdeck", {
            username: usernames
        });
    }
});

app.post('/create/deck', function (req, res) {


    console.log(req.body.length);

for(i = 0;i < req.body.length;i++){

    connection.query(`insert into deck (idacc,idpok) values (?,?)`, ["1",req.body[i]], function (error, results, fields) {
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



app.get("/pokemarker", (req, res) => {
    renderpage("createpokemon", req, res)
});

app.get("/play", (req, res) => {
    renderpage("play", req, res)
});

app.get("/logout", (req, res) => {
    req.session.destroy();
    res.redirect("/login");
});

app.get("/get/:user/pokemon", (req, res) => {

    // connection.query(`SELECT accounts.username,pokemon.id,givenname,pv,nv,'forcer',def,vitesse,specialatt,specialdef,evvitesse,evspeatt,evspedef,evdef,evatt,evpv,iv,nature FROM pokemon INNER JOIN accounts ON pokemon.idaccounts = accounts.id WHERE accounts.username = ?`, [req.params.user], function (error, results, fields) {
    //     if (error) throw error;
    //     res.json(results);
    // });

    connection.query(`SELECT givenname FROM pokemon INNER JOIN accounts ON pokemon.idaccounts = accounts.id WHERE accounts.username = ?`, [req.params.user], function (error, results, fields) {
        if (error) throw error;
        res.json(results);
    });

});

app.get("/get/pokemon/:givenname", (req, res) => {

    connection.query(`SELECT accounts.username,pokemon.id,givenname,pv,nv,forcer,def,vitesse,specialatt,specialdef,evvitesse,evspeatt,evspedef,evdef,evatt,evpv,iv,nature FROM pokemon INNER JOIN accounts ON pokemon.idaccounts = accounts.id WHERE pokemon.givenname = ?`, [req.params.givenname], function (error, results, fields) {
        if (error) throw error;
        res.json(results);
    });

});

app.get("/get/pokemon", (req, res) => {

    connection.query('SELECT accounts.username,pokemon.id,name,pv,`forcer`,def,vitesse,specialatt,specialdef,evvitesse,evspeatt,evspedef,evdef,evatt,evpv,iv,nature,givenname FROM pokemon INNER JOIN accounts ON pokemon.idaccounts = accounts.id', function (error, results, fields) {
        if (error) throw error;
        res.json(results);
    });

});

app.delete("/delete/:idpoke/pokemon", (req, res) => {

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



app.get('/disco', function (req, res) {

    if (req.session.loggedin) {
        req.session.destroy();
        res.redirect("/")
    } else {
        res.redirect("/")
    }

})

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
            ide = req.session.userid,
            evvitesse = rand(0, 31),
            evspeatt = rand(0, 31),
            evspedef = rand(0, 31),
            evdef = rand(0, 31),
            evatt = rand(0, 31),
            nv = 1,
            evpv = rand(0, 31);


        //,evpv,evatt,evdef,evattspeatt,evdefspedef,evvitesse

        if (nom && nomdonner && pv && forcer && defense && vitesse && specialdef && specialatt && iv) { // si les champs sont remplis

            //INSERT INTO `pokemon`(`name`, `pv`, `forcer`, `def`, `vitesse`, `special`, `iv`, `ev`, `nature`, `idaccounts`) VALUES ('testsql',50,50,50,50,50,50,2,'test',2)
            connection.query(`insert into pokemon values (getmaxidpoke(),?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)`, [nv,nom,pv, forcer, defense, vitesse, specialatt, specialdef, evvitesse, evspeatt, evspedef, evdef, evatt, evpv, iv, nature, ide, nomdonner], function (error, results, fields) {
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
        connection.query(`SELECT id,username FROM accounts WHERE username = '${username}' AND password = '${password}'`, function (error, results, fields) {
            if (error) {
                console.log(error);
                return res.json({ "login": false });
            }
            console.log(results);
            if (results.length > 0) {
                req.session.loggedin = true;
                req.session.username = username;
                req.session.userid = results[0].id;
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

    socket.conn.on("upgrade", () => {
        const upgradedTransport = socket.conn.transport.name;
        console.log(upgradedTransport) // ws
    });


    //Serv court
    socket.on("connectpoke", async (id, nbroom) => {
        console.log(`nbchambre: ${nbroom}, id: ${id}`)
        await socket.join(`room${nbroom}`);



        io.to(`room${nbroom}`).emit(`connectpokenew`, id, nbroom);

    });

    socket.on("disconnect", () => {
        console.log("disconnect")
    });

    socket.on("discopoke", async (id, nbroom) => {
        console.log(`Disco: nbchambre: ${nbroom}, id: ${id}`)
        await io.to(`room${nbroom}`).emit(`discopokenew`, id, nbroom);
        await socket.leave(`room${nbroom}`);
    });

    socket.on("retablirjoueursserv", async (nbroom, username) => {
        io.to(`room${nbroom}`).emit(`retablirjoueursclient`, username);
    });

    socket.on("envoisi2player", async (nbroom, username,valpokemon) => {
        io.to(`room${nbroom}`).emit(`envoiepokemon`, username,valpokemon);
    });

    socket.on("lauchcombat", async (nbroom,username, givenname,vitesse) => {
        console.log("combat" + givenname)
        io.to(`room${nbroom}`).emit(`qqalancer`, username,givenname,vitesse);
    });

    socket.on("btncmbserv", async (nbroom,username,nompokemon) => {
      
        io.to(`room${nbroom}`).emit(`btncmb`, username,nompokemon);
    });


});
