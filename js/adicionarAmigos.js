const utilizadores=[
    "joao",
    "tiago",
    "maria",
    "pedro",
    "sofia",
    "lucas"
];


let amigos = JSON.parse(
    localStorage.getItem("amigos") || "[]"
);

function pesquisarUtilizador() {
    const input = document.getElementById("pesquisar");
    const erro = document.getElementById("erro");

    const pesquisa = input.value.trim().toLowerCase();

    if (pesquisa === "") {
        erro.textContent = "Digite o nome do utilizador!";
        mostrarUtilizadores();
        return;
    }

    const encontrado = utilizadores.some(nome =>
        nome.toLowerCase().includes(pesquisa)
    );

    if (!encontrado) {
        erro.textContent = "Este utilizador não existe!";
    } else {
        erro.textContent = "";
    }

    mostrarUtilizadores();
}


function mostrarUtilizadores() {
    const input = document.getElementById("pesquisar");
    const lista = document.getElementById("listaUtilizadores");

    const pesquisa = input.value.trim().toLowerCase();

    lista.replaceChildren();

    const resultados = utilizadores.filter(nome =>
        nome.toLowerCase().includes(pesquisa)
    );

    resultados.forEach(nome => {
        const div = document.createElement("div");
        div.className = "utilizador";

        const texto = document.createElement("span");
        texto.textContent = nome;

        const botao = document.createElement("button");

        if (amigos.includes(nome)) {
            botao.textContent = "Adicionado";
            botao.disabled = true;
        } else {
            botao.textContent = "Adicionar";
            botao.onclick = () => adicionarAmigo(nome);
        }

        div.appendChild(texto);
        div.appendChild(botao);
        lista.appendChild(div);
    });
}


function adicionarAmigo(nome) {
    if (!amigos.includes(nome)) {
        amigos.push(nome);

        localStorage.setItem(
            "amigos",
            JSON.stringify(amigos)
        );
    }

    mostrarUtilizadores();
}


document.addEventListener("DOMContentLoaded", function() {
    mostrarUtilizadores();
});

