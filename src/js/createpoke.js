window.onload = function () {
    const form = document.getElementById("form");

    form.addEventListener("submit", function (e) {
        e.preventDefault();
        formenvoie();

    });

    document.getElementById("totmaxstat").innerText = totmax;
    document.getElementById("maxstat").innerText = max;
}

async function formenvoie() {

    const formdata = new FormData(form);
    const data = Object.fromEntries(formdata.entries());
    const datajson = JSON.stringify(data);
    let err = document.getElementById("err");

    const settings = { // Paramètres de la requête
        method: 'POST',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
        },
        body: datajson,
    };

    const response = await fetch(`/create/pokemon`, settings); // Requête

    if (response.status >= 200 && response.status <= 299) {
        const log = await response.json();
        if (log.create === true) {

            window.location.href = `/pokemon`;

        } else if (log.create === false) {
            err.innerText = "Erreur lors de la création du pokemon(Champs manquant ou invalide)";
            err.style.color = "red";
        } else {
            err.innerText = "Erreur inconnue: " + log.create;
            err.style.color = "red";
            console.log("Erreur");
        }



    } else {
        // Handle errors
        console.log(response.status, response.statusText);
    }


}

const max = 100;
const totmax = 250;

function maxstat() {
    let contpoint = document.getElementById("contpoint");
    let form = document.getElementById("form");

    let nb = 0;

    for (i = 0; i < (form.getElementsByTagName("input")).length; i++) {
        let iftypenb = (form.getElementsByTagName("input")[i].getAttribute("type") == "number");
        if (iftypenb == true && Number(form.getElementsByTagName("input")[i].value) != 0) {
            console.log("NUMBER: " + nb);



            //&& ((Number(form.getElementsByTagName("input")[i].value) + nb) <= max)
            if (Number(form.getElementsByTagName("input")[i].value) <= max && nb <= totmax && Number(form.getElementsByTagName("input")[i].value) >= 0 && nb >= 0 && ((Number(form.getElementsByTagName("input")[i].value) + nb) >= 0)) {
                nb += Number(form.getElementsByTagName("input")[i].value);
            } else {
                form.getElementsByTagName("input")[i].value = 100;
                alert("Vous avez dépasser le maximum de point allouer au pokemon")
            }

        }



    }


    if (nb <= 250 && nb >= 0) {

        contpoint.value = nb;

    } else {
        contpoint.value = 0;
        alert("Remise a 0 des points");
        for (i = 0; i < (form.getElementsByTagName("input")).length; i++) {
            let iftypenb = (form.getElementsByTagName("input")[i].getAttribute("type") == "number");
            if (iftypenb == true && Number(form.getElementsByTagName("input")[i].value) != 0) {

                form.getElementsByTagName("input")[i].value = "";

            }
        }
    }


}