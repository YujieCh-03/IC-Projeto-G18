const listaFestivais = document.getElementById("lista-festivais");
const semFestivais = document.getElementById("sem-festivais");
const tituloFestival = document.getElementById("festival-escolhido");

function atualizarFestivais() {
    const carteira = lerCarteira();
    const compras = [];
    for (const bilhete of carteira.bilhetes) {
        const compra = carteira.compras[bilhete.compra];
        if (compra && compra.festival && !compras.includes(compra)) {
            compras.push(compra);
        }
    }

    const vistos = [];
    listaFestivais.textContent = '';
    for (let compra of compras) {
        if (!compra.idFestival) {
            const compraComId = compras.find(function (outra) {
                return outra.idFestival && outra.festival === compra.festival;
            });
            if (compraComId) {
                compra = compraComId;
            }
        }

        let chave = 'nome:' + compra.festival;
        if (compra.idFestival) {
            chave = 'id:' + compra.idFestival;
        }
        if (vistos.includes(chave)) {
            continue;
        }
        vistos.push(chave);

        const parametros = new URLSearchParams();
        parametros.set('festival', compra.festival);
        if (compra.idFestival) {
            parametros.set('id', compra.idFestival);
        }

        const cartao = document.createElement("a");
        cartao.className = "ticket-card";
        cartao.href = 'festivalhome.html?' + parametros;

        const titulo = document.createElement("h3");
        titulo.textContent = compra.festival;
        cartao.appendChild(titulo);

        if (compra.datasFestival) {
            const datas = document.createElement("p");
            datas.textContent = compra.datasFestival;
            cartao.appendChild(datas);
        }

        listaFestivais.appendChild(cartao);
    }
    semFestivais.hidden = vistos.length > 0;
}

function mostrarFestivalEscolhido() {
    const parametros = new URLSearchParams(window.location.search);
    let nome = parametros.get('festival');
    if (nome) {
        sessionStorage.setItem('bandy.festivalAtual', nome);
    } else {
        nome = sessionStorage.getItem('bandy.festivalAtual');
    }

    if (nome) {
        tituloFestival.textContent = nome;
        tituloFestival.hidden = false;
        document.title = nome + ' - BandyApp';
    }
}

function prepararPaginaFestival() {
    if (listaFestivais) {
        atualizarFestivais();
    } else {
        mostrarFestivalEscolhido();
    }
}

prepararPaginaFestival();
window.addEventListener('pageshow', function (event) {
    if (event.persisted) {
        prepararPaginaFestival();
    }
});
