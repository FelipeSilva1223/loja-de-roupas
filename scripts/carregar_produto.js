const produtos = JSON.parse(sessionStorage.getItem('itemAtual'))
const frete = sessionStorage.getItem('frete')
let msg = ""
if(produtos.nome === 'carrinho') {
    let carrinho = JSON.parse(sessionStorage.getItem('carrinho'));
    carrinho.forEach(element => {
        msg += element.nome + '<br>'
    });
} else {
    msg = produtos.nome;
}
const card = document.getElementById('card_produtos');
const html = `  <div class="card-body">
                    <h5>Produtos</h5>
                    <ul class="list-group list-group-flush">
                        <li class="list-group-item">${msg}</li>
                    </ul>
                </div>
                <div class="card mb-3 p-3">
                    <div class="card-body">
                        <h5>Total</h5>
                        <div class="d-flex justify-content-between mb-3">
                            <span id="frete_span" class="card-text">Frete:</span><span id="frete_valor" class="card-text fw-bold">R$ ${Number(frete).toFixed(2).replace(".", ",")}</span>
                        </div>
                        <div class="d-flex justify-content-between">
                            <span id="total_span" class="card-text">Total: </span><span id="total_valor" class="card-text fw-bold">R$ ${(Number(produtos.valor) + Number(frete)).toFixed(2).replace(".", ",")}</span>
                        </div>
                    </div>
                </div> `
card.insertAdjacentHTML("beforeend", html)