const chaveSocorro = "bandy.socorroAtivo";
const estadoSocorro = document.getElementById("estado-socorro");
const avisoSocorro = document.getElementById("socorro-enviado");
const fecharSocorro = document.getElementById("fechar-socorro");
const cancelarSocorro = document.getElementById("cancelar-socorro");
const confirmarSocorro = document.querySelector(
    '#pedir-socorro a[href="#socorro-enviado"]'
);

function atualizarSocorro() {
    const ativo = sessionStorage.getItem(chaveSocorro) === "1";
    estadoSocorro.hidden = !ativo;
    avisoSocorro.hidden = !ativo;
}

function fecharAvisoSocorro() {
    window.location.replace("#estado-socorro");
}

confirmarSocorro.addEventListener("click", () => {
    sessionStorage.setItem(chaveSocorro, "1");
    atualizarSocorro();
});

fecharSocorro.addEventListener("click", () => {
    fecharAvisoSocorro();
    estadoSocorro.focus();
});

cancelarSocorro.addEventListener("click", () => {
    sessionStorage.removeItem(chaveSocorro);
    fecharAvisoSocorro();
    atualizarSocorro();
    document.querySelector('a[href="#pedir-socorro"]')?.focus();
});

window.addEventListener("pageshow", atualizarSocorro);
atualizarSocorro();