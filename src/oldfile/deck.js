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


async function getpokemon() {

    let err = document.getElementById("err");
    const settings = { // Paramètres de la requête
        method: 'GET',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
        },
    };

    const response = await fetch(`/get/deck`, settings); // Requête
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
            err.innerText = "Il n'y a aucun deck disponible";
            err.style.fontSize = "50px"
            err.style.color = "red";
        }


    } else {
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
    var allname = ["ID", "idacc", "idpok", "nbdeck","Création"];

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

        tr.appendChild(createtd(log[i].id));
        tr.appendChild(createtd(log[i].idacc));
        tr.appendChild(createtd(log[i].idpok));
        tr.appendChild(createtd(log[i].nbdeck));
        tr.appendChild(createtd(log[i].dates));




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
    } else {
        err.innerText = "Vous devez être connecté pour supprimer un pokemon.";
        err.style.color = "red";
    }
}

//Ouvrir la popup avec des argument qui corresponde
function openpopup(numero, idacc) {
    console.log("[Info] Open PopUp")
    try {
        document.getElementById('popev').style.display = 'block';

    } catch (e) {
        console.log(e);
    } finally {

    }


}

//Fermer popup ev
function closepopup() {
    var el = document.getElementById('popev');
    el.style.display = 'none';
}