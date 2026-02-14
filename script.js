let donnees = JSON.parse(localStorage.getItem("suivi")) || [];
let graphique;

// 💾 Sauvegarde
function sauvegarder() {
    localStorage.setItem("suivi", JSON.stringify(donnees));
}

// 🌙 Mode sombre
function toggleDarkMode() {
    document.body.classList.toggle("dark");
}

// ➕ Ajouter une ligne
function ajouter() {
    const nom = document.getElementById("nom").value;
    const valeur = document.getElementById("valeur").value;
    const date = document.getElementById("date").value;

    if (!nom || !valeur || !date) {
        alert("Remplis tous les champs !");
        return;
    }

    donnees.push({ nom, valeur: Number(valeur), date });

    sauvegarder();
    afficher();
}

// ❌ Supprimer
function supprimer(index) {
    donnees.splice(index, 1);
    sauvegarder();
    afficher();
}

// 🗑️ Tout effacer
function toutEffacer() {
    if (confirm("Tout supprimer ?")) {
        donnees = [];
        sauvegarder();
        afficher();
    }
}

// 📅 Trier par date
function trierParDate() {
    donnees.sort((a, b) => new Date(a.date) - new Date(b.date));
    afficher();
}

// 📊 Affichage + Graphique
function afficher() {
    const tableau = document.getElementById("tableau");
    tableau.innerHTML = "";

    let total = 0;

    donnees.forEach((item, index) => {
        total += item.valeur;

        tableau.innerHTML += `
            <tr>
                <td>${item.date}</td>
                <td>${item.nom}</td>
                <td>${item.valeur} €</td>
                <td><button class="supprimer" onclick="supprimer(${index})">X</button></td>
            </tr>
        `;
    });

    document.getElementById("total").innerText = total;

    dessinerGraphique();
}

// 📈 Graphique automatique
function dessinerGraphique() {
    const ctx = document.getElementById("graphique");

    const labels = donnees.map(d => d.nom);
    const valeurs = donnees.map(d => d.valeur);

    if (graphique) graphique.destroy();

    graphique = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: labels,
            datasets: [{
                label: 'Dépenses',
                data: valeurs
            }]
        }
    });
}

afficher();
