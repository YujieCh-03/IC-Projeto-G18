const MIN = 1;
const MAX = 10;

const qtdSpan = document.getElementById("quantidade-bilhetes");
const btnMenos = document.getElementById("btn-menos");
const btnMais = document.getElementById("btn-mais");

btnMenos.addEventListener("click", () => {
  let qtd = parseInt(qtdSpan.textContent);
  if (qtd > MIN) {
    qtdSpan.textContent = qtd - 1;
  }
});

btnMais.addEventListener("click", () => {
  let qtd = parseInt(qtdSpan.textContent);
  if (qtd < MAX) {
    qtdSpan.textContent = qtd + 1;
  }
});