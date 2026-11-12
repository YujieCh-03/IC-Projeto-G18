function escolherPagamento() {
    const voltar = document.getElementById("voltar-compra");
    const origemBar = voltar.dataset.origem === "bar";
    const idPedido = new URLSearchParams(location.search).get("pedido");
    const prefixo = origemBar ? prefixoReciboBar : prefixoCompra;
    const consulta = (origemBar ? '?origem=bar&pedido=' : '?origem=bilhetes&pedido=') + idPedido;
    if (lerCompra(idPedido, prefixo)) {
        location.replace('recibo.html' + consulta);
        return;
    }

    const pedido = lerPedido(idPedido, origemBar ? chavePedidoBar : chavePedido);
    if (!pedido) {
        location.replace(origemBar ? "pag_bar.html" : "pag_comprarBilhetes.html");
        return;
    }

    mostrarResumo(pedido);
    voltar.href = origemBar ? 'pag_pedido.html?pedido=' + pedido.id
        : 'passeGeral.html?pedido=' + pedido.id;
    document.getElementById("pagar-cartao").href = 'card.html' + consulta;
    document.getElementById("pagar-mbway").href = 'pagamento_de_mbway.html' + consulta;
}


function prepararPagamento(form) {
    const metodo = form.dataset.metodo;
    const parametros = new URLSearchParams(location.search);
    const idPedido = parametros.get("pedido");
    const origemBar = parametros.get("origem") === "bar";
    const prefixo = origemBar ? prefixoReciboBar : prefixoCompra;
    const consulta = (origemBar ? '?origem=bar&pedido=' : '?pedido=') + idPedido;
    if (lerCompra(idPedido, prefixo)) {
        location.replace('recibo.html' + consulta);
        return;
    }

    const pedido = lerPedido(idPedido, origemBar ? chavePedidoBar : chavePedido);
    if (pedido === null) {
        location.replace(origemBar ? "pag_bar.html" : "pag_comprarBilhetes.html");
        return;
    }

    const voltar = document.getElementById("voltar-pagamento");
    voltar.href = origemBar ? 'choice2.html?pedido=' + pedido.id : 'choice.html' + consulta;
    if (origemBar) ligarAoPedido(pedido.id);

    mostrarResumo(pedido);
    document.getElementById("ver-recibo").href = 'recibo.html' + consulta;

    const confirmacao = document.getElementById("confirmacao");
    const confirmar = document.getElementById("confirmar-pagamento");
    const erro = document.getElementById("erro-pagamento");

    form.addEventListener('submit', function (event) {
        event.preventDefault();
        erro.hidden = true;
        confirmacao.style.display = '';
        location.hash = "confirmacao";
    });

    confirmar.addEventListener('click', function () {
        confirmar.disabled = true;
        pedido.metodo = metodo;
        pedido.data = new Date().toISOString();

        try {
            if (lerCompra(pedido.id, prefixo) === null) {
                localStorage.setItem(prefixo + pedido.id, JSON.stringify(pedido));
            }
        } catch {
            confirmar.disabled = false;
            erro.textContent = "Não foi possível guardar o pagamento. Tente novamente.";
            erro.hidden = false;
            return;
        }

        form.reset();
        form.querySelector("button").disabled = true;
        confirmacao.style.display = 'none';
        document.getElementById("sucesso").style.display = '';
        location.replace("#sucesso");
    });
}

function mostrarRecibo() {
    const parametros = new URLSearchParams(location.search);
    const idPedido = parametros.get("pedido");
    const origemBar = parametros.get("origem") === "bar";
    let recibo;
    let paginaSemRecibo;
    if (origemBar) {
        recibo = idPedido === null ? JSON.parse(sessionStorage.getItem(chaveReciboBar))
            : lerCompra(idPedido, prefixoReciboBar);
        paginaSemRecibo = "pag_bar.html";
    } else {
        recibo = lerCompra(idPedido);
        paginaSemRecibo = "bilhetes.html";
    }

    if (!recibo) {
        location.replace(paginaSemRecibo);
        return;
    }

    document.getElementById("metodo-recibo").textContent = recibo.metodo;
    document.getElementById("data-recibo").textContent = new Date(recibo.data).toLocaleDateString("pt-PT");
    mostrarResumo(recibo);
    const texto = document.getElementById('bill').innerText;
    document.getElementById('guardar-recibo').href = 'data:text/plain;charset=utf-8,' + encodeURIComponent(texto);
    if (origemBar) ligarAoPedido(idPedido);
}

const formPagamento = document.getElementById('form-pagamento');
if (formPagamento !== null) {
    prepararPagamento(formPagamento);
} else if (document.getElementById('pagar-cartao') !== null) {
    escolherPagamento();
} else if (document.getElementById('metodo-recibo') !== null) {
    mostrarRecibo();
}


