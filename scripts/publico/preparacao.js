const mensagem = JSON.parse(sessionStorage.getItem('mensagem'))
const div = document.getElementById('resumo')
let resumo = `Pedido #${mensagem.pedido_id}<br>Qtd. Itens: ${mensagem.pedido.itens.length}<br>Modo de entrega: ${mensagem.pedido.modoEntrega}<br>Total: R$: ${Number(mensagem.pedido.total).toFixed(2).replace(".", ",")}`
div.innerHTML = resumo;
sessionStorage.removeItem('carrinho')

document.getElementById("btn_copiar_pix").addEventListener("click", async function () {

    const codigo = document.getElementById("codigo_pix").value;
    const botao = this;

    try {
        await navigator.clipboard.writeText(codigo);

        botao.textContent = "Código copiado";
        botao.classList.remove("btn-outline-secondary");
        botao.classList.add("btn-outline-primary");

        setTimeout(() => {
            botao.textContent = "Copiar código Pix";
            botao.classList.remove("btn-outline-primary");
            botao.classList.add("btn-outline-secondary");
        }, 2000);

    } catch (erro) {
        alert("Não foi possível copiar.");
    }
});