const produtos = JSON.parse(sessionStorage.getItem('itemAtual'));
const frete = sessionStorage.getItem('frete');
let msg = "";
let itensRelatorio;
if(produtos.nome === 'carrinho') {
    const carrinho = JSON.parse(sessionStorage.getItem('carrinho'))
    itensRelatorio = carrinho
    carrinho.forEach(element => {
        msg += `<li class="list-group-item d-flex justify-content-between align-items-center">${element.nome}<span>R$ ${Number(element.valor).toFixed(2).replace(".", ",")}</span></li>`
    });
} else {
    msg = produtos.nome;
    itensRelatorio = [produtos]
}
const card = document.getElementById('card_produtos');
const html = `  <div class="card-body">
                    <h5>Produtos</h5>
                    <ul class="list-group list-group-flush">
                        ${msg}
                    </ul>
                </div>
                <div class="card mb-3 p-3">
                    <div class="card-body">
                        <div class="d-flex justify-content-between mb-3">
                            <span class="card-text">Total:</span><span class="card-text fw-bold">R$ ${Number(produtos.valor).toFixed(2).replace(".", ",")}</span>
                        </div>
                        <div class="d-flex justify-content-between mb-3">
                            <span id="frete_span" class="card-text">Frete:</span><span id="frete_valor" class="card-text fw-bold">R$ ${Number(frete).toFixed(2).replace(".", ",")}</span>
                        </div>
                        <div class="d-flex justify-content-between">
                            <span id="total_span" class="card-text">Total: </span><span id="total_valor" class="card-text fw-bold">R$ ${(Number(produtos.valor) + Number(frete)).toFixed(2).replace(".", ",")}</span>
                        </div>
                    </div>
                </div> `
card.insertAdjacentHTML("beforeend", html);

// Lógica para aplicar ou não entrega/frete no formulário
const inputEndereco = document.getElementById('endereco')
document.addEventListener("change", function (e) {
    if (e.target.id === "radio_entrega") {
        document.getElementById("card_endereco").classList.remove("d-none")
        inputEndereco.required = true;
    };
    if (e.target.id === "radio_retirada") {
        document.getElementById("card_endereco").classList.add("d-none")
        inputEndereco.required = false;
        let span_total = document.getElementById('total_valor');
        let span_frete = document.getElementById('frete_valor')
        sessionStorage.setItem('frete', 0)
        span_frete.innerText = `R$ 0,00`
        span_total.innerText = `R$ ${(Number(produtos.valor)).toFixed(2).replace(".", ",")}`
    };
    if (e.target.id === "forma_de_pagamento") {
        if (e.target.value === "Crédito") {
            document.getElementById("qtd_parcelas").classList.remove("d-none")
        } else {
            document.getElementById("qtd_parcelas").classList.add("d-none")
        };
    };
});

// Aplicação do frete ao valor total
inputEndereco.addEventListener('blur', function (){
    if(this.value.trim() === "") return;
    //const produtos = JSON.parse(sessionStorage.getItem('itemAtual'))
    let span_total = document.getElementById('total_valor');
    let span_frete = document.getElementById('frete_valor')
    //calcularFrete()
    sessionStorage.setItem('frete', 10)
    let frete = Number(sessionStorage.getItem('frete'))
    span_frete.innerText = `R$ ${(frete).toFixed(2).replace(".", ",")}`
    span_total.innerText = `R$ ${(Number(produtos.valor) + frete).toFixed(2).replace(".", ",")}`
})

// Envio do formulário
const formulario = document.getElementById('formulario')
formulario.addEventListener('submit', function (e){
    e.preventDefault();
    if (!formulario.checkValidity()){
        formulario.classList.add("was-validated");
        return;
    }
    let radioEntrega = document.getElementById('radio_entrega').checked;
    let radioRetirada = document.getElementById('radio_retirada').checked;
    let entrega = ''
    let endereco = ''
    let parcelas = ''
    let frete = JSON.parse(sessionStorage.getItem('frete'))
    let pagamento = document.getElementById('forma_de_pagamento').value;
    if (radioEntrega){
        entrega = "Entrega"
        endereco = document.getElementById('endereco').value;
    };
    if (radioRetirada){
        entrega = "Retirada"
    };
    if (pagamento === 'Crédito'){
        parcelas = document.getElementById('qtd_parcelas').value
    };
    const data = new Date().toLocaleDateString("pt-BR", {timeZone: "America/Sao_Paulo"})
    let relatorio = {id:1, itens: itensRelatorio, modoEntrega:entrega, endereco:endereco, formaPagamento:pagamento, parcelas:parcelas, total:(Number(produtos.valor) + Number(frete)), data:data}
    sessionStorage.setItem('mensagem', JSON.stringify(relatorio))
    //sessionStorage.setItem('carrinho', JSON.stringify([]));
    //sessionStorage.setItem('itemAtual', JSON.stringify({}))
    window.location.href = "preparacao.html"
});