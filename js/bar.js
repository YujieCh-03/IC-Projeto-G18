const nome_bar = document.querySelector(".nome_bar");
const bar = new URLSearchParams(location.search).get('bar');
if( bar){
    sessionStorage.setItem('barAtual', bar);
    nome_bar.textContent = String(sessionStorage.getItem("barAtual"));
}


function prepararPedidoBar(menu) {
    const total = document.querySelector('.total p').lastChild;
    const hora = document.querySelector('.hora_input');
    const pedir = document.querySelector('.fazer_pedido');
    const confirmar = document.querySelector('#fazer_pedido .primario');
    const idPedido = new URLSearchParams(location.search).get('pedido');
    const anterior = lerPedido(idPedido, chavePedidoBar);
    const itensMenu = [];

    for (const item of menu.querySelectorAll('.item')) {
        const nome = item.querySelector('.nome_item').textContent.trim();
        const preco = parseFloat(item.querySelector('.preco_item').textContent.replace(',', '.'));
        const campo = item.querySelector('.quant_item');
        itensMenu.push({ nome, preco, campo });

        const escolhido = anterior && anterior.itens.find(item => item.nome === nome);
        if (escolhido) campo.value = escolhido.quantidade;
    }
    if (anterior) hora.value = anterior.hora;

    function lerMenu() {
        const itens = [];
        let centimos = 0;
        for (const item of itensMenu) {
            const quantidade = item.campo.valueAsNumber;
            if (quantidade > 0) {
                itens.push({ nome: item.nome, preco: item.preco, quantidade });
                centimos += quantidade * Math.round(item.preco * 100);
            }
        }
        return { itens, total: centimos / 100 };
    }

    function atualizarTotal() {
        total.textContent = ' ' + formatarEuros(lerMenu().total);
    }
    atualizarTotal();
    menu.addEventListener('input', atualizarTotal);

    function lerPedidoValido() {
        for (const item of itensMenu) {
            if (!item.campo.reportValidity()) return null;
        }
        if (!hora.reportValidity()) return null;

        const pedido = lerMenu();
        if (pedido.itens.length === 0) {
            alert('Escolha pelo menos um item para fazer o pedido.');
            return null;
        }
        return pedido;
    }

    pedir.addEventListener('click', function (event) {
        if (lerPedidoValido() === null) event.preventDefault();
    });

    confirmar.addEventListener('click', function (event) {
        event.preventDefault();
        const pedido = lerPedidoValido();
        if (pedido === null) return;

        pedido.id = String(Math.random());
        pedido.festival = document.querySelector('h1').textContent;
        pedido.tipo = 'Pedido do bar';
        pedido.hora = hora.value;

        try {
            sessionStorage.setItem(chavePedidoBar, JSON.stringify(pedido));
        } catch {
            alert('Não foi possível guardar o pedido. Tente novamente.');
            return;
        }

        location.href = confirmar.href + '?pedido=' + pedido.id;
    });
}

function mostrarPedidoBar() {
    const idPedido = new URLSearchParams(location.search).get('pedido');
    const recibo = lerCompra(idPedido, prefixoReciboBar);
    const pedido = recibo || lerPedido(idPedido, chavePedidoBar);
    if (!pedido) {
        location.replace('pag_bar.html');
        return;
    }

    document.getElementById('nome-bar').textContent = pedido.festival;
    if (pedido.hora) {
        const hora = document.getElementById('hora-pedido');
        hora.textContent = 'Hora do pedido: ' + pedido.hora;
        hora.hidden = false;
    }

    const tabela = document.getElementById('itens-pedido');
    let quantidade = 0;
    for (const item of pedido.itens) {
        const linha = tabela.insertRow();
        linha.insertCell().textContent = item.nome;
        linha.insertCell().textContent = item.quantidade;
        linha.insertCell().textContent = formatarEuros(item.quantidade * item.preco);
        quantidade += item.quantidade;
    }
    document.getElementById('quantidade-pedido').textContent = quantidade;
    document.getElementById('total-pedido').textContent = formatarEuros(pedido.total);

    const voltar = document.getElementById('voltar-bar');
    if (recibo) {
        voltar.href = 'pag_restaurantes.html';
        const pagar = document.getElementById('pagar-pedido');
        pagar.href = 'recibo.html?origem=bar&pedido=' + pedido.id;
        pagar.textContent = 'Ver recibo';
        document.getElementById('pagamento').style.display = 'none';
    } else {
        voltar.href = 'pag_bar.html?pedido=' + pedido.id;
        document.getElementById('continuar-pedido').href = 'choice2.html?pedido=' + pedido.id;
    }
}

const menuBar = document.querySelector('.pedir');
if (menuBar) {
    prepararPedidoBar(menuBar);
} else {
    mostrarPedidoBar();
}

const pedido = JSON.parse(sessionStorage.getItem(chavePedidoBar) || 'null');
const link = document.getElementById("linkPedidos");
if (pedido && pedido.hora && link) {
    const [h, m] = pedido.hora.split(':').map(Number);
    const agora = new Date();
    if (h * 60 + m > agora.getHours() * 60 + agora.getMinutes()) {
        const bolinha = document.createElement("span");
        bolinha.className = "dot";
        bolinha.textContent = "1";
        link.appendChild(bolinha);
    }
}