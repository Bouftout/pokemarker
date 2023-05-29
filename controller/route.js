// route.js - route module.

const express = require("express");
const control = express.Router();

//Render la page accueil qui correspont donc a la page que l'utulisateur verra la 1ière fois qui viens sur le site
control.get('/', function (req, res) {
  res.render("index")
});

//Affichage de la page login si on pas connecté sinon on redirige vers l'accueil.
control.get("/login", (req, res) => {
  if (!req.session.loggedin) {
    res.render("login")
  } else {
    res.redirect('/')
  }
});

//Si il n'a pas de compte on affiche la page create.ejs sinon on redirige vers /pokémon
control.get("/create", (req, res) => {
  if (!req.session.loggedin) {
    res.render("create")
  } else {
    res.redirect('/pokemon')
  }
});

//Render la page pokémon,si on est connecté donner aussi l'username de l'utulisateur enregistrer dans la session
control.get("/pokemon", (req, res) => {
  console.log("[Pokemon] Session : ", req.session)
  if (!req.session.loggedin) {
    res.render("pokemon")
  } else {

    let usernames = req.session.username;

    res.render("pokemon", {
      username: usernames
    });
  }

});

//Page d'historique(affichage de tout les combat pokémon auparavant)
app.get("/historique", (req, res) => {
  res.render("historique")
});

//Page de déconnexion
app.get("/patchnote", (req, res) => {
  res.render("patchnote");
});



//Page de déconnexion
app.get("/logout", (req, res) => {

  if (req.session.loggedin) {
    req.cookies.token = undefined; // Détruire le token
    req.session.destroy(); // Détruire la session

    res.redirect("/login"); // rediriger vers /login(page de connexion)
  } else {
    res.redirect("/")
  }



});

module.exports = control;