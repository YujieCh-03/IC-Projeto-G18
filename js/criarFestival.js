const form = document.getElementById("form_festival");

function lerImagem(input) {
    return new Promise((resolve, reject) => {
        const leitor = new FileReader();
        leitor.onload = () => resolve(leitor.result);
        leitor.onerror = reject;
        leitor.readAsDataURL(input.files[0]);
    });
}

form.addEventListener("submit", async (event) => {
    event.preventDefault();

    const nome = document.getElementById("nome_festival").value.trim();
    const datas = document.getElementById("datas_festival").value.trim();
    const cartazInput = document.getElementById("cartazNovo");
    const logoInput = document.getElementById("logoNovo");

    if (!datas.includes(" de ")) {
        alert("Escreva as datas assim: 18, 19 e 20 de Julho 2027");
        return;
    }
    if (!cartazInput.files[0] || !logoInput.files[0]) {
        alert("Escolha o cartaz e o logo.");
        return;
    }

    const lista = JSON.parse(localStorage.getItem("festivaisCriados") || "[]");
    const festival = {
        id: lista.length ? Math.max(...lista.map(f => f.id)) + 1 : 8,
        nome: nome,
        datas: datas,
        logo: await lerImagem(logoInput),
        cartaz: await lerImagem(cartazInput)
    };
    lista.push(festival);

    try {
        localStorage.setItem("festivaisCriados", JSON.stringify(lista));
    } catch {
        alert("Não foi possível guardar o festival. Tente imagens mais pequenas.");
        return;
    }

    location.href = "pag_comprarBilhetes.html";
});