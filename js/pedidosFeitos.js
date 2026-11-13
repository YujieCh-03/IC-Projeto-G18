const lista = document.getElementById("pag_pedidos");
const vazio = document.getElementById("sem-pedidos");

function atualizarLista() {
    const pedidos = JSON.parse(sessionStorage.getItem("listaPedidos") || "[]");
    let numPedidos = 0;

    lista.textContent = '';
    vazio.hidden = pedidos.length > 0;

    for (const pedido of pedidos) {
        let tempo_espera = 0;
        if (pedido.hora) {
            const [h, m] = pedido.hora.split(':').map(Number);
            const agora = new Date();
            tempo_espera = Math.max(0, h * 60 + m - (agora.getHours() * 60 + agora.getMinutes()));
        }
        pedido.tempo_espera = tempo_espera; // Guarda a propriedade temporária no objeto
    }

    pedidos.sort((a, b) => a.tempo_espera - b.tempo_espera);

    for (const pedido of pedidos) {
        let tempo_espera = pedido.tempo_espera;
        const levantado = tempo_espera === 0;

        const novoPedido = document.createElement("div");
        novoPedido.className = levantado ? "pedido_levantado" : "pedido_porLevantar";

        const div1 = document.createElement("div");
        const bar_pedido = document.createElement("p");
        bar_pedido.className = "nome_bar";
        bar_pedido.textContent = pedido.festival;
        const tempo_pedido = document.createElement("p");
        tempo_pedido.className = "tempo_espera";
        tempo_pedido.textContent = "Tempo de Espera: " + tempo_espera + "min";
        div1.appendChild(bar_pedido);
        div1.appendChild(tempo_pedido);

        const div2 = document.createElement("div");
        div2.className="div2";

        const qr_code = document.createElement("a");
        qr_code.className = "btn-qrcode_pedido";
        qr_code.href = "#qrcode_pedido";
        qr_code.textContent = "QR Code";
        div2.appendChild(qr_code);
        numPedidos++;

        const recibo = document.createElement("a");
        recibo.className = "btn-recibo_pedido";
        recibo.textContent = "Recibo";
        recibo.href = '#recibo_pedido' + pedido.id;
        div2.appendChild(recibo);

        const repetir = document.createElement("a");
        repetir.className = "btn-repetir_pedido";
        repetir.textContent = "Repetir";
        recibo.href = "#repetir_pedido";
        div2.appendChild(repetir);

        if (levantado) {
            const apagar = document.createElement("a");
            apagar.className = "btn-apagar_pedido";
            apagar.href = "#apagar_pedido";
            apagar.textContent = "Apagar";
            apagar.addEventListener("click", (e) => {
                e.preventDefault();
                let pedidos = JSON.parse(sessionStorage.getItem("listaPedidos") || "[]");
                pedidos = pedidos.filter(p => p.id !== pedido.id);
                sessionStorage.setItem("listaPedidos", JSON.stringify(pedidos));
                atualizarLista();
            });
            div2.appendChild(apagar);
        }

        const reciboPedido = document.createElement("div");
        reciboPedido.className="pop";
        reciboPedido.id="recibo_pedido" + pedido.id;
        const pop_caixa = document.createElement("div");
        pop_caixa.className="popup-caixa";
        reciboPedido.appendChild(pop_caixa);
        const frase = document.createElement("h2");
        frase.textContent = "Recibo:"
        pop_caixa.appendChild(frase);
        for (const item of pedido.itens){
            const p = document.createElement("p");
            p.textContent = item.nome + " (" + item.quantidade + "): " + formatarEuros(item.quantidade * item.preco);
            pop_caixa.appendChild(p);
        }
        const total = document.createElement("p");
        total.textContent ="Total: " + formatarEuros(pedido.total);
        pop_caixa.appendChild(total);
        const div = document.createElement("div");
        const btn_prim = document.createElement("a");
        btn_prim.className="primario";
        btn_prim.href="#recibo_pedido-pdf";
        btn_prim.textContent="Guardar Recibo";
        const btn_sec = document.createElement("a");
        btn_sec.className="secundario";
        btn_sec.href="#";
        btn_sec.textContent="Fechar";
        div.appendChild(btn_prim);
        div.appendChild(btn_sec);
        pop_caixa.appendChild(div);

        novoPedido.appendChild(div1);
        novoPedido.appendChild(div2);
        lista.appendChild(novoPedido);
        lista.appendChild(reciboPedido);
    }
    
    sessionStorage.setItem("numPedidos", numPedidos);
}

atualizarLista();
setInterval(atualizarLista, 60000);
