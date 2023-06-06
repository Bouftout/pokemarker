window.onload = function () {


    getpokemon()

    setInterval(function () {
        //  getpokemon()
    }, 10000);

};




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

    const response = await fetch(`/get/user/pokemon`, settings); // Requête
    if (response.status >= 200 && response.status <= 299) {
        const log = await response.json();
        console.log(log)

        if (log.length > 0) {
            creertable(log)
        } else {
            err.innerText = "Auncun pokemon";
            err.style.color = "red";
        }


    } else {
        // Handle errors
        console.log(response.status, response.statusText);
    }

};



function creertable(log) {
    const table = document.createElement("table");
    const tablediv = document.getElementById("tablediv");
    tablediv.innerHTML = "";
    table.setAttribute("id", "table");
    table.setAttribute("class", "table");
    const thead = document.createElement("thead");
    const tr = document.createElement("tr");

    var allname = ["Pokedex", "Nom Du pokémon", "Surnom", "CheckBox"];

    for (let i = 0; i < allname.length; i++) {
        tr.appendChild(createth(allname[i], i));
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
        let checkbox = document.createElement("input")
        checkbox.type = "checkbox";
        checkbox.id = `check${log[i].id}`
        checkbox.name = "check";
        if (log[i].id_equipe == log[i].id) {
            checkbox.checked = true;
        } else {
            checkbox.checked = false;
        }
        tr.appendChild(checkbox)



        tbody.appendChild(tr);
    }

    tablediv.appendChild(table);
}


async function envoiedeck() {


    let err = document.getElementById("err");
    let nbofcheckok = 0;
    var data = [];

    let tr = document.getElementsByTagName("tr"); // recupere tout les ligne

    for (i = 1; i <= Number(tr.length - 1); i++) {

        let checkbox = (tr[i].querySelectorAll('input[type=checkbox]')[0].checked)


        if(checkbox != null){
            console.log(checkbox)
            if(checkbox){

                data.push(tr[i].getElementsByTagName("td")[0].innerText)
                // console.log("deckconsole",document.getElementById(`check${i}`).previousElementSibling.previousElementSibling.previousElementSibling.innerText)
                nbofcheckok++;
            }
        }

    }
    if (nbofcheckok <= 6) {

        console.log("JsonData", JSON.stringify(data))

        const settings = { // Paramètres de la requête
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        };

        const response = await fetch(`/create/deck`, settings); // Requête

        if (response.status >= 200 && response.status <= 299) {
            // const log = await response.json();

            alert("Envoie du deck a la bdd")

        } else {
            // Handle errors
            console.log(response.status, response.statusText);
        }

    } else {
        alert("Vous devez choisir 6 pokemon ou moins pour la rajouter dans votre equipe.")
    }



}