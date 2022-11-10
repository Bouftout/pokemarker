window.onload = function () {

    document.querySelectorAll("button").forEach(function (element) {
        element.addEventListener('click', function (e) {
            e.preventDefault();
            window.location.href = `${this.getAttribute("action")}`;
        })
    });

}

//    <%- include('./partials/head', {title:'Princi',script:'index',css:'index'}) %>
