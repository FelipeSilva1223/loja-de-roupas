const produtos = JSON.parse(sessionStorage.getItem('itemAtual'));
const selectBairros = document.getElementById('bairro');
let fretes = [];
let valorFrete = 0;

async function carregarFretes(){
    try {
        const resposta = await fetch(`${API_URL}/pedidos/fretes`, {
            method: 'GET',
        })
        fretes = await resposta.json();
        
        fretes.forEach(frete => {
            selectBairros.insertAdjacentHTML('beforeend', `<option value="${frete.bairro}">${frete.bairro}</option>`)
        })
    } catch (erro) {
        console.log(erro);
        return;
    };
    aplicarFrete();
}
carregarFretes();

let msg = "";
let itensRelatorio;
if(produtos.nome === 'carrinho') {
    const carrinho = JSON.parse(sessionStorage.getItem('carrinho'))
    itensRelatorio = carrinho
    carrinho.forEach(element => {
        msg += `<li class="list-group-item d-flex justify-content-between align-items-center">${element.nome}<span>R$ ${Number((element.em_liquidacao === 1) ? element.valor_liquidado : element.valor).toFixed(2).replace(".", ",")}</span></li>`
    });
} else {
    msg = `<li class="list-group-item d-flex justify-content-between align-items-center">${produtos.nome}<span>R$ ${Number((produtos.em_liquidacao === 1) ? produtos.valor_liquidado : produtos.valor).toFixed(2).replace(".", ",")}</span></li>`;
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
                        ${(produtos.nome === 'carrinho') ? `<span class="card-text">Total:</span><span class="card-text fw-bold">R$ ${Number(produtos.valor).toFixed(2).replace(".", ",")}</span>` : `<span class="card-text">Total:</span><span class="card-text fw-bold">R$ ${Number((produtos.em_liquidacao === 1) ? produtos.valor_liquidado : produtos.valor).toFixed(2).replace(".", ",")}</span>`}
                        </div>
                        <div class="d-flex justify-content-between mb-3">
                            <span id="frete_span" class="card-text">Frete:</span><span id="frete_valor" class="card-text fw-bold">R$ 0,00</span>
                        </div>
                        <div class="d-flex justify-content-between">
                            <span id="total_span" class="card-text">Valor Final: </span><span id="total_valor" class="card-text fw-bold">R$ ${(produtos.nome === 'carrinho') ? Number(produtos.valor) : Number((produtos.em_liquidacao === 1) ? produtos.valor_liquidado : produtos.valor + Number(0)).toFixed(2).replace(".", ",")}</span>
                        </div>
                    </div>
                </div> `
card.insertAdjacentHTML("beforeend", html);

// Lógica para aplicar ou não entrega/frete no formulário
const inputEndereco = document.getElementById('endereco');
document.addEventListener("change", function (e) {
    if (e.target.id === "radio_entrega") {
        aplicarFrete();
        document.getElementById("card_endereco").classList.remove("d-none");
        inputEndereco.required = true;
        selectBairros.required = true;
    };
    if (e.target.id === "radio_retirada") {
        document.getElementById("card_endereco").classList.add("d-none");
        inputEndereco.required = false;
        selectBairros.required = false;
        let span_total = document.getElementById('total_valor');
        let span_frete = document.getElementById('frete_valor');
        span_frete.innerText = `R$ 0,00`;
        span_total.innerText = `R$ ${(produtos.nome === 'carrinho') ? Number(produtos.valor) : Number((produtos.em_liquidacao === 1) ? produtos.valor_liquidado : produtos.valor).toFixed(2).replace(".", ",")}`
    };
    if (e.target.id === "forma_de_pagamento") {
        if (e.target.value === "Crédito") {
            document.getElementById("qtd_parcelas").classList.remove("d-none");
        } else {
            document.getElementById("qtd_parcelas").classList.add("d-none");
        };
    };
});

function aplicarFrete() {
    let span_total = document.getElementById('total_valor');
    let span_frete = document.getElementById('frete_valor')
    const bairroSelecionado = document.getElementById('bairro').value;
    const bairro = fretes.find(f => f.bairro === bairroSelecionado);
    valorFrete = Number(bairro.valor);
    span_frete.innerText = `R$ ${valorFrete.toFixed(2).replace(".", ",")}`
    span_total.innerText = `R$ ${(produtos.nome === 'carrinho') ? Number(produtos.valor) : (Number((produtos.em_liquidacao === 1) ? produtos.valor_liquidado : produtos.valor) + valorFrete).toFixed(2).replace(".", ",")}`
};

selectBairros.addEventListener('change', aplicarFrete);

// Envio do formulário
document.getElementById('btn_confirmar').addEventListener('click', enviarFormulario);

async function enviarFormulario(e) {
    const formulario = document.getElementById('formulario');

    const nome = document.getElementById('input_nome').value.trim();
    const telefone = document.getElementById('input_telefone').value.trim();
    const enderecoInput = document.getElementById('endereco');
    const selectBairro = document.getElementById('bairro');

    const radioEntrega = document.getElementById('radio_entrega').checked;
    const radioRetirada = document.getElementById('radio_retirada').checked;

    if (radioEntrega) {
        enderecoInput.required = true;
        selectBairro.required = true;
        aplicarFrete();
    } else {
        enderecoInput.required = false;
        selectBairro,require = false;
        enderecoInput.value = "";
        valorFrete = 0;
    };

    if (!formulario.checkValidity()) {
        formulario.classList.add("was-validated");
        alert("Dados de entrega faltando.")
        return;
    };

    if (!nome || nome.length > 80) {
        document.getElementById('input_nome').classList.add('is-invalid');
        document.getElementById('erro_nome').classList.add('d-block');
        return;
    };

    if (!telefone || telefone.length > 20) {
        document.getElementById('input_telefone').classList.add('is-invalid');
        document.getElementById('erro_tel').classList.add('d-block');
        return;
    };

    if (!radioEntrega && !radioRetirada) {
        alert("Escolha entrega ou retirada.");
        return;
    };

    if (radioEntrega && !enderecoInput.value.trim()) {
        alert("Informe o endereço para entrega.");
        return;
    };

    let entrega = "";
    let endereco = "";
    let parcelas = 0;

    let pagamento = document.getElementById('forma_de_pagamento').value;

    if (radioEntrega) {
        entrega = "entrega";
        endereco = enderecoInput.value.trim();
    }

    if (radioRetirada) {
        entrega = "retirada";
    }

    if (pagamento === 'Crédito') {
        parcelas = Number(document.getElementById('qtd_parcelas').value);
        pagamento = 'credito';
    }

    if (pagamento === 'Débito') {
        pagamento = 'debito';
    }

    if (pagamento === 'Pix') {
        pagamento = 'pix';
    }

    if (pagamento === 'A combinar') {
        pagamento = 'a_combinar';
    }

    const pedido = {
        nomeCliente: nome,
        telefone: telefone,
        itens: itensRelatorio,
        modoEntrega: entrega,
        endereco: endereco,
        formaPagamento: pagamento,
        parcelas: parcelas,
        total: Number(produtos.valor) + valorFrete,
        frete: valorFrete,
        status: "pendente"
    };

    try {
        const resposta = await fetch(`${API_URL}/pedidos`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(pedido)
        });

        const dados = await resposta.json();

        if (!resposta.ok) {
            console.log(dados);
            alert(dados.mensagem || "Erro ao finalizar pedido.");
            return;
        }

        sessionStorage.setItem('mensagem', JSON.stringify(dados));
        sessionStorage.setItem('carrinho', JSON.stringify([]));
        sessionStorage.setItem('itemAtual', JSON.stringify({}));

        window.location.href = "preparacao.html";

    } catch (erro) {
        console.log("Erro ao enviar o pedido", erro);
        alert("Erro ao enviar o pedido.");
    }
}