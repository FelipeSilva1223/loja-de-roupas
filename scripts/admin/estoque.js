const token = sessionStorage.getItem('token') || localStorage.getItem('token');

let cardDetalhes = document.getElementById('card_detalhes');
let estoque = [];
let itemAtual;
async function carregarEstoque() {
    try {
        const resposta = await fetch(`${API_URL}/estoque/admin`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        estoque = await resposta.json();

        const divLista = document.getElementById('lista_estoque');
        cardDetalhes = document.getElementById('card_detalhes');
        divLista.innerHTML = '';

        estoque.forEach(roupa => {
            const botao = document.createElement('button');

            botao.id = `produto-${roupa.id}`;
            botao.classList.add('list-group-item');
            botao.classList.add('list-group-item-action');
            botao.innerText = roupa.nome;

            botao.addEventListener('click', function () {
                itemAtual = roupa.id;
                document.querySelectorAll('#lista_estoque button')
                    .forEach(btn => btn.classList.remove('active'));

                botao.classList.add('active');
                selecionarItem(roupa);
            });

            divLista.insertAdjacentElement('beforeend', botao);
        });

        if (itemAtual) {
            const item = estoque.find(i => i.id === itemAtual);
            selecionarItem(item);

            const botaoAtual = document.getElementById(`produto-${itemAtual}`);

            if (botaoAtual) {
                botaoAtual.classList.add('active');
            };
            return;
        };

        if (estoque && estoque.length > 0) {
            selecionarItem(estoque[0]);

            const primeiroBotao = document.querySelector('#lista_estoque button');

            if (primeiroBotao) {
                primeiroBotao.classList.add('active');
            };
        };
    } catch (erro) {
        console.log(erro);
    };
};
function selecionarItem(item) {
    let html = `
        <div class="card mt-2">
            <div id="album" class="carousel carousel-dark slide mt-2">
                <div class="carousel-inner" id="carousel"></div>

                <button class="carousel-control-prev" type="button" data-bs-target="#album" data-bs-slide="prev">
                    <span class="carousel-control-prev-icon" aria-hidden="true"></span>
                    <span class="visually-hidden">Previous</span>
                </button>

                <button class="carousel-control-next" type="button" data-bs-target="#album" data-bs-slide="next">
                    <span class="carousel-control-next-icon" aria-hidden="true"></span>
                    <span class="visually-hidden">Next</span>
                </button>
            </div>

            <div class="m-2 d-flex justify-content-center gap-2">
                <button type="button" class="btn btn-danger btn-sm mt-1 " id="btn_apagar">Apagar</button>
                <button type="button" class="btn btn-warning btn-sm mt-1" id="btn_liquidar">Liquidar</button>
            </div>

            <div class="card-body" id="card_detalhes">
                <h5 class="card-title">${item.nome}</h5>
                <h5>Valor: ${item.valor}</h5>
                <h5>Status : ${item.status}</h5>
                <h5>Liquidação: ${item.em_liquidacao === 1 ? 'Sim' : 'Não'}</h5>
                <div class="input-group mb-2">
                    <span class="input-group-text">Val. liquidação</span>
                    <input type="number" step="0.01" min="0" class="form-control" style="min-width: 50px;" id="input_liquidacao" value="${item.valor_liquidado}" disabled>
                </div>
                <button class="btn btn-secondary btn-sm" id="btn_editar_liquidacao">Editar liquidação</button>
                <button class="btn btn-primary btn-sm d-none" id="salvar">Salvar</button>
                <button class="btn btn-secondary btn-sm d-none" id="cancelar">Cancelar</button>
            </div>
        </div>`;

    cardDetalhes.innerHTML = html;

    const carousel = document.getElementById('carousel');

    item.imagens.forEach((imagem, index) => {
        carousel.innerHTML += `
            <div class="carousel-item ${index === 0 ? 'active' : ''}">
                <div class="d-flex justify-content-center">
                    <img src="${API_URL + imagem}"
                        alt="${item.nome}"
                        style="max-width: 500px; max-height: 300px;">
                </div>
            </div>`;
    });

    document.getElementById('btn_apagar').addEventListener('click', () => apagarItem(item.id));
    document.getElementById('btn_liquidar').addEventListener('click', () => liquidarItem(item.id, item.em_liquidacao));
    document.getElementById('btn_editar_liquidacao').addEventListener('click', () => {
        document.getElementById('input_liquidacao').disabled = false;
        document.getElementById('salvar').classList.remove('d-none');
        document.getElementById('cancelar').classList.remove('d-none');
        document.getElementById('btn_editar_liquidacao').classList.add('d-none');
    });
    document.getElementById('salvar').addEventListener('click', () => {
        salvarLiquidacao(item.id);
    })
    document.getElementById('cancelar').addEventListener('click', () => {
        document.getElementById('input_liquidacao').value = item.valor_liquidado;
        document.getElementById('input_liquidacao').disabled = true;
        document.getElementById('salvar').classList.add('d-none');
        document.getElementById('cancelar').classList.add('d-none');
        document.getElementById('btn_editar_liquidacao').classList.remove('d-none');
    });
};

async function apagarItem(id) {
    try {
        const resposta = await fetch(`${API_URL}/estoque/${id}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        const resultado = await resposta.json();

        document.getElementById(`produto-${id}`).remove();
        document.getElementById('card_detalhes').innerHTML = '';

    } catch (erro) {
        console.log(erro);
    };
};

async function liquidarItem(id, old_bool) {
    try {
        const new_bool = old_bool === 1 ? 0 : 1;

        const resposta = await fetch(`${API_URL}/estoque/liquidar/${id}`, {
            method: 'PATCH',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                bool_liquidacao: new_bool
            })
        });

        const resultado = await resposta.json();

        carregarEstoque();

    } catch (erro) {
        console.log(erro);
    };
};

async function salvarLiquidacao(id) {
    try {
        const valor = document.getElementById('input_liquidacao').value;

        const resposta = await fetch(`${API_URL}/estoque/valor-liquidacao/${id}`, {
            method: 'PATCH',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                valor: valor
            })
        });

        const resultado = await resposta.json();
        carregarEstoque()
    } catch (erro) {
        console.log(erro);
    }
}
carregarEstoque();

function pesquisarProduto() {
    const termo = document
        .getElementById('input_pesquisa')
        .value
        .trim()
        .toLowerCase();

    const produtoEncontrado = estoque.find(produto =>
        produto.nome.toLowerCase().includes(termo)
    );

    if (!produtoEncontrado) {
        alert('Produto não encontrado');
        return;
    };

    selecionarItem(produtoEncontrado);

    document.querySelectorAll('#lista_estoque button')
        .forEach(btn => btn.classList.remove('active'));

    const botao = document.getElementById(`produto-${produtoEncontrado.id}`);

    if (botao) {
        botao.classList.add('active');
    };
};
document.getElementById('input_pesquisa')
    .addEventListener('keydown', function (e) {
        if (e.key === 'Enter') {
            pesquisarProduto();
        };
    });
document.getElementById('btn_pesquisar')
    .addEventListener('click', pesquisarProduto);