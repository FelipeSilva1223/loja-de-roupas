    // Carrega o produto
const params = new URLSearchParams(window.location.search);
const id = params.get("id");

let produto;

async function carregarProduto() {
    try {
        const resposta = await fetch(`${API_URL}/estoque/${id}`);

        if (!resposta.ok) {
            throw new Error(`Erro HTTP: ${resposta.status}`);
        }

        const item = await resposta.json();

        produto = item;

        const parcelado = item.valor / 3;
        const detalhes = item.detalhes;

        const row = document.getElementById("row_detalhes");

        const divProduto = `
            <div class="col-12 col-md-6 pt-3">
                <div class="card">
                    <div id="album" class="carousel carousel-dark slide">
                        <div class="carousel-inner" id='carousel'></div>

                        <button class="carousel-control-prev" type="button" data-bs-target="#album" data-bs-slide="prev">
                            <span class="carousel-control-prev-icon"></span>
                        </button>

                        <button class="carousel-control-next" type="button" data-bs-target="#album" data-bs-slide="next">
                            <span class="carousel-control-next-icon"></span>
                        </button>
                    </div>
                </div>
            </div>

            <div class="col-12 col-md-6 py-2">
                <div class="card mt-2">
                    <div class="card-body">
                        <p class="card-title" id="nome_produto">${item.nome}</p>
                        <p class="card-title fw-bold ${Number(item.em_liquidacao) === 1 ? `text-decoration-line-through` : ``}">
                            ${Number(item.valor).toLocaleString("pt-BR", {
                                style: "currency",
                                currency: "BRL"
                            })}
                        </p>
                        ${Number(item.em_liquidacao) === 1 ? `<p class="card-title fw-bold">${Number(item.valor_liquidado).toLocaleString("pt-BR",{ 
                            style: "currency",
                            currency: "BRL"
                            })}</p>` : ``}
                    </div>
                </div>

                <div class="py-3">
                    <button class="btn btn-custom-primary" onclick="selecionarItem()">Comprar</button>
                    <button class="bi-cart4 btn btn-custom-warning" onclick="addCarrinho()" id="btn_add_carrinho">
                        Carrinho
                    </button>
                </div>
            </div>

            <div class="col-12 col-md-6 py-2">
                <div class="card py-2 px-3">
                    <p style="white-space: pre-line;">${detalhes}</p>
                </div>
            </div>`;

        row.insertAdjacentHTML("beforeend", divProduto);

        const carousel = document.getElementById('carousel');

        item.imagens.forEach((imagem, index) => {
            carousel.innerHTML += `
                <div class="carousel-item ${index === 0 ? 'active' : ''}">
                    <img src="${API_URL + imagem}" alt="${item.nome}"
                        style="height: 300px; object-fit: contain;"
                        class="d-block w-100">
                </div>`;
        });

        document.getElementById("btn_add_carrinho")
            .addEventListener("click", function () {
                const botao = this;

                try {
                    botao.textContent = " Adicionado";
                    botao.classList.remove("btn-warning");
                    botao.classList.add("btn-outline-warning");

                    setTimeout(() => {
                        botao.textContent = " Carrinho";
                        botao.classList.remove("btn-outline-warning");
                        botao.classList.add("btn-warning");
                    }, 2000);

                } catch (erro) {
                    alert("Não foi possível adicionar.");
                }
            });

    } catch (erro) {
        console.log(erro);
    }
}

carregarProduto();
    
let carrinho = JSON.parse(sessionStorage.getItem('carrinho')) ?? []
function addCarrinho(){
    carrinho.push({
                'id': produto.id, 
                'nome': produto.nome,
                'valor': produto.valor,
                'em_liquidacao': produto.em_liquidacao,
                'valor_liquidado': produto.valor_liquidado, 
                'img_path': produto.imagens[0]
    });
    sessionStorage.setItem('carrinho', JSON.stringify(carrinho));
    atualizar();
};

// Botão comprar
function selecionarItem() {
    sessionStorage.setItem(
        'itemAtual',
            JSON.stringify({
            'id': produto.id,
            'nome': produto.nome, 
            'valor': produto.valor, 
            'em_liquidacao': produto.em_liquidacao,
            'valor_liquidado': produto.valor_liquidado,
            'img_path': produto.img_path}))
    window.location.href = 'finalizar-compra.html';
};