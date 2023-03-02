window.onload = function () {

    document.addEventListener('click', function (e) {

        e = e || window.event;
        if (e.target || e.target.id == 'th') {
            var target = e.target || e.srcElement,
                text = target.textContent || target.innerText;

            var scope = target.getAttribute('scope');
            if (scope == "col" && scope != null && scope != undefined && text != "Supression") {
                try {
                    document.querySelectorAll("th").forEach(function (element) {
                        console.log("click")
                        element.setAttribute("class", "")
                    });

                    target.setAttribute("class", "actifsearch")
                } catch (e) {
                    console.log(e)
                } finally {
                    // searchname();

                }


            }
        }

    }, false);


    getpokemon()

    setInterval(function () {
      //  getpokemon()
    }, 10000);

    document.getElementById("getallevbtn").addEventListener('click', function (e) {

        var el = document.getElementById('popev');
        el.style.display = 'block';

        const tableev = document.getElementById("tableev");
        (tableev.firstElementChild.firstChild.firstChild).setAttribute("class", "")

    })

};

function searchname(filter, autretable) {


    document.querySelectorAll("th").forEach(function (element) {

        const classe = element.getAttribute("class");
        var idelement = element.getAttribute("id");

        if (classe != "" && classe != null && classe != undefined && classe == "actifsearch") {
            // Declare variables
            var input, table, tr, td, i, txtValue;
            input = document.getElementById("input");
            if (filter == null || filter == undefined || filter == "") {
                filter = input.value;
            }
            if (autretable == "ev") {
                table = document.getElementById("tableev");
                idelement = 0;
            } else if (autretable == "evall") {
                table = document.getElementById("tableev");
            } else {
                table = document.getElementById("table");
            }
            tr = table.getElementsByTagName("tr");
            // Loop through all table rows, and hide those who don't match the search query
            for (i = 0; i < tr.length; i++) {
                td = tr[i].getElementsByTagName("td")[idelement];
                if (td) {
                    txtValue = td.textContent || td.innerText;
                    console.log("txtvalue")
                        if (txtValue == filter) {
                            tr[i].style.display = "";
                        } else {
                            tr[i].style.display = "none";
                        }
                    

                }
            }

        }

    });


}



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

    const response = await fetch(`/get/pokemon`, settings); // Requête
    if (response.status >= 200 && response.status <= 299) {
        const log = await response.json();
        console.log(log)

        if (log.length > 0) {
            creertable(log)
            createev(log)
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

    var allname = ["Pokedex", "Nom Du pokémon", "Nom données","CheckBox"];

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
        tr.appendChild(createtd(log[i].givenname));
        tr.innerHTML += ` <input type="checkbox" id="check${log[i].id}" name="check">`


        tbody.appendChild(tr);
    }

    tablediv.appendChild(table);
}


async function envoiedeck(){


    let err = document.getElementById("err");

    var data = [];

    for(i = 0;i < 50; i++){
        if(document.getElementById(`check${i}`) != null){
            // console.log(document.getElementById(`check${i}`).checked)
            if(document.getElementById(`check${i}`).checked == true){
                data.push(document.getElementById(`check${i}`).previousElementSibling.previousElementSibling.previousElementSibling.innerText)
                console.log(document.getElementById(`check${i}`).previousElementSibling.previousElementSibling.previousElementSibling.innerText)
            }
        }
        
    }

    console.log(JSON.stringify(data))

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
        const log = await response.json();

        alert("Envoie du deck a la bdd")

    } else {
        // Handle errors
        console.log(response.status, response.statusText);
    }

}