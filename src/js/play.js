window.onload = function () {



    const loc = location.origin; // Avoir l'adresse du site sans /
    var socket = io(`${loc}`); // Connexion au serveur

    var roominput = document.getElementById('inputroom');
    var username = document.getElementById('usernames').innerText; // Get le span ou est situé ton username de base : grâce a l'ejs.
    const err = document.getElementById("err");

    socket.onclose = function () {

        this.emit('disconnecting'); //<--insert the new event here
        this.leaveAll();

        this.emit('disconnect');
    };

    quelpokemonatu(username) // Start la fonction de quel pokemon tu dispose par rapport a ton username

    //Vitesse est une chose pour voir lequel commence son tour
    // (Force +evforce) - (Defense + evDefense) 

    socket.on('newplayer', function (namerooms, nbserv) {
        console.log(`[socket] Newplayer ${namerooms}`)
        document.getElementById("err").innerText = `Nom de la salle : ${namerooms}`;


        let nbplayer = document.getElementById("nbjoueurs")
        nbplayer.innerText = Number(nbserv)

        if (Number(nbplayer.innerText) == "2" || Number(nbplayer.innerText) == 2) {
            var select = document.getElementById('pokemon');
            let pokename = select.options[select.selectedIndex].value
            try {
                //Afficher le pokémon du joueurs concerner en récuper ce que il a choisi dans le select de choix du pokémon(caché après que la room soit choisi)
                console.log(`Nom pokémon: ${pokename}`)
                envoiepokemon(pokename)
            } catch (e) {
                console.log(e)
            } finally {
                socket.emit("sendpoke", roominput.value, pokename) //Envoyer son pokémon au autre joueurs de la page pour que il soit afficher de leur côté;

            }

        }
    });

    socket.on('recevoirpoke', async function (namepoke) {

        try {
            await envoiepokemon2(namepoke)
        } catch (e) {
            console.error(e);
        } finally {
            console.log("[Fight] Fight started !")

            var p1vitesse = document.getElementById("p1vitesse").innerText;
            var p2vitesse = document.getElementById("p2vitesse").innerText;

            var p1atk = document.getElementById("p1atk").innerText;
            var p2atk = document.getElementById("p2atk").innerText;

            var p1def = document.getElementById("p1def").innerText;
            var p2def = document.getElementById("p2def").innerText;




            var ggqui = null;

            if (p1vitesse > p2vitesse) {
                ggqui = "p1"
            } else if (p1vitesse < p2vitesse) {
                ggqui = "p2"
            }
            // else {
            //     alert("Un random va commencer pour savoir qui va commencer")

            //     let rand = Math.floor(Math.random())

            //     if (rand == 1) {
            //         ggqui = "p1"
            //     } else {
            //         ggqui = "p2"
            //     }

            // }
            let nIntervId;
            
            nIntervId = setInterval(fighto, 500);

            function fighto() {
                let p1hp = document.getElementById("p1hp");
                let p2hp = document.getElementById("p2hp");
    
                if (p1hp.value <= 0 || p2hp.value <= 0) {
                    console.log("Clear interval")
                    clearInterval(nIntervId)
                    nIntervId = null;
                    if(p1hp.value > 0){
                        alert(`${document.getElementById("p1username").innerText} a gagnée`)
                    }
                    if(p2hp.value > 0){
                        alert(`${document.getElementById("p2username").innerText} a gagnée`)
                    }
                }else {
                    console.log("[Fight] " + username + " play !")
                    if (ggqui == "p1") {
                        // console.log("[Fight] " + (Number(p1hp.value) - (Number(p1atk) / Number(p2def))) + " attack !");
                        p1hp.value = Number(p1hp.value) - (Number(p1atk) / Number(p2def));
                        ggqui = "p2";
                        
                    } else {
                        // console.log("[Fight] " + (Number(p2hp.value) - (Number(p2atk) / Number(p1def))) + " attack !")
                        p2hp.value = Number(p2hp.value) - (Number(p2atk) / Number(p1def));
                        ggqui = "p1";
                    }

                }

            }







        }



    })

    socket.on('discopoke', function (socketuser) {
        alert(`L'utulisateur ${socketuser} à était déconnecter`)
        roominput.value = Number(roominput.value) - Number(1);
    })


    document.getElementById("joinroom").addEventListener('click', function (e) {
        let roominput = document.getElementById("inputroom")
        e.preventDefault();
        if (roominput.value.length > 0 && roominput.value) {
            try {
                socket.emit('connectpoke', roominput.value)
            } catch (e) {
                console.log(e);
            } finally {
                document.getElementById("choixpokemon").setAttribute("style", "display: none");
                document.getElementById("divroom").setAttribute("style", "display: none");

                err.innerText = `Vous allez rejoindre la room N°${roominput.value}`;

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
    // var select = document.getElementById('pokemon');
    // var valsel = select.options[select.selectedIndex].value;
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
    console.log(`[Get] Demande de ${valsel}`)

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

        } else {
            document.getElementById("p2name").innerText = "Vous n'avez pas de pokemon";
            document.getElementById("p2name").style.color = "red";
        }



    } else {
        // Handle errors
        console.log(response.status, response.statusText);
    }
}

