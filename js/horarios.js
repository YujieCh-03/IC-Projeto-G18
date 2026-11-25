const palco = new URLSearchParams(location.search).get("palco");
const tipo = new URLSearchParams(location.search).get("tipo");
const titulo = document.querySelector("h1");

document.addEventListener("DOMContentLoaded", () => {
    if (!palco) return;

    document.querySelectorAll(".horario-tabela tbody tr").forEach(tr => {
        const palcoLinha = tr.cells[2].textContent.trim();
        tr.hidden = palcoLinha !== palco;
    });
});

function pesquisar_horarios() {
    const termo = document.getElementById("barra_pesquisa").value.toLowerCase();
    document.querySelectorAll(".horario-tabela tbody tr").forEach(tr => {
        const artista = tr.cells[0].textContent.toLowerCase();
        const linhaPalco = tr.cells[2].textContent.trim();
        tr.hidden = (palco && linhaPalco !== palco) || !artista.includes(termo);
    });
}

document.addEventListener("DOMContentLoaded", pesquisar_horarios);

document.addEventListener("DOMContentLoaded", () => {
    if (!tipo) return;

    titulo.textContent = "Artistas";
    document.querySelector(".horario-tabela").hidden = true;
    document.querySelector(".barra").hidden = true;

    const main = document.querySelector("main");
    const div = document.createElement('div');
    div.className = 'listaArtistas';

    document.querySelectorAll(".horario-tabela tbody tr").forEach(tr => {
        const artista = tr.cells[0].textContent;
        const dia = tr.cells[3].textContent;
        const div_artista = document.createElement('div');
        div_artista.className = 'div_artista';

        const artistaSpan = document.createElement('p');
        artistaSpan.textContent = artista;
        artistaSpan.className = 'artistaSpan';
        const diaSpan = document.createElement('p');
        diaSpan.textContent = "Dia: " + dia;

        div_artista.appendChild(artistaSpan);
        div_artista.appendChild(diaSpan);
        div.appendChild(div_artista);
    });

    main.appendChild(div);
});
