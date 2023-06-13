window.onload = function () {


    getpokemon() // lancer la function pour alimenter le tableau depuis la bdd

    setInterval(function () { // Toute les 10s je relancer la function pour alimenter le tableau
        getpokemon()
    }, 30000);
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

    const response = await fetch(`/get/classement`, settings); // Requête
    if (response.status >= 200 && response.status <= 299) {
        const log = await response.json();
        console.log(log)

        let alldiv = document.getElementById("alldiv");
        if (log.length > 0) {
            alldiv.style.display = "block";
            err.style.fontSize = "20px"
            creertable(log)

        } else {
            alldiv.style.display = "none";
            err.innerText = "Il n'y a aucun historique de combat !";
            err.style.fontSize = "50px"
            err.style.color = "red";
        }


    } else {
        if (response.status == 503) {
            alldiv.style.display = "none";
            err.innerText = "Il n'y a aucun historique de combat";
            err.style.fontSize = "50px"
            err.style.color = "red";
            // alert("Pokémon en maintenance !")
            // window.history.go(-1)
        }
        // Handle errors
        console.log(response.status, response.statusText);
    }

};


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
    var allname = ["Nom du compte", "Nombre de victoire"];

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

        try {
            tr.appendChild(createtd(log[i].username));
            tr.appendChild(createtd(log[i].nbvictoire));

        } catch (e) {
            console.log(e)
        }




        tbody.appendChild(tr);
    }

    tablediv.appendChild(table);
}