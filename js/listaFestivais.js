const pag = document.querySelector(".bilhetesCompra");
const criados = JSON.parse(localStorage.getItem("festivaisCriados") || "[]");

for (const f of criados) {
    const a = document.createElement("a");
    a.className = "bilhetes_festival";
    a.href = "pag_SuperBock.html?" + new URLSearchParams({
        festival: f.nome,
        datas: f.datas,
        id: f.id
    });

    const btn = document.createElement("button");
    btn.className = "festivais";

    const img = document.createElement("img");
    img.alt = "imagem de festival";
    img.className = "imgFestival";
    img.src = f.logo;

    const p = document.createElement("p");
    p.textContent = f.nome;

    btn.appendChild(img);
    btn.appendChild(p);
    a.appendChild(btn);
    pag.appendChild(a);
}