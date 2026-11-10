const utilizadores=[
    "joao",
    "tiago",
    "maria",
    "pedro",
    "sofia",
    "lucas"
];

let amigos = JSON.parse(
    localStorage.getItem("amigos")||"[]"
);

function pesquisarUtilizador(){
    const nomePesquisa=document.getElementById("pesquisar")
    .value.trim().toLowerCase();
    
    const Encontrado=utilizadores.some(nome=>nome.toLowerCase().includes(texto)
    );

    const erro=document.getElementById("erro");
    
    if (texto === "") {
        erro.textContent = "Digite um nome!";
    } else if (!encontrado) {
        erro.textContent = "Este usuário não existe!";
    } else {
        erro.textContent = "";
    }

    mostrarUsuarios(false);
}