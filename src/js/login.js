window.onload = function () {

    document.getElementById("form").addEventListener('submit', function (e) {
        e.preventDefault();
        formenvoie();
    });

}

async function formenvoie() {

    let username = document.getElementById("username").value;
    let password = document.getElementById("password").value;
    let err = document.getElementById("err");

    const loc = location.origin; // Avoir l'adresse du site sans /
    const settings = { // Paramètres de la requête
        method: 'POST',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username: `${username}`, password: `${password}` })
    };
    const response = await fetch(`${loc}/auth`, settings); // Requête
    if (response.status >= 200 && response.status <= 299) {
        window.location.href = `${loc}/pokemon`;


    } else if (response.status == 503) {
        err.innerText = "Erreur de la requête sql";
        err.style.color = "red";
    } else if (response.status == 404) {
        err.innerText = "Erreur d'auth" ;
        err.style.color = "red";
    } else if (response.status == 500) {
        err.innerText = "Erreur interne,token invalide";
        err.style.color = "red";
    }
    else {
        // Handle errors
        console.log(response.status, response.statusText);
    }

}