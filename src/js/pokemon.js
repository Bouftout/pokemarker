window.onload = function () {

    document.addEventListener('click', function (e) {

        


        e = e || window.event;
        var target = e.target || e.srcElement,
            text = target.textContent || target.innerText;

        var scope = target.getAttribute('scope');
        if (scope == "col" && scope != null) {
            document.querySelectorAll("th").forEach(function (element) {
                console.log("click")
                element.setAttribute("class", "")
            });
            
            target.setAttribute("class", "actifsearch")

        }


    }, false);

    getpokemon()

};

function searchname() {

    var i = 0;

    document.querySelectorAll("th").forEach(function (element) {
        console.log("click")
        i++;
        var classe = element.getAttribute("class");

        // Declare variables
        var input, filter, table, tr, td, i, txtValue;
        input = document.getElementById("input");
        filter = input.value;
        table = document.getElementById("table");
        tr = table.getElementsByTagName("tr");
        // Loop through all table rows, and hide those who don't match the search query
        for (i = 0; i < tr.length; i++) {
            if(classe != ""){
                td = tr[i].getElementsByTagName("td")[i];
            }
            if (td) {
                txtValue = td.textContent || td.innerText;
                if (txtValue.search(filter) > -1) {
                    tr[i].style.display = "";
                } else {
                    tr[i].style.display = "none";
                }
            }
        }

    });


}


function createth(text) {
    const th = document.createElement("th");
    th.setAttribute("scope", "col");
    th.setAttribute("id", "nop");
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

    const response = await fetch(`/get/jsonpokemon`, settings); // Requête
    if (response.status >= 200 && response.status <= 299) {
        const log = await response.json();
        console.log(log)
        if (log.length > 0) {

            const container = document.getElementById("container");
            const table = document.createElement("table");
            table.setAttribute("id", "table");
            table.setAttribute("class", "table");
            const thead = document.createElement("thead");
            const tr = document.createElement("tr");

            var allname = ["Pokedex", "Nom", "Nom données", "Pv", "Force", "Defense", "Vitesse", "Spécial Attaque", "Spécial Défense", "Iv", "Nature", "Supression"];

            for (let i = 0; i < allname.length; i++) {
                tr.appendChild(createth(allname[i]));
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
                tr.appendChild(createtd(log[i].pv));
                tr.appendChild(createtd(log[i].force));
                tr.appendChild(createtd(log[i].def));
                tr.appendChild(createtd(log[i].vitesse));
                tr.appendChild(createtd(log[i].specialatt));
                tr.appendChild(createtd(log[i].specialdef));
                tr.appendChild(createtd(log[i].iv));
                tr.appendChild(createtd(log[i].nature));

                const div = document.createElement("div");
                const td = document.createElement("td");
                const button = document.createElement("button");
                button.setAttribute("class", "button");
                button.setAttribute("onclick", "deletepokemon(" + log[i].id + ")");
                button.innerText = "Delete";
                td.appendChild(button);
                tr.appendChild(td);

                tbody.appendChild(tr);
            }

            container.appendChild(table);
        } else {
            err.innerText = "Auncun pokemon";
            err.style.color = "red";
        }


    } else {
        // Handle errors
        console.log(response.status, response.statusText);
    }

};