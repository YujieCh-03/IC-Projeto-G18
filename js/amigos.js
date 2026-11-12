let amigos = JSON.parse(
    localStorage.getItem("amigos") || "[]"
);
function mostrarAmigos() {
    const lista = document.getElementById("meusAmigos");

    const pesquisa = document
        .getElementById("pesquisa")
        .value.trim()
        .toLowerCase();

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

        botao.addEventListener("click", function() {
            removerAmigo(nome);
        });

        div.appendChild(texto);
        div.appendChild(botao);
        lista.appendChild(div);
    });
}
function removerAmigo(nome) {
    amigos = amigos.filter(amigo => amigo !== nome);

    localStorage.setItem(
        "amigos",
        JSON.stringify(amigos)
    );

    mostrarAmigos();
}
document.getElementById("pesquisa")
    .addEventListener("input", mostrarAmigos);

document.querySelector("form")
    .addEventListener("submit", function(event) {
        event.preventDefault();
    });
mostrarAmigos();