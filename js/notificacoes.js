const linkPedidos = document.getElementById("linkPedidos");
const num = lerPedidosPagos().length;

if(num > 0 && linkPedidos){
    const div = document.createElement("div");
    div.className = "notif";
    div.textContent = num;
       
    linkPedidos.appendChild(div);
}

