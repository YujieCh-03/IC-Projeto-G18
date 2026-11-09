function escolherPagamento() {
    const idPedido = new URLSearchParams(location.search).get("pedido");
    if (lerCompra(idPedido)) {
        location.replace('recibo.html?pedido=' + idPedido);
        return;
    }

    const pedido = lerPedido(idPedido);
    if (!pedido) {
        location.replace("pag_SuperBock.html");
        return;
    }

    mostrarResumo(pedido);
    document.getElementById("voltar-compra").href =
        'passeGeral.html?tipo=' + pedido.codigo + '&pedido=' + pedido.id;
    document.getElementById("pagar-cartao").href = 'card.html?pedido=' + pedido.id;
    document.getElementById("pagar-mbway").href = 'pagamento_de_mbway.html?pedido=' + pedido.id;
}

function prepararPagamento(form) {
    const metodo = form.dataset.metodo;
    const parametros = new URLSearchParams(location.search);
    const idPedido = parametros.get("pedido");
    const origemBar = parametros.get("origem") === "bar";

    const voltar = document.getElementById("voltar-pagamento");
    let pedido;
    let consulta;
    if (origemBar) {
        pedido = { festival: "Copo Meio Cheio", tipo: "Pedido do bar", quantidade: 1, preco: 5 };
        consulta = "?origem=bar";
        voltar.href = "choice2.html";
        ligarAoPedido();
    } else {
        if (lerCompra(idPedido)) {
            location.replace('recibo.html?pedido=' + idPedido);
            return;
        }

        pedido = lerPedido(idPedido);
        if (pedido === null) {
            location.replace("pag_SuperBock.html");
            return;
        }

        consulta = '?pedido=' + pedido.id;
        voltar.href = 'choice.html' + consulta;
    }

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
            if (origemBar) {
                sessionStorage.setItem(chaveReciboBar, JSON.stringify(pedido));
            } else if (lerCompra(pedido.id) === null) {
                localStorage.setItem(prefixoCompra + pedido.id, JSON.stringify(pedido));
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
    const origemBar = parametros.get("origem") === "bar";
    let recibo;
    let paginaSemRecibo;
    if (origemBar) {
        recibo = JSON.parse(sessionStorage.getItem(chaveReciboBar));
        paginaSemRecibo = "pag_pedido.html";
    } else {
        recibo = lerCompra(parametros.get("pedido"));
        paginaSemRecibo = "bilhetes.html";
    }

    if (!recibo) {
        location.replace(paginaSemRecibo);
        return;
    }

    document.getElementById("metodo-recibo").textContent = recibo.metodo;
    document.getElementById("data-recibo").textContent = new Date(recibo.data).toLocaleDateString("pt-PT");
    mostrarResumo(recibo);
    if (origemBar) ligarAoPedido();
}

const formPagamento = document.getElementById('form-pagamento');
if (formPagamento !== null) {
    prepararPagamento(formPagamento);
} else if (document.getElementById('pagar-cartao') !== null) {
    escolherPagamento();
} else if (document.getElementById('metodo-recibo') !== null) {
    mostrarRecibo();
}
