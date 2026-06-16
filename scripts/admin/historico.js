const token = sessionStorage.getItem('token') || localStorage.getItem('token');
const tbody = document.getElementById('tbody');

let paginaAtual = 1;
const limite = 10;

async function carregarHistorico() {
    try {
        const resposta = await fetch(`${API_URL}/pedidos/historico?page=${paginaAtual}&limit=${limite}`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        if (!resposta.ok) {
            throw new Error(`Erro HTTP: ${resposta.status}`);
        }

        const dados = await resposta.json();

        tbody.innerHTML = ''
        const html = document.getElementById('div_principal')

        dados.pedidos.forEach(pedido => {
            tbody.innerHTML += `
                <tr>
                    <th>${pedido.id}</th>
                    <td>${pedido.nome_cliente}</td>
                    <td>${new Date(pedido.criado_em).toLocaleString("pt-BR", {
                        day: '2-digit',
                        month: '2-digit',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                    })}</td>
                    <td class="text-${(pedido.status === "finalizado" ? "success" : "danger")} fw-bold">${pedido.status}</td>
                    <td>
                        <button class="btn btn-outline-secondary btn-sm" data-bs-toggle="modal" data-bs-target="#modal_detalhes" onclick="verPedido(${pedido.id})">Detalhes</button>
                    </td>
                </tr>`;
        });
        criarPaginacao(dados.totalPaginas)
    } catch (erro) {
        console.log(erro);
    };
};

async function verPedido(id) {
    try {
        const resposta = await fetch(`${API_URL}/pedidos/historico/${id}`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        if (!resposta.ok) {
            throw new Error(`Erro HTTP: ${resposta.status}`);
        };

        const pedido = await resposta.json();

        let itensPedido = [];

        pedido.forEach(item => {
            itensPedido.push(item.nome);
        });
        console.log(pedido)
        const modal_body = document.getElementById('modal_body');
        modal_body.innerHTML = `
            <p>Pedido #${id}</p>
            <p>Nome do cliente: ${pedido[0].nome_cliente}</p>
            <p>Numero: ${pedido[0].telefone_cliente}</p>
            <p>Data do pedido: ${new Date(pedido[0].criado_em).toLocaleString("pt-BR", {
                        day: '2-digit',
                        month: '2-digit',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                    })}</p>
            <p>Itens: ${itensPedido.join(", ")}</p>
            <p>Forma de entrega: ${pedido[0].forma_entrega.replace(/^./, letra => letra.toUpperCase())}</p>
            <p>Valor total: ${Number(pedido[0].total).toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}</p>
            <p>Forma de pagamento: ${pedido[0].forma_pagamento.replace('_', ' ').replace(/^./, letra => letra.toUpperCase())}</p>`;

    } catch (erro) {
        console.log(erro);
    };
};

function criarPaginacao(totalPaginas) {
    const paginacao = document.getElementById('paginacao');
    paginacao.innerHTML = ''

    paginacao.innerHTML += `
        <li class="page-item ${paginaAtual === 1 ? 'disabled' : ''}">
            <button class="page-link" onclick="paginaAnterior()">
                Anterior
            </button>
        </li>
    `;

    for (let i = 1; i <= totalPaginas; i++) {
        paginacao.innerHTML += `
            <li class="page-item ${i === paginaAtual ? 'active' : ''}">
                <button class="page-link" onclick="irParaPagina(${i})">
                    ${i}
                </button>
            </li>
        `;
    }

    paginacao.innerHTML += `
        <li class="page-item ${paginaAtual === totalPaginas ? 'disabled' : ''}">
            <button class="page-link" onclick="proximaPagina()">
                Próximo
            </button>
        </li>
    `;
};

function irParaPagina(pagina) {
    paginaAtual = pagina;
    carregarHistorico();
};

function paginaAnterior() {
    if (paginaAtual > 1) {
        paginaAtual--;
        carregarHistorico();
    };
};

function proximaPagina() {
    paginaAtual++;
    carregarHistorico();
};
carregarHistorico();