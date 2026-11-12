
function mostrarAmigos() {
    const amigos = JSON.parse(
        localStorage.getItem("amigos") || "[]"
    );

    const lista = document.getElementById("meusAmigos");
    const input = document.getElementById("pesquisa");

    if (!lista || !input) {
        console.error("Não foi possível encontrar os elementos HTML.");
        return;
    }

    const pesquisa = input.value.trim().toLowerCase();

    lista.replaceChildren();


    const resultados = amigos.filter(nome =>
        nome.toLowerCase().includes(pesquisa)
    );

    resultados.forEach(nome => {

        const div = document.createElement("div");
        div.className = "amigo";

        const texto = document.createElement("span");
        texto.textContent = nome;

        const botao = document.createElement("button");
        botao.textContent = "Remover";

        botao.onclick = function() {
            removerAmigo(nome);
        };

        div.appendChild(texto);
        div.appendChild(botao);

        lista.appendChild(div);
    });

    if (resultados.length === 0) {
        const mensagem = document.createElement("p");
        mensagem.textContent = "Nenhum amigo encontrado.";
        lista.appendChild(mensagem);
    }
}

function removerAmigo(nome) {

    let amigos = JSON.parse(
        localStorage.getItem("amigos") || "[]"
    );

    amigos = amigos.filter(amigo => amigo !== nome);

    localStorage.setItem(
        "amigos",
        JSON.stringify(amigos)
    );

    mostrarAmigos();
}

document.addEventListener("DOMContentLoaded", function() {

    const pesquisa = document.getElementById("pesquisa");

    if (pesquisa) {
        pesquisa.addEventListener("input", mostrarAmigos);
    }

    const formulario = document.querySelector("form");

    if (formulario) {
        formulario.addEventListener("submit", function(event) {
            event.preventDefault();
        });
    }

    mostrarAmigos();
});
