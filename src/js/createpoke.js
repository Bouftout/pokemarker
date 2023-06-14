window.onload = function () {

    var name = document.getElementById("name");

    document.getElementById("form").addEventListener("submit", function (e) {
        e.preventDefault();
        formenvoie(name);

    });

    document.getElementById("totmaxstat").innerText = totmax;
    document.getElementById("maxstat").innerText = max;
}

//Formulaire d'envoie
async function formenvoie(pokename) {

    var newpokename = document.getElementById("name");

    if (pokename != newpokename) {

        alert("Vous avez changer le nom du pokémon");
        newpokename.value = pokename;

    } else {

        const formdata = new FormData(form);
        const data = Object.fromEntries(formdata.entries());
        let datajson = JSON.stringify(data);
        console.log("[JsonData]", datajson);
        let err = document.getElementById("err");

        const settings = { // Paramètres de la requête
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
            },
            body: datajson, //Envoie tout le formulaire
        };

        const response = await fetch(`/create/pokemon`, settings); // Requête

        if (response.status >= 200 && response.status <= 299) {
            const log = await response.json();
            if (log.create === true) {

                window.location.href = `/pokemon`;

            } else if (log.create === false) {
                err.innerText = "Erreur lors de la création du pokemon(Champs manquant ou invalide)";
                err.style.color = "red";
            } else if (log.create == "dontconnect") {
                err.innerText = "Veuillez vous connecter !";
                err.style.color = "red";
            } else {
                err.innerText = "Erreur inconnue : " + log.create;
                err.style.color = "red";
                console.log("Erreur");
            }



        } else {
            // Handle errors
            console.log(response.status, response.statusText);
            err.innerText = `Erreur ${response.status}`;
        }

    }

}

const max = 100;
const totmax = 250;

function maxstat() {
    let contpoint = document.getElementById("contpoint");
    let form = document.getElementById("form");

    let nb = 0;

    // for (i = 0; i < (form.getElementsByTagName("input")).length; i++) {
    //     let iftypenb = (form.getElementsByTagName("input")[i].getAttribute("type") == "number");
    //     if (iftypenb == true && Number(form.getElementsByTagName("input")[i].value) != 0) {
    //         console.log("NUMBER: " + nb);



    //         //&& ((Number(form.getElementsByTagName("input")[i].value) + nb) <= max)
    //         if (Number(form.getElementsByTagName("input")[i].value) <= max && nb <= totmax && Number(form.getElementsByTagName("input")[i].value) >= 0 && nb >= 0 && ((Number(form.getElementsByTagName("input")[i].value) + nb) >= 0)) {
    //             nb += Number(form.getElementsByTagName("input")[i].value);
    //         } else {
    //             form.getElementsByTagName("input")[i].value = 100;
    //             alert("Vous avez dépasser le maximum de point allouer au pokemon")
    //         }

    //     }

    for (i = 0; i < (form.getElementsByClassName("iv").length); i++) {

        if(form.getElementsByClassName("iv")[i].value > -1 && form.getElementsByClassName("iv")[i].value < 32){
            
        }else {
            form.getElementsByClassName("iv")[i].value = "";
        }

    }

    for (i = 0; i < (form.getElementsByClassName("ev").length); i++) {

        nb += Number(form.getElementsByClassName("ev")[i].value);
        if(form.getElementsByClassName("ev")[i].value > -1 && form.getElementsByClassName("ev")[i].value < 253){
            
        }else {
            form.getElementsByClassName("ev")[i].value = "";
        }

        if (nb < 511) {
            console.log("inférieur a 511")
        } else {
            nb = 0
            alert("Veuille ne pas dépasser 510 ev en tout")
        }
        
    }




}


// if (nb <= 250 && nb >= 0) {

//     contpoint.value = nb;

// } else {
//     contpoint.value = 0;
//     alert("Remise a 0 des points");
//     for (i = 0; i < (form.getElementsByTagName("input")).length; i++) {
//         let iftypenb = (form.getElementsByTagName("input")[i].getAttribute("type") == "number");
//         if (iftypenb == true && Number(form.getElementsByTagName("input")[i].value) != 0) {

//             form.getElementsByTagName("input")[i].value = "";

//         }
//     }
// }


// }