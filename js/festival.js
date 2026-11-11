const parametros = new URLSearchParams(window.location.search);
const nomeFestival = parametros.get("festival");
const dataFestival = parametros.get("datas");
const idFestival = parametros.get("id");

const tituloSpan = document.getElementById("titulo");
tituloSpan.textContent = nomeFestival;

const dataSpan = document.getElementById("datas");
dataSpan.textContent = "Datas: " + dataFestival;

const logoSpan = document.getElementById("logo");
logoSpan.src = "../files/festivais/logo" + idFestival + ".png";
logoSpan.alt = "Logo do Festival";

const cartazSpan = document.getElementById("imgCartaz");
cartazSpan.src = "../files/festivais/cartaz" + idFestival + ".png";
cartazSpan.alt = "Cartaz do Festival";