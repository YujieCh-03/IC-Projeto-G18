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


function temDigitos(valor, tamanho) {
    if (valor.length !== tamanho) {
        return false;
    }
    for (const caractere of valor) {
        if (caractere < '0' || caractere > '9') {
            return false;
        }
    }
    return true;
}

function mostrarAvisoPagamento(campo, mensagem) {
    const aviso = document.getElementById('aviso-pagamento');
    document.getElementById('mensagem-aviso-pagamento').textContent = mensagem;
    aviso.addEventListener('close', function () {
        campo.focus();
    }, { once: true });
    aviso.showModal();
}

function validarDadosPagamento(form) {
    if (form.dataset.metodo === 'MB WAY') {
        const telemovel = document.getElementById('telemovel');
        const codigoPais = document.getElementById('codigo-pais');

        let tamanho = 9;
        if (codigoPais.value === '+86') {
            tamanho = 11;
        }
                if (!temDigitos(telemovel.value, tamanho)) {
            mostrarAvisoPagamento(telemovel, 'Introduza um número de telemóvel com ' + tamanho + ' dígitos.');
            return false;
        }

        if (codigoPais.value === '+351' && telemovel.value[0] !== '9') {
            mostrarAvisoPagamento(telemovel, 'O número de telemóvel deve começar por 9.');
            return false;
        }

        return true;

    const nome = document.getElementById('name');
    const numero = document.getElementById('number');
    const validade = document.getElementById('expiry');
    const cvv = document.getElementById('cvv');

    if (nome.value.trim() === '') {
        mostrarAvisoPagamento(nome, 'Introduza o nome no cartão.');
        return false;
    }

    if (!temDigitos(numero.value.split(' ').join(''), 16)) {
        mostrarAvisoPagamento(numero, 'O número do cartão deve ter 16 dígitos.');
        return false;
    }

    const mes = validade.value.slice(0, 2);
    const ano = validade.value.slice(3);
    if (validade.value[2] !== '/' || !temDigitos(mes, 2) || !temDigitos(ano, 2)
        || Number(mes) < 1 || Number(mes) > 12) {
        mostrarAvisoPagamento(validade, 'Introduza a validade no formato MM/AA e um mês entre 01 e 12.');
        return false;
    }

    if (!temDigitos(cvv.value, 3)) {
        mostrarAvisoPagamento(cvv, 'O CVV deve ter 3 dígitos.');
        return false;
    }

}
    return true;



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
        if (!validarDadosPagamento(form)) {
            return;
        }
        erro.hidden = true;
        confirmacao.style.display = '';
        location.hash = "confirmacao";
    });

    confirmar.addEventListener('click', function () {
        if (!validarDadosPagamento(form)) {
            confirmacao.style.display = 'none';
            location.hash = '';
            return;
        }
        confirmar.disabled = true;
        pedido.metodo = metodo;
        pedido.data = new Date().toISOString();

        try {
            if (lerCompra(pedido.id, prefixo) === null) {
                if (origemBar) {
                    const lista = JSON.parse(sessionStorage.getItem("listaPedidos") || "[]");
                    const existe = lista.some(function (anterior) {
                        return anterior.id === pedido.id;
                    });
                    if (!existe) {
                        lista.push({ id: pedido.id });
                        sessionStorage.setItem("listaPedidos", JSON.stringify(lista));
                    }
                }
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
document.getElementById('guardar-recibo').href =
    'data:text/plain;charset=utf-8,' + encodeURIComponent(texto);

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





