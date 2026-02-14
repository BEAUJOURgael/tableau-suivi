let donnees = JSON.parse(localStorage.getItem("suivi")) || [];
let graphique;

function sauvegarder(){
    localStorage.setItem("suivi", JSON.stringify(donnees));
}

function toggleDarkMode(){
    document.body.classList.toggle("dark");
}

function ajouter(){
    const nom = document.getElementById("nom").value;
    const valeur = document.getElementById("valeur").value;
    const categorie = document.getElementById("categorie").value;
    const date = document.getElementById("date").value;

    if(!nom || !valeur || !date) return alert("Champs manquants");

    donnees.push({nom, valeur:Number(valeur), categorie, date});
    sauvegarder();
    afficher();
}

function supprimer(i){
    donnees.splice(i,1);
    sauvegarder();
    afficher();
}

function toutEffacer(){
    if(confirm("Tout supprimer ?")){
        donnees=[];
        sauvegarder();
        afficher();
    }
}

function filtrer(){
    const recherche = document.getElementById("recherche").value.toLowerCase();
    const mois = document.getElementById("filtreMois").value;

    return donnees.filter(d=>{
        const matchTexte = d.nom.toLowerCase().includes(recherche);
        const matchMois = !mois || d.date.startsWith(mois);
        return matchTexte && matchMois;
    });
}

function afficher(){
    const data = filtrer();
    const tbody = document.getElementById("tableau");
    tbody.innerHTML="";

    let total=0;

    data.forEach((d,i)=>{
        total+=d.valeur;

        tbody.innerHTML+=`
        <tr>
            <td>${d.date}</td>
            <td>${d.nom}</td>
            <td><span class="categorie ${d.categorie}">${d.categorie}</span></td>
            <td>${d.valeur} €</td>
            <td><button onclick="supprimer(${i})">X</button></td>
        </tr>`;
    });

    document.getElementById("stats").innerText =
        `Total : ${total} € | ${data.length} opérations`;

    dessinerGraphique(data);
}

function dessinerGraphique(data){
    const ctx=document.getElementById("graphique");

    const labels=data.map(d=>d.date);
    const valeurs=data.map(d=>d.valeur);

    if(graphique) graphique.destroy();

    graphique=new Chart(ctx,{
        type:'line',
        data:{
            labels:labels,
            datasets:[{
                label:'Évolution des dépenses',
                data:valeurs,
                tension:0.3,
                fill:false
            }]
        }
    });
}

function exportExcel(){
    const ws = XLSX.utils.json_to_sheet(donnees);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Suivi");
    XLSX.writeFile(wb, "suivi.xlsx");
}

afficher();
