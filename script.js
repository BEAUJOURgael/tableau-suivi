let data = JSON.parse(localStorage.getItem("trk")) || {
    todo:[],
    progress:[],
    done:[]
};

function save(){
    localStorage.setItem("trk", JSON.stringify(data));
}

function ajouterCarte(){
    const nom = document.getElementById("nom").value;
    if(!nom) return;

    data.todo.push({nom});
    document.getElementById("nom").value="";
    save();
    render();
}

function render(){
    ["todo","progress","done"].forEach(zone=>{
        const el=document.getElementById(zone);
        el.innerHTML="";

        data[zone].forEach((card,i)=>{
            const div=document.createElement("div");
            div.className="card";
            div.draggable=true;
            div.innerText=card.nom;

            div.ondragstart=e=>{
                e.dataTransfer.setData("text", JSON.stringify({zone,i}));
            };

            el.appendChild(div);
        });

        el.ondragover=e=>e.preventDefault();

        el.ondrop=e=>{
            const d=JSON.parse(e.dataTransfer.getData("text"));
            const moved=data[d.zone].splice(d.i,1)[0];
            data[zone].push(moved);
            save();
            render();
        };
    });

    updateGraph();
}

function updateGraph(){
    const ctx=document.getElementById("graphique");

    new Chart(ctx,{
        type:"doughnut",
        data:{
            labels:["À faire","En cours","Terminé"],
            datasets:[{
                data:[data.todo.length,data.progress.length,data.done.length]
            }]
        }
    });
}

render();
