document.addEventListener("DOMContentLoaded", () => {
    const palco = new URLSearchParams(window.location.search).get("palco");
    if (!palco) return;

    document.querySelectorAll(".horario-tabela tbody tr").forEach(tr => {
        const palcoLinha = tr.cells[2].textContent.trim();
        tr.hidden = palcoLinha !== palco;
    });
});


const palco = new URLSearchParams(location.search).get("palco");

function pesquisar_horarios() {
    const termo = document.getElementById("barra_pesquisa").value.toLowerCase();
    document.querySelectorAll(".horario-tabela tbody tr").forEach(tr => {
        const artista = tr.cells[0].textContent.toLowerCase();
        const linhaPalco = tr.cells[2].textContent.trim();
        tr.hidden = (palco && linhaPalco !== palco) || !artista.includes(termo);
    });
}

document.addEventListener("DOMContentLoaded", pesquisar_horarios);