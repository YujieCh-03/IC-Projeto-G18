const festival = "Super Bock Super Rock";
const tiposBilhete = {
    "passe-geral": { tipo: "Passe Geral", datas: "12, 13 e 16 de Agosto de 2027", preco: 120 },
    "diario-12": { tipo: "Bilhete Diário", datas: "12 de Agosto de 2027", preco: 50 },
    "diario-13": { tipo: "Bilhete Diário", datas: "13 de Agosto de 2027", preco: 50 },
    "diario-16": { tipo: "Bilhete Diário", datas: "16 de Agosto de 2027", preco: 50 }
};

function prepararCompra() {
    const parametros = new URLSearchParams(location.search);
    let codigo = parametros.get("tipo");
    if (codigo === null) {
        codigo = "passe-geral";
    }
    const selecao = tiposBilhete[codigo];
    if (!selecao || !selecao.tipo) {
        location.replace("pag_SuperBock.html");
        return;
    }

    document.querySelector('.titulo').textContent = selecao.tipo + ' - ' + festival;
    document.querySelector('.datas').textContent = 'Datas: ' + selecao.datas;
    document.querySelector('.preco').textContent = 'Preço: ' + formatarEuros(selecao.preco);

    const form = document.getElementById("form_bilhete");
    const quantidade = document.getElementById("quantidade");
    const nome = document.getElementById("nome");
    const confirmacao = document.getElementById('certeza1');
    quantidade.required = true;
    confirmacao.style.display = 'none';
    const idPedido = parametros.get("pedido");
    const anterior = lerPedido(idPedido);
    if (anterior !== null && anterior.codigo === codigo && !lerCompra(idPedido)) {
        quantidade.value = anterior.quantidade;
        nome.value = anterior.nome;
    }

    document.querySelector('.pagar-btn').addEventListener('click', function (event) {
        event.preventDefault();
        document.querySelector('.submit-btn').click();
    });

    form.addEventListener('submit', function (event) {
        event.preventDefault();
        const pedido = {
            id: String(Math.random()),
            codigo: codigo,
            festival: festival,
            tipo: selecao.tipo,
            datas: selecao.datas,
            preco: selecao.preco,
            quantidade: quantidade.valueAsNumber,
            nome: nome.value.trim()
        };

        try {
            sessionStorage.setItem(chavePedido, JSON.stringify(pedido));
        } catch {
            alert('Não foi possível guardar a compra. Tente novamente.');
            return;
        }

        document.querySelector('.valores-pergunta').textContent =
            pedido.festival + ' · ' + pedido.tipo + ' · ' + pedido.datas
            + ' · Quantidade: ' + pedido.quantidade + ' × ' + formatarEuros(pedido.preco)
            + ' · Total: ' + formatarEuros(pedido.quantidade * pedido.preco);
        document.querySelector('.btn-confirmacao .primario').href = 'choice.html?pedido=' + pedido.id;
        confirmacao.style.display = '';
        location.hash = "certeza1";
    });
}

prepararCompra(); 
