const numero = document.getElementById("number");
const validade = document.getElementById("expiry");

function lerDigitos(texto, limite) {
    let digitos = '';
    for (let i = 0; i < texto.length; i++) {
        const caractere = texto[i];
        if (caractere >= '0' && caractere <= '9') {
            digitos += caractere;
        }
    }
    return digitos.slice(0, limite);
}

numero.addEventListener('input', function () {
    const digitos = lerDigitos(numero.value, 16);
    let formatado = '';
    for (let i = 0; i < digitos.length; i++) {
        if (i > 0 && i % 4 === 0) {
            formatado += ' ';
        }
        formatado += digitos[i];
    }
    numero.value = formatado;
});

validade.addEventListener('input', function () {
    const digitos = lerDigitos(validade.value, 4);
    if (digitos.length > 2) {
        validade.value = digitos.slice(0, 2) + '/' + digitos.slice(2);
    } else {
        validade.value = digitos;
    }
});
