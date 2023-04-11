window.onload = function () {

    //Systeme de recherche
    document.addEventListener('click', function (e) {

        e = e || window.event;
        if (e.target || e.target.id == 'th') {
            var target = e.target || e.srcElement,
                text = target.textContent || target.innerText;

            var scope = target.getAttribute('scope');
            if (scope == "col" && scope != null && scope != undefined && text != "Supression") {
                try {
                    document.querySelectorAll("th").forEach(function (element) {
                        console.log("click")
                        element.setAttribute("class", "")
                    });

                    target.setAttribute("class", "actifsearch")
                } catch (e) {
                    console.log(e)
                } finally {
                    // searchname();

                }


            }
        }

    }, false);


    getpokemon() // lancer la function pour alimenter le tableau depuis la bdd

    setInterval(function () { // Toute les 10s je relancer la function pour alimenter le tableau
        getpokemon()
    }, 10000);


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

//Searcger un nom avec comme arguement le filtre et la  table
function searchname(filter, autretable) {


    document.querySelectorAll("th").forEach(function (element) {

        const classe = element.getAttribute("class");
        var idelement = element.getAttribute("id");

        if (classe != "" && classe != null && classe != undefined && classe == "actifsearch") {
            // Declare variables
            var input, table, tr, td, i, txtValue;
            input = document.getElementById("input");
            if (filter == null || filter == undefined || filter == "") {
                filter = input.value;
            }
            if (autretable == "ev") {
                table = document.getElementById("tableev");
                idelement = 0;
            } else if (autretable == "evall") {
                table = document.getElementById("tableev");
            } else {
                table = document.getElementById("table");
            }
            tr = table.getElementsByTagName("tr");
            // Loop through all table rows, and hide those who don't match the search query
            for (i = 0; i < tr.length; i++) {
                td = tr[i].getElementsByTagName("td")[idelement];
                if (td) {
                    txtValue = td.textContent || td.innerText;
                    console.log("txtvalue")
                    if (txtValue == filter) {
                        tr[i].style.display = "";
                    } else {
                        tr[i].style.display = "none";
                    }


                }
            }

        }

    });


}



function createth(text, nb) {
    const th = document.createElement("th");
    th.setAttribute("scope", "col");
    th.setAttribute("id", nb);
    if (nb == 1) {
        th.setAttribute("class", "actifsearch");
    }

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
            if(!popupactive){
                createev(log)
            }
            
        } else {
            alldiv.style.display = "none";
            err.innerText = "Il n'y a aucun pokemon ajouter pour l'instant !";
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

    var allname = ["id", "Vitesse", "Spécial Attaque", "Spécial Défense", "Défense", "Attaque", "P.V"];

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
        tr.appendChild(createtd(log[i].evvitesse));
        tr.appendChild(createtd(log[i].evspeatt));
        tr.appendChild(createtd(log[i].evspedef));
        tr.appendChild(createtd(log[i].evdef));
        tr.appendChild(createtd(log[i].evatt));
        tr.appendChild(createtd(log[i].evpv));
        //<button id="cev">Close</button>
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
    var allname = ["Pokedex", "Nom Du pokémon", "Niveau", "Surnom", "Créateur", "Pv", "Force", "Defense", "Vitesse", "Spécial Attaque", "Spécial Défense", "Iv", "Nature", "EV", "Supression"];

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

        console.log(log[i])

        tr.appendChild(createtd(log[i].id));
        tr.appendChild(createtd(log[i].name));
        tr.appendChild(createtd(log[i].nv));
        tr.appendChild(createtd(log[i].surnom));


        //Création du bouton de ev
        const td1 = document.createElement("td");
        const button1 = document.createElement("button");
        button1.setAttribute("class", "button");
        button1.setAttribute("onclick", `openpopup(${log[i].id});`);
        button1.innerText = "EV";
        td1.appendChild(button1);
        tr.appendChild(td1);

        // Création du bouton pour delete
        const td = document.createElement("td");
        const button = document.createElement("button");
        button.setAttribute("class", "button");
        button.setAttribute("onclick", "deletepokemon(" + log[i].id + ")");
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
    }else {
        err.innerText = "Vous devez être connecté pour supprimer un pokemon.";
        err.style.color = "red";
    }
}

//Ouvrir la popup avec des argument qui corresponde
function openpopup(popev) {
    console.log("OPe")
    try {
        var el = document.getElementById('popev');
        el.style.display = 'block';
        console.log(popev);

        const tableev = document.getElementById("tableev");
        (tableev.firstElementChild.firstChild.firstChild).setAttribute("class", "actifsearch")

    } catch (e) {
        console.log(e);
    } finally {
        searchname(popev, "ev") // Recherche le pokemon par son id et affiche les ev du pokemon grâce à la fonction searchname.
    }


}

//Fermer popup ev
function closepopup() {
    var el = document.getElementById('popev');
    el.style.display = 'none';
}