const origem = new URLSearchParams(location.search).get('origem');
const recibo = document.getElementById("destino-pagamento");

if(origem === "bar"){
    recibo.href = 'festivalhome.html';
}
else{
    recibo.href = 'bilhetes.html';
}
