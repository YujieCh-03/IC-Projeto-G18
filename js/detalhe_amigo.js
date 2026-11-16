
document.addEventListener("DOMContentLoaded", function() {

    const parametros = new URLSearchParams(
        window.location.search
    );

    const nome = parametros.get("nome");

    const nomeAmigo = document.getElementById("nomeAmigo");
    const localizar = document.getElementById("localizar");
    const amigos = JSON.parse(
        localStorage.getItem("amigos") || "[]"
    );

    if (nome && amigos.includes(nome)) {

        nomeAmigo.textContent = nome;

    } else {

        nomeAmigo.textContent = "Amigo não encontrado";

        localizar.disabled = true;
    }

    localizar.addEventListener("click", function() {
        window.location.href = "festivalhome.html";
    });

});

