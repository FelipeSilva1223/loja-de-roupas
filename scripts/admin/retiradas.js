const token = sessionStorage.getItem('token') || localStorage.getItem('token');

let modal_body = document.getElementById('modal-body');
let lista_ids = [];

async function carregarRetiradas() {
    try {
        const resposta = await fetch(`${API_URL}/pedidos/entregas/retirada`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        if (!resposta.ok) {
            throw new Error(`Erro HTTP: ${resposta.status}`);
        };

        const res = await resposta.json();

        const card_containers = document.getElementById('card_container');

        for (const retirada of res) {
            card_containers.innerHTML += `
                <div class="card m-2">
                    <div class="d-flex align-items-center">
                        <p class="m-2 text-start flex-grow-1">
                            Retirada: #${retirada.id}<br>
                            Cliente: ${retirada.nome_cliente}<br>
                            Tel: ${retirada.telefone_cliente}
                        </p>
                        <div class="form-check form-check-reverse mx-2">
                            <input type="checkbox" data-id="${retirada.id}" id="check-${retirada.id}" class="form-check-input pedido_check">
                            <label for="check-${retirada.id}" class="form-check-label">Entregue</label>
                        </div>
                    </div>
                </div>`;
        }

        const btn_salvar = document.getElementById('btn_salvar');
        const btn_cancelar = document.getElementById('btn_cancelar');
        const btn_confirmar = document.getElementById('btn_confirmar');

        btn_salvar.addEventListener('click', () => {
            lista_ids = [];
            modal_body.replaceChildren();

            const checkboxes = document.querySelectorAll('.pedido_check:checked');

            checkboxes.forEach(checked => {
                modal_body.innerHTML += `<p>Cliente: ${res.find(p => p.id === Number(checked.dataset.id))?.nome_cliente}</p>`;
                modal_body.innerHTML += `<p>Telefone: ${res.find(p => p.id === Number(checked.dataset.id))?.telefone_cliente}</p>`;
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

carregarRetiradas();