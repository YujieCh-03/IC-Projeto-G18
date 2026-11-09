const lista = document.getElementById("lista-bilhetes");
const vazio = document.getElementById("sem-bilhetes");
let salto;

function atualizarLista() {
    clearTimeout(salto);
    const carteira = lerCarteira();
    const bilhetes = carteira.bilhetes;
    lista.textContent = '';
    vazio.hidden = bilhetes.length > 0;

    if (bilhetes.length === 0) {
        salto = setTimeout(function () {
            if (lerCarteira().bilhetes.length === 0) {
                location.replace('pag_comprarBilhetes.html');
            }
        }, 5000);
        return;
    }

    for (let i = 0; i < bilhetes.length; i++) {
        const bilhete = bilhetes[i];
        const compra = carteira.compras[bilhete.compra];
        const cartao = document.createElement("a");
        cartao.className = "ticket-card";
        cartao.href = 'verbilhete.html?id=' + bilhete.id;
        const titulo = document.createElement("h3");
        titulo.textContent = compra.festival;
        const tipo = document.createElement("p");
        tipo.textContent = compra.tipo + ' · ' + compra.datas;
        const numero = document.createElement("small");
        numero.textContent = numeroBilhete(bilhete);
        cartao.appendChild(titulo);
        cartao.appendChild(tipo);
        cartao.appendChild(numero);
        lista.appendChild(cartao);
    }
}

function mostrarBilhete() {
    const id = new URLSearchParams(location.search).get("id");
    const carteira = lerCarteira();
    let bilhete = null;
    for (let i = 0; i < carteira.bilhetes.length; i++) {
        if (carteira.bilhetes[i].id === id) {
            bilhete = carteira.bilhetes[i];
            break;
        }
    }
    if (bilhete === null) {
        location.replace("bilhetes.html");
        return;
    }

    const compra = carteira.compras[bilhete.compra];
    document.getElementById("festival-bilhete").textContent = compra.festival;
    document.getElementById("numero-bilhete").textContent = numeroBilhete(bilhete);
    document.getElementById("tipo-bilhete").textContent = compra.tipo;
    document.getElementById("datas-bilhete").textContent = compra.datas;
    document.getElementById("nome-bilhete").textContent = compra.nome;

    const remover = document.getElementById("remover-bilhete");
    remover.addEventListener('click', function () {
        remover.disabled = true;
        try {
            localStorage.setItem(prefixoRemocao + id, 'sim');
        } catch {
            const erro = document.getElementById("erro-remocao");
            erro.textContent = "Não foi possível remover o bilhete. Tente novamente.";
            erro.hidden = false;
            remover.disabled = false;
            return;
        }
        location.replace("bilhetes.html");
    });
}

if (lista !== null) {
    atualizarLista();
    window.addEventListener('pageshow', function (event) {
        if (event.persisted) {
            atualizarLista();
        }
    });
    window.addEventListener('pagehide', function () {
        clearTimeout(salto);
    });
    window.addEventListener('storage', atualizarLista);
} else {
    mostrarBilhete();
}
