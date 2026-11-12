const linkPedidos = document.getElementById("linkPedidos");
const num = Number(sessionStorage.getItem("numPedidos")) || 0;

if(num > 0 && linkPedidos){
    const div = document.createElement("div");
    div.className = "notif";
    div.textContent = num;
       
    linkPedidos.appendChild(div);
}

