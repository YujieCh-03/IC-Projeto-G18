const origem = new URLSearchParams(location.search).get('origem');
const recibo = document.getElementById("destino-pagamento");

if(origem === "bar"){
    recibo.href = 'festivalhome.html';
}
else{
    recibo.href = 'bilhetes.html';
}

document.querySelector('#save .primario') .href='main.html';
const botaoOK = document.querySelector("#save .primario");

if (origem === "bar") {
    botaoOK.href = "festivalhome.html";
} else {
    botaoOK.href = "main.html";
}