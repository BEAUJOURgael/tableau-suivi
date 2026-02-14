let donnees = JSON.parse(localStorage.getItem("suivi")) || [];

function sauvegarder() {
    localStorage.setItem("suivi", JSON.stringify(donnees));
}

function afficher() {
    const tableau = document.getElementById("tableau");
    tableau.innerHTML = "";

    let total = 0;

    donnees.forEach((item, index) => {
        total += Number(item.valeur);

        tableau.innerHTML += `
            <tr>
                <td>${item.nom}</td>
                <td>${item.valeur} €</td>
                <td><button class="supprimer" onclick="supprimer(${index})">X</button></td>
            </tr>
        `;
    });

    document.getElementById("total").innerText = total;
}

function ajouter() {
    const nom = document.getElementById("nom").value;
    const valeur = document.getElementById("valeur").value;

    if (!nom || !valeur) {
        alert("Remplis les champs !");
        return;
    }

    donnees.push({ nom, valeur });

    sauvegarder();
    afficher();

    document.getElementById("nom").value = "";
    document.getElementById("valeur").value = "";
}

function supprimer(index) {
    donnees.splice(index, 1);
    sauvegarder();
    afficher();
}

afficher();
