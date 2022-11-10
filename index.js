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
function renderpage(name, req, res) {
    if (req.session.loggedin) {
        let usernames = req.session.username;

        res.render(name, {
            username: usernames
        });
    } else {
        res.redirect("/login");
    }
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
    res.render("login")
});
app.get("/create", (req, res) => {
    res.render("create")
});

function validate(string) {
    return validator.escape(string);
}



// Création de compte :
app.post('/create', function (req, res) {
    console.log(req.body)
        //Vérification de la sécurité de l'entrée utilisateur avec validator.
        let email = validate(req.body.email);
        if (email == "" || !email || email == null || email == undefined) {
            email = NULL // si le email est vide ou n'existe pas, on lui donne un email NULL pour éviter les erreurs.
        }
        let username = validate(req.body.username);
        let password = hash3(req.body.password); //hashage du mot de passe
    
    
        // Vérification de l'existence du compte
        if (username && password) { // si les champs sont remplis
            //Exemple d'insertion sql : INSERT INTO `accounts` (`id`, `username`, `password`, `highscore1`) VALUES (1, 'test', 'test', 0);
            connection.query(`INSERT INTO \`accounts\`(\`username\`, \`password\`, \`email\`) VALUES (?,?,?)`,[username,password,email],function (error, results, fields) {
                // If there is an issue with the query, output the error
                if (error) {
                    console.log(error);
                    return res.json({ "create": `${err}` })
                }
                if (results.protocol41 == true) { // Si le compte existe déjà on enregistre son username dans la session, et fait que il soit loggé.
                    req.session.loggedin = true;
                    req.session.username = username;
                    // redirection vers la page de jeu
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