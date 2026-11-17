const ritmoCardiaco = document.getElementById("ritmo-cardiaco");

let batimentos = 70;
let direcao = 1;

if (ritmoCardiaco) {
    setInterval(function () {
        batimentos += direcao;

        if (batimentos === 90) {
            direcao = -1;
        } else if (batimentos === 70) {
            direcao = 1;
        }

        ritmoCardiaco.textContent = batimentos;
    }, 1000);
}