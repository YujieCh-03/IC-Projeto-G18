const MIN = 0;
const MAX = 10;
const totalSpan = document.getElementById("total");

dicionarioPrecos = {
    item1: 0.50,
    item2: 1.0,
    item3: 1.75,
    item4: 1.2,
    item5: 1.0,
    item6: 3.0,
    item7: 3.0,
    item8: 3.0,
    item9: 2.0,
}
dicionarioIntems = {
    item1: "Copo 50cl",
    item2: "Super Bock, 25cl",
    item3: "Super Bock, 50cl",
    item4: "Somersby, 25cl",
    item5: "Água, 50cl",
    item6: "Sandes de Ovo",
    item7: "Bifana",
    item8: "Seitana (veg)",
    item9: "Sopa",
}



document.addEventListener("click", (event) => {
    const btn = event.target.closest(".btn-menos, .btn-mais");
    if (!btn) return;
    const span = btn.parentElement.querySelector("span");


    let qtd = parseInt(span.textContent);

    if (btn.classList.contains("btn-menos")){
        if (qtd > MIN) {
           qtd -= 1
        }
    }
    if (btn.classList.contains("btn-mais")){
        if (qtd < MAX) {
            qtd += 1
        }
    }

    span.textContent = qtd;
    atualizarTotal();
});

function atualizarTotal(){
    let total = 0;
    
    document.querySelectorAll('[id^="quantidade-item"]').forEach(span => {
        const qtd = parseInt(span.textContent);
        const numero = span.id.replace("quantidade-item", "");
        const chave = "item" + numero;
        total += qtd * dicionarioPrecos[chave];
    });
    totalSpan.textContent = total;
}

document.getElementById("pedir_bar").addEventListener("click", () => {
    let total = 0;

    document.querySelectorAll('[id^="quantidade-item"]').forEach(span => {
        const qtd = parseInt(span.textContent);

        if (qtd==0) return;

        const item = []

        const numero = span.id.replace("quantidade-item", "");
        const chave = "item" + numero;
        const preco_item = qtd * dicionarioPrecos[chave];

        item.push(dicionarioIntems[chave]);
        item.push(dicionarioPrecos[chave]);
        item.push(qtd);
        item.push(preco_item);
        sessionStorage.setItem(chave, JSON.stringify(item));

        total += preco_item;
    });
    sessionStorage.setItem("total_pedido", total);
})