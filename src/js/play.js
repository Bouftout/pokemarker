window.onload = function () {

    const loc = location.origin; // Avoir l'adresse du site sans /
    var socket = io(`${loc}`); // Connexion au serveur


    var input = document.getElementById('inputroom');
    var username = document.getElementById('usernames').innerText;
    const err = document.getElementById("err");
    quelpokemonatu(username);

    document.getElementById("joinroom").addEventListener('click', function (e) {
        e.preventDefault();
        if (input.value.length > 0 && input.value) {
            try {
                socket.emit('connectpoke', username, input.value);
                envoie(username);
            } catch (e) {
                console.log(e);
            } finally {
                document.getElementById("choixpokemon").setAttribute("style", "display: none");

                err.innerText = `Vous allez rejoindre la room ${input.value}`;
            }

        }
    });

    document.getElementById("quitroom").addEventListener('click', function (e) {
        e.preventDefault();
        if (input.value.length > 0 && input.value) {
            try {
                socket.emit('discopoke', username, input.value);
            } catch (e) {
                console.log(e);
            } finally {
                err.innerText = `Vous allez quittez la room ${input.value}`;
            }

        }
    });


    socket.on('connectpokenew', function (name, room) {
        let nbjoueurs = document.getElementById("nbjoueurs");
        nbjoueursinner = nbjoueurs.innerText;
        if (room && name) {
            nbjoueurs.innerText = Number(nbjoueurs.innerText) + Number(1);
            if (nbjoueursinner == 0) {
                err.innerText = `Vous avez rejoind la room ${room}`;
                err.style.color = "grey";
            } else {
                err.innerText = `${name} a rejoint la room ${room}`;
                err.style.color = "green";
            }
        }
    });

    var refreshIntervalId = setInterval(function () {
        let nbjoueurs = document.getElementById("nbjoueurs");
        nbjoueursinner = nbjoueurs.innerText;
        if (nbjoueursinner == 2) {
            clearInterval(refreshIntervalId);
            socket.emit('retablirjoueursserv', input.value, username);
        }
    }, 1000);

    socket.on('retablirjoueursclient', function (name) {
        let nbjoueurs = document.getElementById("nbjoueurs");
        nbjoueursinner = nbjoueurs.innerText;


        if (nbjoueursinner != 2) {
            nbjoueurs.innerText = Number(nbjoueurs.innerText) + Number(1);
            err.innerText = `Vous avez rejoind la room ${input.value} avec ${name}`;
            err.style.color = "green";
        }

    });




    socket.on('discopokenew', function (name, room) {
        let nbjoueurs = document.getElementById("nbjoueurs");
        nbjoueursinner = nbjoueurs.innerText;
        if (room && name) {
            nbjoueurs.innerText = Number(nbjoueurs.innerText) - Number(1);
            if (nbjoueursinner == 0) {
                err.innerText = `Vous avez quittez ${room}`;
            } else {
                err.innerText = `${name} a quittez la room ${room}`;
            }
        }
    });

    var envoisi2player = setInterval(function () {
        let nbjoueurs = document.getElementById("nbjoueurs");
        nbjoueursinner = nbjoueurs.innerText;
        if (nbjoueursinner == 2) {
            var select = document.getElementById('pokemon');
            var valsel = select.options[select.selectedIndex].value;
            socket.emit('envoisi2player', input.value, username, valsel);
        }
    }, 1000);

    var lefairequeunefois = true;

    socket.on('envoiepokemon', function (name, valpokemon) {
        clearInterval(envoisi2player);
        if (name != username && lefairequeunefois == true) {
           
            envoiepokemon2(valpokemon);
                lefairequeunefois = false;
            var select = document.getElementById('pokemon');
            var valsel = select.options[select.selectedIndex].value;
            socket.emit('envoisi2player', input.value, username, valsel);
            
        }
    });

};

async function quelpokemonatu(usernamefunc) {

    const loc = location.origin; // Avoir l'adresse du site sans /
    const settings = { // Paramètres de la requête
        method: 'GET',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
        }
    };
    const response = await fetch(`${loc}/get/${usernamefunc}/pokemon`, settings); // Requête
    if (response.status >= 200 && response.status <= 299) {
        let log = await response.json();
        console.log(log)
        if (log) {
            let select = document.createElement("select");
            select.setAttribute("id", "pokemon");
            select.setAttribute("name", "pokemon");
            for (let i = 0; i < log.length; i++) {
                let option = document.createElement("option");
                option.setAttribute("value", log[i].givenname);
                option.innerText = log[i].givenname;
                select.appendChild(option);
            }
            document.getElementById("choixpokemon").appendChild(select);
        } else {
            document.getElementById("err").innerText = "Vous n'avez pas de pokemon";
            document.getElementById("err").style.color = "red";
        }

    } else {
        // Handle errors
        console.log(response.status, response.statusText);
    }

}


async function envoie(valsel) {
    var username = document.getElementById('usernames').innerText;
    var select = document.getElementById('pokemon');
    var valsel = select.options[select.selectedIndex].value;
    console.log("valse1: " + valsel)

    const loc = location.origin; // Avoir l'adresse du site sans /
    const settings = { // Paramètres de la requête
        method: 'GET',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
        }
    };
    const response = await fetch(`${loc}/get/pokemon/${valsel}`, settings); // Requête
    if (response.status >= 200 && response.status <= 299) {
        let log = await response.json();
        console.log(log)
        log = log[0];
        console.log(log)
        if (log) {


            document.getElementById("p1username").innerText = log.username;

            document.getElementById("p1name").innerText = log.givenname;
            document.getElementById("p1name").style.color = "green";

            document.getElementById("p1nv").innerText = log.nv;
            document.getElementById("p1hp").innerText = log.pv;
            document.getElementById("p1atk").innerText = log.force;
            document.getElementById("p1def").innerText = log.def;
            document.getElementById("p1vitesse").innerText = log.vitesse;
            document.getElementById("p1spdatk").innerText = log.specialatt;
            document.getElementById("p1spddef").innerText = log.specialdef;
            //document.getElementById("type").innerText = log.type;

            if (log.username == username) {
                let btn = document.getElementById("btncombat");
                btn.innerText = `Lancer le combat ( ${username} )`;
                btn.setAttribute("onclick", `lancercombat(${log.id})`);
                btn.style.display = "block";
                document.getElementById("combat").appendChild(btn);
            }
        } else {
            document.getElementById("p1name").innerText = "Vous n'avez pas de pokemon";
            document.getElementById("p1name").style.color = "red";
        }

    } else {
        // Handle errors
        console.log(response.status, response.statusText);
    }

}

async function envoiepokemon2(valsel) {
    var username = document.getElementById('usernames').innerText;


    const loc = location.origin; // Avoir l'adresse du site sans /
    const settings = { // Paramètres de la requête
        method: 'GET',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
        }
    };
    const response = await fetch(`${loc}/get/pokemon/${valsel}`, settings); // Requête
    if (response.status >= 200 && response.status <= 299) {
        let log = await response.json();
        log = log[0];
        console.log("-----------------------")
        console.log(log)
        if (log) {
            document.getElementById("p2username").innerText = log.username;

            document.getElementById("p2name").innerText = log.givenname;
            document.getElementById("p2name").style.color = "green";

            document.getElementById("p2nv").innerText = log.nv;
            document.getElementById("p2hp").innerText = log.pv;
            document.getElementById("p2atk").innerText = log.force;
            document.getElementById("p2def").innerText = log.def;
            document.getElementById("p2vitesse").innerText = log.vitesse;
            document.getElementById("p2spdatk").innerText = log.specialatt;
            document.getElementById("p2spddef").innerText = log.specialdef;
            //document.getElementById("type").innerText = log.type;

            //Crée un button pour lancer le combat
            if (log.username == username) {
                let btn = document.getElementById("btncombat");
                btn.innerText = `Lancer le combat ( ${username} )`;
                btn.setAttribute("onclick", `lancercombat(${log.id})`);
                btn.style.display = "block";
                document.getElementById("combat").appendChild(btn);
            }
        } else {
            document.getElementById("p2name").innerText = "Vous n'avez pas de pokemon";
            document.getElementById("p2name").style.color = "red";
        }



    } else {
        // Handle errors
        console.log(response.status, response.statusText);
    }
}

async function calculdesdegat() {
    //Dégâts infligés = (((((((Niveau × 2 ÷ 5) + 2) × Puissance × Att[Spé] ÷ 50) ÷ Def[Spé]) × Mod1) + 2) × CC × Mod2 × R ÷ 100) × STAB × Type1 × Type2 × Mod3


}