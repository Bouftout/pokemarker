window.onload = function () {

    const loc = location.origin; // Avoir l'adresse du site sans /
    var socket = io(`${loc}`); // Connexion au serveur

    var roominput = document.getElementById('inputroom');
    var username = document.getElementById('usernames').innerText; // Get le span ou est situé ton username de base : grâce a l'ejs.
    const err = document.getElementById("err");

    quelpokemonatu(username) // Start la fonction de quel pokemon tu dispose par rapport a ton username

    //Vitesse est une chose pour voir lequel commence son tour
    // (Force +evforce) - (Defense + evDefense) 


    socket.on('newplayer', function (nbplayer) {
        console.log(nbplayer)
        document.getElementById("nbjoueurs").innerText = nbplayer;

    });


    document.getElementById("joinroom").addEventListener('click', function (e) {
        e.preventDefault();
        if (roominput.value.length > 0 && roominput.value) {
            try {
                socket.emit('connectpoke',roominput.value)
            } catch (e) {
                console.log(e);
            } finally {
                document.getElementById("choixpokemon").setAttribute("style", "display: none");
                document.getElementById("divroom").setAttribute("style", "display: none");
                
                err.innerText = `Vous allez rejoindre la room ${roominput.value}`;
            }

        }
    });


}



async function quelpokemonatu(usernamefunc) {

    const loc = location.origin; // Avoir l'adresse du site sans /
    const settings = { // Paramètres de la requête
        method: 'GET',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
        }
    };
    const response = await fetch(`${loc}/get/${usernamefunc}/pokemon`, settings); // Requête qui donne par rapport a un nom tout les pokemon a ça disposition
    if (response.status >= 200 && response.status <= 299) { // Si la requete il n'y a pas d'erreur

        let data = await response.json(); //Le retour json de la requete

        if (data) {

            let select = document.createElement("select"); //Création d'un select
            select.setAttribute("id", "pokemon"); // Set id a "pokemon"
            select.setAttribute("name", "pokemon"); // Set name a "pokemon"
            for (let i = 0; i < data.length; i++) { // Boucle qui se fait par le nombre de pokemon a disposition dans le "data"

                let option = document.createElement("option");
                option.setAttribute("value", data[i].givenname);
                option.innerText = data[i].givenname;
                select.appendChild(option);

            }

            document.getElementById("choixpokemon").appendChild(select); //Ajout a la div "choixpokemon" le select qui dispose tout les pokemon du joueurs

            //Crée pour confirmer le choix (MANQUANT)


        } else {
            document.getElementById("err").innerText = "Vous n'avez pas de pokemon";
            document.getElementById("err").style.color = "red";
        }

    } else {
        // Si erreur niveau serveur
        console.log(response.status, response.statusText);
    }

}


async function envoiepokemon(valsel) {
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
            document.getElementById("pokemonp1").style.display = "block";

            document.getElementById("p1username").innerText = log.username;

            document.getElementById("p1name").innerText = log.givenname;
            document.getElementById("p1name").style.color = "green";

            document.getElementById("p1nv").innerText = log.nv;
            const hp = document.getElementById("p1hp")
            hp.setAttribute("value", log.pv);
            hp.setAttribute("max", log.pv);

            document.getElementById("p1atk").innerText = log.forcer;
            document.getElementById("p1def").innerText = log.def;
            document.getElementById("p1vitesse").innerText = log.vitesse;
            document.getElementById("p1spdatk").innerText = log.specialatt;
            document.getElementById("p1spddef").innerText = log.specialdef;
            //document.getElementById("type").innerText = log.type;


            if (log.username == username) {
                startfight()
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
            document.getElementById("pokemonp2").setAttribute("class", "block")

            document.getElementById("p2username").innerText = log.username;

            document.getElementById("p2name").innerText = log.givenname;
            document.getElementById("p2name").style.color = "green";

            document.getElementById("p2nv").innerText = log.nv;
            const hp = document.getElementById("p2hp")
            hp.setAttribute("value", log.pv);
            hp.setAttribute("max", log.pv);

            document.getElementById("p2atk").innerText = log.forcer;
            document.getElementById("p2def").innerText = log.def;
            document.getElementById("p2vitesse").innerText = log.vitesse;
            document.getElementById("p2spdatk").innerText = log.specialatt;
            document.getElementById("p2spddef").innerText = log.specialdef;
            //document.getElementById("type").innerText = log.type;

            //Crée un button pour lancer le combat
            if (log.username == username) {
                startfight()
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
function startfight(){

}