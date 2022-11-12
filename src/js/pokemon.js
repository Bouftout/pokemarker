window.onload = function () {


getpokemon()

};

async function getpokemon() {

    let err = document.getElementById("err");
    const settings = { // Paramètres de la requête
        method: 'GET',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
        },
    };
    const response = await fetch(`/get/jsonpokemon`, settings); // Requête
    if (response.status >= 200 && response.status <= 299) {
        const log = await response.json();
 console.log(log)
        if (log.lenght > 0 && log != "Vous n'êtes pas connecté.") {
        const container = document.getElementById("container");

        const table = document.createElement("table");
        table.setAttribute("id", "table");
        table.setAttribute("class", "table");
        }else if(log.error === "Vous n'êtes pas connecté."){
            err.innerText = "Veuillez vous connecter";
            err.style.color = "red";
        }else{
            err.innerText = "Auncun pokemon";
            err.style.color = "red";
        }


    } else {
        // Handle errors
        console.log(response.status, response.statusText);
    }

};