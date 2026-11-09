const chavePedido = 'bandy.pedido';
const chaveCarteira = 'bandy.carteira';
const chaveReciboBar = 'bandy.reciboBar';
const prefixoCompra = 'bandy.compra.';
const prefixoRemocao = 'bandy.bilheteRemovido.';

function lerPedido(idPedido) {
    const pedido = JSON.parse(sessionStorage.getItem(chavePedido));

    if (pedido === null) {
        return null;
    }
    if (pedido.id === idPedido) {
        return pedido;
    }
    return null;
}

function lerCarteira() {
    // A chave bandy.carteira contém os bilhetes da versão anterior.
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

function lerCompra(idPedido) {
    const compra = JSON.parse(localStorage.getItem(prefixoCompra + idPedido));
    if (compra !== null) {
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
    if (pedido.datas) {
        linhas.push(pedido.datas, 'Quantidade: ' + pedido.quantidade + ' × ' + formatarEuros(pedido.preco));
    }
    linhas.push('Total: ' + formatarEuros(pedido.quantidade * pedido.preco));

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

function ligarAoPedido() {
    const destino = document.getElementById("destino-pagamento");
    destino.href = "pag_pedido.html";
    destino.textContent = "Voltar ao pedido";
}

function numeroBilhete(bilhete) {
    return '#' + bilhete.compra.slice(-8) + '-' + bilhete.numero;
}
