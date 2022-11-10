window.onload = function () {

    document.getElementById("login").addEventListener('click', function (e) {
        e.preventDefault();

        window.location.href = `${this.getAttribute("action")}`;
    });


}