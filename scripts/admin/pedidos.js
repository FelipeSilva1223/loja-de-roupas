const token = sessionStorage.getItem('token') || localStorage.getItem('token');

async function carregarPedidos() {
    try {
        const resposta = await fetch(`${API_URL}/pedidos/pendentes`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        if (!resposta.ok) {
            throw new Error(`Erro HTTP: ${resposta.status}`);
        };

        const pedidos = await resposta.json();

        const divModal = document.getElementById('modal_detalhes');
        const tabelaPedidos = document.getElementById('tabela_pedidos_body');

        pedidos.forEach((pedido) => {
            tabelaPedidos.innerHTML += `
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
                    <td>${(pedido.status === 'confirmado' ? "aguardando retirada" : pedido.status)}</td>
                    <td style="width: 80px;">
                        <button class="btn btn-outline-secondary btn-sm"
                            data-bs-toggle="modal"
                            data-bs-target="#modal_detalhes"
                            onclick="buscarPedido(${pedido.id})">
                            Detalhes
                        </button>
                    </td>
                </tr>`;
        });

    } catch (erro) {
        console.log(erro);
    };
};

async function buscarPedido(id) {
    try {
        const resposta = await fetch(`${API_URL}/pedidos/pendentes/${id}`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        if (!resposta.ok) {
            throw new Error(`Erro HTTP: ${resposta.status}`);
        }

        const pedido = await resposta.json();

        let itensPedido = [];

        pedido.forEach(item => {
            itensPedido.push(item.nome);
        });

        let modal_titulo = document.getElementById('modal_titulo');
        let modal_body = document.getElementById('modal_body');
        let modal_botoes = document.getElementById('modal_botoes');

        modal_titulo.innerHTML = `Pedido: #${id}`;

        modal_body.innerHTML = `
            <p>Pedido #${id}</p>
            <p>Nome do cliente: ${pedido[0].nome_cliente}</p>
            <p>Numero: ${pedido[0].telefone_cliente}</p>
            <p>Data do pedido: ${new Date(pedido[0].criado_em).toLocaleDateString("pt-BR")}</p>
            <p>Itens: ${itensPedido.join(", ")}</p>
            <p>Forma de entrega: ${pedido[0].forma_entrega.replace(/^./, letra => letra.toUpperCase())}</p>
            ${pedido[0].forma_entrega === 'entrega' ? `<p>Endereço: ${pedido[0].endereco}</p>` : ''}
            <p>Valor total: ${Number(pedido[0].total).toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}</p>
            <p>Forma de pagamento: ${pedido[0].forma_pagamento.replace('_', ' ').replace(/^./, letra => letra.toUpperCase())}</p>`;

        modal_botoes.innerHTML = `
            <button type="button" class="btn btn-success" data-bs-dismiss="modal" onclick="confirmarPedido(${id})">
                <span class="bi bi-check-circle"> Confirmar</span>
            </button>

            <button type="button" class="btn btn-danger" data-bs-dismiss="modal" onclick="cancelarPedido(${id})">
                <span class="bi bi-x-circle"> Cancelar</span>
            </button>`;

    } catch (erro) {
        console.log(erro);
    };
};

async function confirmarPedido(id) {
    try {
        const resposta = await fetch(`${API_URL}/pedidos/confirmar/${id}`, {
            method: 'PATCH',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        if (!resposta.ok) {
            throw new Error(`Erro HTTP: ${resposta.status}`);
        }

        location.reload();

    } catch (erro) {
        console.log(erro);
    };
};

async function cancelarPedido(id) {
    try {
        const resposta = await fetch(`${API_URL}/pedidos/cancelar/${id}`, {
            method: 'PATCH',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        if (!resposta.ok) {
            throw new Error(`Erro HTTP: ${resposta.status}`);
        };

        location.reload();

    } catch (erro) {
        console.log(erro);
    };
};

carregarPedidos();