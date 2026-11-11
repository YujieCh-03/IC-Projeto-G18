const parametros = new URLSearchParams(window.location.search);
const nomeFestival = parametros.get("festival");
const dataFestival = parametros.get("datas");
const idFestival = parametros.get("id");

const tituloSpan = document.getElementById("titulo");
const datasSpan = document.getElementById("datas");
const precoSpan = document.getElementById("preco");
const logoSpan = document.getElementById("logo");
tituloSpan.textContent = nomeFestival;
datasSpan.textContent = "Datas:" + dataFestival;
logoSpan.src="../files/festivais/logo"+ idFestival +".png";

function prepararCompra() {
    const parametros = new URLSearchParams(location.search);
    const selecao = {
        tipo: parametros.get("tipo"),
        datas: parametros.get("datas"),
        preco: Number(parametros.get("preco"))
    };
    if (!selecao.tipo) {
        location.replace("pag_SuperBock.html");
        return;
    }
    document.querySelector('.titulo').textContent = selecao.tipo + ' - ' + nomeFestival;
    document.querySelector('.datas').textContent = 'Datas: ' + selecao.datas;
    document.querySelector('.preco').textContent = 'Preço: ' + formatarEuros(selecao.preco);

    const form = document.getElementById("form_bilhete");
    const quantidade = document.getElementById("quantidade-bilhetes");
    const nome = document.getElementById("nome");
    const confirmacao = document.getElementById('certeza1');
    quantidade.required = true;
    confirmacao.style.display = 'none';

    document.querySelector('.pagar-btn').addEventListener('click', function (event) {
        event.preventDefault();
        document.querySelector('.submit-btn').click();
    });

    form.addEventListener('submit', function (event) {
        event.preventDefault();
        const pedido = {
            id: String(Math.random()),
            festival: nomeFestival,
            tipo: selecao.tipo,
            datas: selecao.datas,
            preco: selecao.preco,
            quantidade: Number(qnuuantidade.textContent),
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
            + ' · Quantidade: ' + Number(pedido.quantidade) + ' × ' + formatarEuros(pedido.preco)
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