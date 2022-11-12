window.onload = function () {

    var nombre = 1.5;
    resultat = Math.ceil(nombre);

    function random(min, max) {
        min = Math.ceil(min);
        max = Math.floor(max);
        return Math.floor(Math.random() * (max - min)) + min;
    }

    const form = document.getElementById("form");
    const randomvalueiv = random(2, 31)

    form.iv.value = randomvalueiv;

    form.addEventListener("submit", function (e) {
        e.preventDefault();
        formenvoie();

    });

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

            window.location.href = `/play`;

        } else if (log.create === false) {
            err.innerText = "Mauvais identifiant ou mot de passe";
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