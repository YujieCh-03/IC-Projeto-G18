const parametros = new URLSearchParams(window.location.search);
const nomeFestival = parametros.get("festival");
const dataFestival = parametros.get("datas");
const idFestival = parametros.get("id");
const tituloSpan = document.getElementById("titulo");
const datasSpan = document.getElementById("datas");
const precoSpan = document.getElementById("preco");
const logoSpan = document.getElementById("logo");

function prepararCompra() {
    const idPedido = parametros.get('pedido');
    let anterior = null;
    if (idPedido) {
        anterior = lerPedido(idPedido);
    }

    let selecao = {
        festival: nomeFestival,
        idFestival: idFestival,
        datasFestival: parametros.get('datasFestival'),
        tipo: parametros.get("tipo"),
        datas: dataFestival,
        preco: Number(parametros.get("preco"))
    };
    if (anterior) {
        selecao = anterior;
    }
    if (!selecao.festival || !selecao.tipo || !selecao.datas || !Number.isFinite(selecao.preco) || selecao.preco <= 0) {
        location.replace('pag_comprarBilhetes.html');
        return;
    }

    tituloSpan.textContent = selecao.tipo + ' - ' + selecao.festival;
    datasSpan.textContent = 'Datas: ' + selecao.datas;
    precoSpan.textContent = 'Preço: ' + formatarEuros(selecao.preco);
    const idLogo = selecao.idFestival || '1';
    logoSpan.src = '../files/festivais/logo' + idLogo + '.png';

    const voltar = document.querySelector('.voltar-btn');
    voltar.href = 'pag_comprarBilhetes.html';
    if (selecao.idFestival && selecao.datasFestival) {
        const festival = new URLSearchParams();
        festival.set('festival', selecao.festival);
        festival.set('datas', selecao.datasFestival);
        festival.set('id', selecao.idFestival);
        voltar.href = 'pag_SuperBock.html?' + festival;
    }

    const form = document.getElementById("form_bilhete");
    const quantidade = document.getElementById("quantidade-bilhetes");
    const nome = document.getElementById("nome");
    const confirmacao = document.getElementById('certeza1');
    const erro = document.getElementById('erro-compra');
    if (anterior) {
        quantidade.textContent = anterior.quantidade;
        nome.value = anterior.nome;
    }
    confirmacao.style.display = 'none';

    form.addEventListener('invalid', function (event) {
        erro.textContent = event.target.validationMessage;
        erro.hidden = false;
    }, true);

    form.addEventListener('submit', function (event) {
        event.preventDefault();
        erro.hidden = true;
        const pedido = {
            id: String(Math.random()),
            festival: selecao.festival,
            idFestival: selecao.idFestival,
            datasFestival: selecao.datasFestival,
            tipo: selecao.tipo,
            datas: selecao.datas,
            preco: selecao.preco,
            quantidade: Number(quantidade.textContent),
            nome: nome.value.trim()
        };

        try {
            sessionStorage.setItem(chavePedido, JSON.stringify(pedido));
        } catch {
            erro.textContent = 'Não foi possível guardar a compra. Tente novamente.';
            erro.hidden = false;
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


const MIN = 1;
const MAX = 10;

const qtdSpan = document.getElementById("quantidade-bilhetes");
const btnMenos = document.getElementById("btn-menos-b");
const btnMais = document.getElementById("btn-mais-b");

btnMenos.addEventListener("click", () => {
  let qtd = parseInt(qtdSpan.textContent);
  if (qtd > MIN) {
    qtdSpan.textContent = qtd - 1;
  }
});

btnMais.addEventListener("click", () => {
  let qtd = parseInt(qtdSpan.textContent);
  if (qtd < MAX) {
    qtdSpan.textContent = qtd + 1;
  }
});
