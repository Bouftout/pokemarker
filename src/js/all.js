document.addEventListener('DOMContentLoaded', async event => {
    console.log("all")
    document.querySelectorAll("button").forEach(function (element) {
        console.log("click")
        element.addEventListener('click', function (e) {
            e.preventDefault();
            window.location.href = `${this.getAttribute("action")}`;
        })
    });

    const loc = location; // Avoir l'adresse du site sans /

    document.querySelectorAll("button").forEach(function (element) {

        if (element.getAttribute("action") === loc.pathname) {

            element.setAttribute("disabled", "disabled");
            element.setAttribute("class", "active");

        }

    });

})

//    <%- include('./partials/head', {title:'Princi',script:'index',css:'index'}) %>
