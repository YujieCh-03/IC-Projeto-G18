const chavePedido = 'bandy.pedido';
const chavePedidoBar = 'bandy.pedidoBar';
const chaveCarteira = 'bandy.carteira';
const chaveReciboBar = 'bandy.reciboBar';
const prefixoCompra = 'bandy.compra.';
const prefixoReciboBar = 'bandy.reciboBar.';
const prefixoRemocao = 'bandy.bilheteRemovido.';

function lerPedido(idPedido, chave = chavePedido) {
    const pedido = JSON.parse(sessionStorage.getItem(chave));

    if (pedido === null) {
        return null;
    }
    if (pedido.id === idPedido) {
        return pedido;
    }
    return null;
}

function lerCarteira() {
    let carteira = JSON.parse(localStorage.getItem(chaveCarteira));
    if (carteira === null) {
        carteira = { compras: {}, bilhetes: [] };
    }

    for (let i = 0; i < localStorage.length; i++) {
        const chave = localStorage.key(i);
        if (chave !== null && chave.startsWith(prefixoCompra)) {
            const compra = JSON.parse(localStorage.getItem(chave));
            if (compra !== null && !carteira.compras[compra.id]) {
                carteira.compras[compra.id] = compra;
                for (let numero = 1; numero <= compra.quantidade; numero++) {
                    const bilhete = {
                        id: compra.id + '-' + numero,
                        compra: compra.id,
                        numero: numero
                    };
                    carteira.bilhetes.push(bilhete);
                }
            }
        }
    }

    const bilhetesAtivos = [];
    for (let i = 0; i < carteira.bilhetes.length; i++) {
        const bilhete = carteira.bilhetes[i];
        if (localStorage.getItem(prefixoRemocao + bilhete.id) === null) {
            bilhetesAtivos.push(bilhete);
        }
    }
    carteira.bilhetes = bilhetesAtivos;
    return carteira;
}

function lerCompra(idPedido, prefixo = prefixoCompra) {
    const compra = JSON.parse(localStorage.getItem(prefixo + idPedido));
    if (compra !== null || prefixo !== prefixoCompra) {
        return compra;
    }

    const carteira = JSON.parse(localStorage.getItem(chaveCarteira));
    if (carteira !== null) {
        const compraAntiga = carteira.compras[idPedido];
        if (compraAntiga && compraAntiga.id === idPedido) {
            return compraAntiga;
        }
    }
    return null;
}

function formatarEuros(valor) {
    return valor.toFixed(2).replace('.', ',') + ' €';
}

function mostrarResumo(pedido) {
    const linhas = [pedido.festival, pedido.tipo];
    if (pedido.itens) {
        for (const item of pedido.itens) {
            linhas.push(item.quantidade + ' × ' + item.nome + ' · ' + formatarEuros(item.quantidade * item.preco));
        }
        if (pedido.hora) {
            linhas.push('Hora do pedido: ' + pedido.hora);
        }
    } else if (pedido.datas) {
        linhas.push(pedido.datas, 'Quantidade: ' + pedido.quantidade + ' × ' + formatarEuros(pedido.preco));
    }
    const total = pedido.total ?? (pedido.quantidade * pedido.preco);
    linhas.push('Total: ' + formatarEuros(total));

    const resumos = document.querySelectorAll('.resumo');
    for (let i = 0; i < resumos.length; i++) {
        resumos[i].textContent = '';
        for (let j = 0; j < linhas.length; j++) {
            const linha = document.createElement('p');
            linha.textContent = linhas[j];
            resumos[i].appendChild(linha);
        }
    }
}

function ligarAoPedido(idPedido) {
    const destino = document.getElementById("destino-pagamento");
    if (idPedido === null) {
        destino.href = "pag_bar.html";
        destino.textContent = "Voltar ao menu";
    } else {
        destino.href = 'pag_pedido.html?pedido=' + idPedido;
        destino.textContent = "Voltar ao pedido";
    }
}

function numeroBilhete(bilhete) {
    return '#' + bilhete.compra.slice(-8) + '-' + bilhete.numero;
}
