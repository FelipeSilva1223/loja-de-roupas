let modal_body = document.getElementById('modal-body');
let lista_ids = [];

async function carregarEntregas() {
    const token = sessionStorage.getItem('token') || localStorage.getItem('token');

    try {
        const resposta = await fetch(`${API_URL}/pedidos/entregas/entrega`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        if (!resposta.ok) {
            throw new Error(`Erro HTTP: ${resposta.status}`);
        }

        const res = await resposta.json();

        const card_containers = document.getElementById('card_container');

        for (const entrega of res) {
            card_containers.innerHTML += `
                <div class="card m-2">
                    <div class="d-flex align-items-center">
                        <button class="btn btn-secondary m-1 text-start flex-grow-1" type="button"
                            data-bs-toggle="collapse" data-bs-target="#entrega-${entrega.id}">Entrega: ${entrega.id}</button>
                        <div class="form-check form-check-reverse mx-2">
                            <input type="checkbox" data-id="${entrega.id}" id="check-${entrega.id}" class="form-check-input pedido_check">
                            <label for="check-${entrega.id}" class="form-check-label">Entregue</label>
                        </div>
                    </div>
                    <div class="collapse m-1" id="entrega-${entrega.id}">
                        <div class="card-text p-2">
                            <p id="span_endereco" class="m-0">Endereço: ${entrega.endereco}</p>
                            <p id="span_nome" class="m-0">Nome: ${entrega.nome_cliente}</p>
                            <p id="span_telefone" class="m-0">Telefone: ${entrega.telefone_cliente}</p>
                        </div>
                    </div>
                </div>`;
        };

        const btn_salvar = document.getElementById('btn_salvar');
        const btn_cancelar = document.getElementById('btn_cancelar');
        const btn_confirmar = document.getElementById('btn_confirmar');

        btn_salvar.addEventListener('click', () => {
            lista_ids = [];
            modal_body.replaceChildren();

            const checkboxes = document.querySelectorAll('.pedido_check:checked');

            checkboxes.forEach(checked => {
                modal_body.innerHTML += 
                `<div class="card p-2">
                    <p>Endereço: ${res.find(p => p.id === Number(checked.dataset.id))?.endereco}</p>
                    <p>Nome: ${res.find(p => p.id === Number(checked.dataset.id))?.nome_cliente}</p>
                    <p>Telefone: ${res.find(p => p.id === Number(checked.dataset.id))?.telefone_cliente}</p>
                </div>`;
                lista_ids.push(Number(checked.dataset.id));
            });
        });

        btn_confirmar.addEventListener('click', async () => {
            try {
                const resposta = await fetch(`${API_URL}/pedidos/finalizar`, {
                    method: 'PATCH',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    },
                    body: JSON.stringify({
                        ids: lista_ids
                    })
                });

                if (!resposta.ok) {
                    throw new Error(`Erro HTTP: ${resposta.status}`);
                };

                location.reload();

            } catch (erro) {
                console.log(erro);
            };
        });

    } catch (erro) {
        console.log(erro);
    };
};

carregarEntregas();