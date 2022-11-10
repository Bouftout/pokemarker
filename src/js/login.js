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
        const log = await response.json();
        if (log.login === true) {
         
                window.location.href = `${loc}/play`;
            
        } else if (log.login === false) {
            err.innerText = "Mauvais identifiant ou mot de passe";
            err.style.color = "red";
        } else {
            err.innerText = "Erreur inconnue";
            err.style.color = "red";
            console.log("Erreur");
        }

 

    } else {
        // Handle errors
        console.log(response.status, response.statusText);
    }

}