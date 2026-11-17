const chaveLocalizacaoAmigo = "bandy.amigoLocalizado";


function localizarAmigo(nome) {
    if (typeof nome !== "string" || nome.trim() === "") {
        alert("Não foi possível identificar o amigo.");
        return;
    }

    try {
        sessionStorage.setItem(chaveLocalizacaoAmigo, nome.trim());
    } catch {
        alert("Não foi possível guardar a localização.");
        return;
    }

    location.href = "festivalhome.html";
}

function mostrarLocalizacaoAmigo() {
    const mapa = document.querySelector(".mapa-area");


    if (!mapa) return;

    let nome;

    try {
        nome = sessionStorage.getItem(chaveLocalizacaoAmigo);
    } catch {
        return;
    }

    if (!nome) return;


    const posicoes = [
        { esquerda: 46, topo: 40 },
        { esquerda: 52, topo: 58 },
        { esquerda: 30, topo: 77 },
        { esquerda: 65, topo: 30 }
    ];


    let soma = 0;

    for (const letra of nome.toLowerCase()) {
        soma += letra.codePointAt(0);
    }

    const posicao = posicoes[soma % posicoes.length];

    const marcador = document.createElement("a");
    marcador.className = "amigo-posicao";
    marcador.href = "#cancelar-localizacao";
    marcador.style.left = posicao.esquerda + "%";
    marcador.style.top = posicao.topo + "%";
    marcador.setAttribute(
        "aria-label",
        "Localização de " + nome + ". Cancelar localização."
    );

    const etiqueta = document.createElement("span");
    etiqueta.textContent = nome;
    marcador.appendChild(etiqueta);

    mapa.appendChild(marcador);

    const nomePopup = document.getElementById("nome-amigo-localizado");
    nomePopup.textContent = nome;

    const confirmar = document.getElementById("confirmar-cancelamento");

    confirmar.addEventListener("click", function (event) {
        event.preventDefault();

        try {
            sessionStorage.removeItem(chaveLocalizacaoAmigo);
        } catch {
            alert("Não foi possível cancelar a localização.");
            return;
        }

        marcador.remove();
        location.hash = "mapa";
    });
}

mostrarLocalizacaoAmigo();