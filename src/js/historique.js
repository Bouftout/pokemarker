window.onload = function () {


    getpokemon() // lancer la function pour alimenter le tableau depuis la bdd

};


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


async function getpokemon() {

    let err = document.getElementById("err");
    const settings = { // Paramètres de la requête
        method: 'GET',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
        },
    };

    const response = await fetch(`/get/historique`, settings); // Requête
    if (response.status >= 200 && response.status <= 299) {
        const log = await response.json();
        console.log(log)
        let alldiv = document.getElementById("alldiv");
        if (log.length > 0) {
            alldiv.style.display = "block";
            err.style.fontSize = "20px"
            creertable(log)
            // createev(log)
        } else {
            alldiv.style.display = "none";
            err.innerText = "Il n'y a aucun historique de combat disponible";
            err.style.fontSize = "50px"
            err.style.color = "red";
        }


    } else {
        // Handle errors
        console.log(response.status, response.statusText);
    }

};

async function getpokemonforbtn(numero,idacc) {

    let err = document.getElementById("err");
    const settings = { // Paramètres de la requête
        method: 'GET',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
        },
    };

    const response = await fetch(`/get/histo/pokemon/${numero}/${idacc}`, settings); // Requête
    if (response.status >= 200 && response.status <= 299) {
        const log = await response.json();
        console.log(log)
        let alldiv = document.getElementById("pdivev");
        if (log.length > 0) {
            alldiv.style.display = "block";
            err.style.fontSize = "20px"
            createev(log)
            // createev(log)
        } else {
            alldiv.style.display = "none";
            err.innerText = "Bug for start ev";
            err.style.fontSize = "50px"
            err.style.color = "red";
        }


    } else {
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

    var allname = ["Pokedex", "Nom Du pokémon", "Nom données", "Appartient"];

    for (let i = 0; i < allname.length; i++) {
        tr.appendChild(createth(allname[i], "thev" + i));
    }
    thead.appendChild(tr);
    table.appendChild(thead);


    const tbody = document.createElement("tbody");
    tbody.setAttribute("id", "tbody");
    table.appendChild(tbody);

    for (let i = 0; i < log.length; i++) {
        const tr = document.createElement("tr");

        tr.appendChild(createtd(log[i].id));
        tr.appendChild(createtd(log[i].name));
        tr.appendChild(createtd(log[i].surnom));
        tr.appendChild(createtd(log[i].username));

        tbody.appendChild(tr);
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
    var allname = ["Pokémon 1","Pokémon 2","pvwinner","vainqueur","perdant"];

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
    for (let i = 0; i < log.length; i++) {
        const tr = document.createElement("tr");

        //Création du bouton de stats pokémon
        const td1= document.createElement("td");
        const button1 = document.createElement("button");
        button1.setAttribute("class", "button");
        button1.setAttribute("onclick", `openpopup(${log[i].idpok1},1);`);
        button1.innerText = `N°${log[i].idpok1}`;
        td1.appendChild(button1);
        tr.appendChild(td1);

        const td = document.createElement("td");
        const button = document.createElement("button");
        button.setAttribute("class", "button");
        button.setAttribute("onclick", `openpopup(${log[i].idpok2},2);`);
        button.innerText = `N°${log[i].idpok2}`;
        td.appendChild(button);
        tr.appendChild(td);

        tr.appendChild(createtd(log[i].pvrestant));
        tr.appendChild(createtd(log[i].uservainqueur));

        tr.appendChild(createtd(log[i].id_perdant));


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

    const response = await fetch(`/delete/${id}/historique/`, settings); // Requête
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
    }else {
        err.innerText = "Vous devez être connecté pour supprimer un pokemon.";
        err.style.color = "red";
    }
}

//Ouvrir la popup avec des argument qui corresponde
function openpopup(numero,idacc) {
    console.log("[Info] Open PopUp")
    try {
        document.getElementById('popev').style.display = 'block';

    } catch (e) {
        console.log(e);
    } finally {
        
        getpokemonforbtn(numero,idacc)
    }


}

//Fermer popup ev
function closepopup() {
    var el = document.getElementById('popev');
    el.style.display = 'none';
}