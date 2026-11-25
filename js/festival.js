const parametros = new URLSearchParams(window.location.search);
const nomeFestival = parametros.get("festival");
const dataFestival = parametros.get("datas");
const idFestival = parametros.get("id");
const bilhetes = document.getElementById("bilhetes");

function criarBilhete(tipo, datasBilhete, preco){
    const p = new URLSearchParams(parametros);
    p.set('datasFestival', dataFestival);
    p.set('tipo', tipo);
    p.set('datas', datasBilhete);
    p.set('preco', preco);

    const div = document.createElement('div');
    div.className = 'bilheteCPreço';
    const a = document.createElement('a');
    a.href = 'passeGeral.html?' + p;
    const texto = document.createElement('p');
    texto.textContent = tipo + ' - ' + datasBilhete;
    const precoP = document.createElement('p');
    precoP.className = 'preço';
    precoP.textContent =  preco + '€';

    a.append(texto, precoP);
    div.appendChild(a);
    bilhetes.appendChild(div);
}

function mostrarFestival() {
    if (!nomeFestival || !dataFestival || !idFestival) {
        location.replace('pag_comprarBilhetes.html');
        return;
    }

    const tituloSpan = document.getElementById("titulo");
    tituloSpan.textContent = nomeFestival;

    const dataSpan = document.getElementById("datas");
    dataSpan.textContent = "Datas: " + dataFestival;

    const criados = JSON.parse(localStorage.getItem("festivaisCriados") || "[]");
    const criado = criados.find(f => String(f.id) === idFestival);
    
    const logoSpan = document.getElementById("logo");
    logoSpan.src = criado ? criado.logo : "../files/festivais/logo" + idFestival + ".png";
    logoSpan.alt = "Logo do Festival";

    const cartazSpan = document.getElementById("imgCartaz");
    cartazSpan.src = criado ? criado.cartaz : "../files/festivais/cartaz" + idFestival + ".png";
    cartazSpan.alt = "Cartaz do Festival";

    const descricaoSpan = document.getElementById("descricao");
    descricaoSpan.textContent = "Os teus concertos favoritos têm " + nomeFestival + " por trás. Bilhetes, pré-vendas e a agenda completa - tudo aqui.";

    const [dias, resto] = dataFestival.trim().split(' de ');
    if (resto) {
        const lista = dias.replace(' e ', ', ').split(', ');
        for (const dia of lista) {
            criarBilhete('Bilhete Diário', dia + ' de ' + resto, 50);
        }
        criarBilhete('Passe Geral', dataFestival, 120);
    }
}

const gostos = document.getElementById("gostos");
const gostarBTN = document.getElementById("gosto-btn");
let gostou = false;
let contagemGostos = Number(gostos.textContent) || 2314;

gostarBTN.addEventListener("click", () => {
    gostou = !gostou;
    contagemGostos += gostou ? 1 : -1;
    gostarBTN.textContent = gostou ? "Retirar Gosto" : "Gostar";
    gostos.textContent = contagemGostos;
});

mostrarFestival();

mostrarFestival();