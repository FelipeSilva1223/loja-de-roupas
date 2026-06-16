const token = sessionStorage.getItem('token') || localStorage.getItem('token');
const inputImg = document.getElementById("img_input");
const containerPrevia = document.getElementById("container_previa");
let imagensSelecionadas = [];

const formulario = document.getElementById('formulario');
const btn_cancelar_form = document.getElementById('btn_cancelar_form');

const btn_add_bairro = document.getElementById('btn_add_bairro');
const btn_edit_bairro = document.getElementById('btn_edit_frete');

const btn_salvar_add = document.getElementById('btn_salvar_add');
const btn_cancelar_add = document.getElementById('btn_cancelar_add');

const btn_salvar_edit = document.getElementById('btn_salvar_edit');
const btn_cancelar_edit = document.getElementById('btn_cancelar_edit');

inputImg.addEventListener("change", function(){
    const arquivos = Array.from(this.files);

    arquivos.forEach(arquivo => {
        if (!arquivo.type.startsWith("image/")) { return}

        imagensSelecionadas.push(arquivo);
    });

    renderizarImagens();
    this.value = ""
});

function renderizarImagens() {
    containerPrevia.innerHTML = "";

    imagensSelecionadas.forEach((arquivo, index) => {
        const url = URL.createObjectURL(arquivo);

        const div = document.createElement("div");
        div.className = "previa_item position-relative border rounded overflow-hidden";
        div.innerHTML = ` <button type="button" class="btn btn-sm btn-danger position-absolute top-0 end-0 m-1 btn-remover" data-index="${index}">×</button> 
                            <img src="${url}" alt="Imagem selecionada"  width="100" height="100" class="m-2"> `;
        
        containerPrevia.appendChild(div);                  
        });
    adicionarEventoRemover();
}

function adicionarEventoRemover(){
    const botoesRemover = document.querySelectorAll(".btn-remover");

    botoesRemover.forEach(botao => {
        botao.addEventListener("click", function (){
            const index = Number(this.dataset.index);
            imagensSelecionadas.splice(index, 1);
            renderizarImagens();
        });
    });
};

formulario.addEventListener('submit', async (event) => {
    event.preventDefault();
    const token = sessionStorage.getItem('token') || localStorage.getItem('token');

    const nome = document.getElementById('nome').value;
    const valor = document.getElementById('valor').value;
    const detalhes = document.getElementById('detalhes').value;
    const formData = new FormData();

    formData.append('nome', nome);
    formData.append('valor', Number(valor));
    formData.append('detalhes', detalhes);
    for (const imagem of imagensSelecionadas) {
        formData.append('imagens', imagem);
    };
    try {
        if (imagensSelecionadas.length === 0) {
            alert('Adicione pelo menos uma imagem');
            return;
        };
        const resposta = await fetch(`${API_URL}/estoque`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`
            },
            body: formData
        });
        
        const dados = await resposta.json();
        
        if(!resposta.ok) {
            alert(dados.mensagem || 'Erro desconhecido');
            return;
        };

        alert(dados.mensagem)
        document.getElementById('formulario').reset();
        document.getElementById('container_previa').innerHTML = '';
        imagensSelecionadas = [];

    } catch (erro) {
        console.log(erro);
    };
});

async function buscarFretes() {
    const select = document.getElementById('bairros');
    const tbody = document.getElementById('tbody_frete');
    try {
        const resposta = await fetch(`${API_URL}/pedidos/fretes`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        const fretes = await resposta.json();

        fretes.forEach(frete => {
            tbody.innerHTML += `
                <tr>
                    <td>${frete.bairro}</td>
                    <td>${frete.valor}</td>
                </tr>`
            select.insertAdjacentHTML('beforeend', `<option value="${frete.bairro}">${frete.bairro}</option>`);
        });

    } catch (erro) {
        console.log(erro);
    };
}

buscarFretes();

function cancelar() {
    const nbairro = document.getElementById('nbairro_nome').value = '';
    const nvalor = document.getElementById('nbairro_valor').value = '';
    const novoValor = document.getElementById('novo_valor').value = '';
    const divAdd = document.getElementById('div_novo_bairro').classList.add('d-none');
    const divEdit = document.getElementById('div_edit_bairro').classList.add('d-none');
};

async function addBairro() {
    const bairro = document.getElementById('nbairro_nome').value.trim();
    const valor = document.getElementById('nbairro_valor').value;
    try {
        const resposta = await fetch(`${API_URL}/pedidos/fretes`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                bairro: bairro,
                valor: valor
            })
        });

        if (!resposta.ok) {
            alert("Não foi possivel adicionar o bairro.");
            return;
        };
        alert(`Bairro ${bairro} adicionado com sucesso`);
        location.reload();

    } catch (erro) {
        alert("Erro interno")
        console.log(erro)
    };
};

async function editFrete() { 
    const bairro = document.getElementById('bairros').value;
    const novoValor = document.getElementById('novo_valor').value;
    try {
        const resposta = await fetch(`${API_URL}/pedidos/fretes`, {
            method: 'PATCH',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                bairro: bairro,
                valor: novoValor
            })
        });
        if (!resposta.ok) {
            alert("Não foi possivel editar o frete");
            return;
        };

        alert(`Valor de ${bairro} atualizado para ${novoValor}`);
        location.reload();

    } catch (erro) {
        alert("Erro interno")
    };
};

btn_cancelar_form.addEventListener('click', ()=> {
    document.getElementById('formulario').reset();
    document.getElementById('container_previa').innerHTML = '';
    imagensSelecionadas = [];
})

btn_add_bairro.addEventListener('click', () => {
    const divAdd = document.getElementById('div_novo_bairro').classList.remove('d-none');
    const divEdit = document.getElementById('div_edit_bairro').classList.add('d-none');
});

btn_edit_bairro.addEventListener('click', () => {
    const divAdd = document.getElementById('div_novo_bairro').classList.add('d-none');
    const divEdit = document.getElementById('div_edit_bairro').classList.remove('d-none');   
});

btn_salvar_add.addEventListener('click', addBairro);
btn_cancelar_add.addEventListener('click', cancelar);

btn_salvar_edit.addEventListener('click', editFrete);
btn_cancelar_edit.addEventListener('click', cancelar);