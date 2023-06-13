window.onload = function () {


    getpokemon() // lancer la function pour alimenter le tableau depuis la bdd

    setInterval(function () { // Toute les 10s je relancer la function pour alimenter le tableau
        getpokemon()
    }, 30000);


    //Pour afficher la popup de tout les ev(stat caché) des pokemon
    document.getElementById("getallevbtn").addEventListener('click', function (e) {

        //el est la pop up on la rafiche donc
        var el = document.getElementById('popev');
        el.style.display = 'block';

        // Dans la tablea ev supprimer ses classe
        const tableev = document.getElementById("tableev");
        (tableev.firstElementChild.firstChild.firstChild).setAttribute("class", "")

    })

};


function dquery(selector) {
    // Renvoie un tableau des éléments correspondant au sélecteur
    return Array.prototype.slice.call(document.querySelectorAll(selector));
}

//Search dans le tableau designé par la classe
function searchname() {
    const tableev = dquery("tbody")[0]
    const poketable = dquery("tbody")[1]

    var tdtag = (poketable.firstElementChild).getElementsByTagName('td');
    //Parcours toute la liste des td du tableau de pokemon
    for (var i = 0; i < tdtag.length; i++) {

        let txt = tdtag[i].textContent || tdtag[i].innerText;
        let input = document.getElementById("input").value;
        // console.log(`Le texte du tableau : ${txt}\nLe texte de l'intput ${document.getElementById("input").value}`)

        if (input === "" || input === undefined) {
            tdtag[i].style.fontWeight = "normal";
        } else {

            if (txt.search(input)) {
                //Lorsque une partie du mot n'est pas présente
                tdtag[i].style.fontWeight = "normal";
            } else {
                //Lorsque une partie du mot est bien présente
                tdtag[i].style.fontWeight = "900";
            }

        }

    }

}

function searchnameonev(id) {
    const tableev = dquery("tbody")[0]

    for (let i = 0; i < tableev.getElementsByTagName("tr").length; i++) {

        if (tableev.getElementsByTagName('tr')[i].getElementsByTagName("td")[0].innerText != id) {
            tableev.getElementsByTagName('tr')[i].remove()
        }

    }

}



function createth(text, nb) {
    const th = document.createElement("th");
    th.setAttribute("scope", "col");
    th.setAttribute("id", nb);
    th.innerText = text;
    return th;
}

function createtd(text) {
    const td = document.createElement("td");
    td.innerText = text;
    return td;
}

var popupactive = false;

async function getpokemon() {

    let err = document.getElementById("err");
    const settings = { // Paramètres de la requête
        method: 'GET',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
        },
    };

    const response = await fetch(`/get/pokemon`, settings); // Requête
    if (response.status >= 200 && response.status <= 299) {
        const log = await response.json();
        console.log(log)

        let alldiv = document.getElementById("alldiv");
        if (log.length > 0) {
            alldiv.style.display = "block";
            err.style.fontSize = "20px"
            creertable(log)
            if (!popupactive) {
                createev(log)
            }

        } else {
            alldiv.style.display = "none";
            err.innerText = "Il n'y a aucun pokemon ajouter pour l'instant !";
            err.style.fontSize = "50px"
            err.style.color = "red";
        }


    } else {
        if (response.status == 503) {
            alldiv.style.display = "none";
            err.innerText = "Il n'y a aucun pokemon ajouter pour l'instant !\nVeuillez en rajouter pour voir un tableau !";
            err.style.fontSize = "50px"
            err.style.color = "red";
            // alert("Pokémon en maintenance !")
            // window.history.go(-1)
        }
        // Handle errors
        console.log(response.status, response.statusText);
    }

};

function createev(log) {
    const table = document.createElement("table");
    const tablediv = document.getElementById("pdivev");
    tablediv.innerHTML = "";
    table.setAttribute("id", "tableev");
    table.setAttribute("class", "table");
    const thead = document.createElement("thead");
    const tr = document.createElement("tr");

    var allname = ["id", "Vitesse", "Spécial Attaque", "Spécial Défense", "Défense", "Attaque", "P.V"];

    for (let i = 0; i < allname.length; i++) {
        tr.appendChild(createth(allname[i], "thev" + i));
    }
    thead.appendChild(tr);
    table.appendChild(thead);


    const tbody = document.createElement("tbody");
    tbody.setAttribute("id", "tbody");
    table.appendChild(tbody);

    for (let i = 0; i < log[0].length; i++) {
        const tr = document.createElement("tr");

        console.log("createev", log[1])

        try {
            let nbskip = 7 * log[0].length;
            tr.appendChild(createtd(log[0][i].id));
            for (let b = nbskip; b < (log[1].length); b++) {

                if (log[0][i].id == log[1][b].id_pokemon) {

                    tr.appendChild(createtd(log[1][b].valeur))


                }

            }

            tbody.appendChild(tr);
        } catch (e) {
            console.log(e)
        }

    }

    //Button close
    const button = document.createElement("button");
    button.setAttribute("id", "cev");
    button.setAttribute("style", "width: 100%; height: 100%;");
    button.innerText = "Close";
    button.setAttribute("onclick", "closepopup();");

    tablediv.appendChild(table);

    tablediv.appendChild(button);
}

//Créer la tablea concerner avec l'argument pour le remplir !
function creertable(log) {
    const table = document.createElement("table");
    const tablediv = document.getElementById("tablediv");
    tablediv.innerHTML = "";
    table.setAttribute("id", "table");
    table.setAttribute("class", "table");
    const thead = document.createElement("thead");
    const tr = document.createElement("tr");

    //Tout les nom en haut du tableau(dans le head)
    var allname = ["Pokedex", "Nom Du pokémon", "Niveau", "Surnom", "Description", "Créateur", "Pv", "Force", "Defense", "Vitesse", "Spécial Attaque", "Spécial Défense", "Iv", "Nature", "EV", "Supression"];

    for (let i = 0; i < allname.length; i++) {
        tr.appendChild(createth(allname[i], i));
    }
    thead.appendChild(tr);
    table.appendChild(thead);


    //Tout ce qui a dans le tbody
    const tbody = document.createElement("tbody");
    tbody.setAttribute("id", "tbody");
    table.appendChild(tbody);

    //On fait une boucle de l'arguement pour remplir le tableau
    for (let i = 0; i < log[0].length; i++) {
        const tr = document.createElement("tr");

        try {
            tr.appendChild(createtd(log[0][i].id));
            tr.appendChild(createtd(log[0][i].name));
            tr.appendChild(createtd(log[0][i].nv));
            tr.appendChild(createtd(log[0][i].surnom));
            tr.appendChild(createtd(log[0][i].description));
            tr.appendChild(createtd(log[0][i].username));

            for (let b = 0; b < (log[1].length); b++) {

                if (log[0][i].id == log[1][b].id_pokemon && log[1][b].namestat != 'evvitesse' && log[1][b].namestat != 'evspeatt' && log[1][b].namestat != 'evspedef' && log[1][b].namestat != 'evdef' && log[1][b].namestat != 'evatt' && log[1][b].namestat != 'evpv') {

                    tr.appendChild(createtd(log[1][b].valeur))


                }
            }


            tr.appendChild(createtd(log[0][i].natur));

        } catch (e) {
            console.log(e)
        }

        //Création du bouton de ev
        const td1 = document.createElement("td");
        const button1 = document.createElement("button");
        button1.setAttribute("class", "button");
        button1.setAttribute("onclick", `openpopup(${log[0][i].id});`);
        button1.innerText = "EV";
        td1.appendChild(button1);
        tr.appendChild(td1);

        // Création du bouton pour delete
        const td = document.createElement("td");
        const button = document.createElement("button");
        button.setAttribute("class", "button");
        button.setAttribute("onclick", "deletepokemon(" + log[0][i].id + ")");
        button.innerText = "Delete";
        td.appendChild(button);
        tr.appendChild(td);


        tbody.appendChild(tr);
    }

    tablediv.appendChild(table);
}


//Fonction activée lors du click du bouton delete
async function deletepokemon(id) {



    let err = document.getElementById("err");
    const settings = { // Paramètres de la requête
        method: 'DELETE',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
        },
    };

    const response = await fetch(`/delete/${id}/pokemon/`, settings); // Requête
    if (response.status >= 200 && response.status <= 299) {
        const resjson = await response.json();
        console.log(resjson)
        if (resjson.delete == true) {
            err.innerText = "Votre pokémon a bien était supprimé."; //Confirmation de suppression
            err.style.color = "green";
            setTimeout(function () {
                getpokemon();
            }, 1000);

        } else if (resjson.delete == false) {
            err.innerText = "Ce pokemon ne vous appartient pas.";
            err.style.color = "red";
        } else if (resjson.delete == "doncconnect") { //Si le serveur retourner que tu n'es pas connecter
            err.innerText = "Vous devez être connecté pour supprimer un pokemon.";
            err.style.color = "red";
        } else {
            err.innerText = "Erreur lors de la supression";
            err.style.color = "red";
        }
    } else {
        err.innerText = "Vous devez être connecté pour supprimer un pokemon.";
        err.style.color = "red";
    }
}

//Ouvrir la popup avec des argument qui corresponde
function openpopup(popev) {
    try {
        var el = document.getElementById('popev');
        el.style.display = 'block';
        console.log("Id de la popup ouvert: " + popev);


    } catch (e) {
        console.log(e);
    } finally {
        searchnameonev(popev)
    }

}

//Fermer popup ev
function closepopup() {
    var el = document.getElementById('popev');
    el.style.display = 'none';
}