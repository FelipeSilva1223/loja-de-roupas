let carrinho = JSON.parse(sessionStorage.getItem("carrinho")) ?? JSON.parse(localStorage.getItem("carrinho")) ?? [];
let total

document.addEventListener("DOMContentLoaded", function () {

    if (carrinho.length < 1){
        document.getElementById("total_span").classList.add("d-none")
        document.getElementById("btn_esvaziar").classList.add("d-none")
        document.getElementById("btn_finalizar").classList.add("d-none")
        document.getElementById("carrinho_vazio").classList.remove("d-none")
        document.getElementById("btn_ir_as_compras").classList.remove("d-none")
    } else {
        total = 0;
        const div = document.getElementById("div_principal")
        carrinho.forEach((item, i) => {
            total += parseInt((item.em_liquidacao === 1) ? item.valor_liquidado : item.valor);
            let produto_carrinho = `<div class="card mt-3">
                <div class="row g-0">
                    <div class="col-4">
                        <img src="${API_URL + item.img_path}" alt="vestido" style="max-height: 150px; object-fit: cover;" class="w-100">
                    </div>
                    <div class="col-8">
                        <a href="detalhes.html?id=${item.id}" class="card-link">
                            <div class="card-body">
                                <p class="card-text text-truncate">${item.nome}</p>
                                <p class="card-title fw-bold ${Number(item.em_liquidacao) === 1 ? `text-decoration-line-through` : ``}">
                                    ${Number(item.valor).toLocaleString("pt-BR", {
                                        style: "currency",
                                        currency: "BRL"
                                    })}
                                </p>
                                ${Number(item.em_liquidacao) === 1 ? `
                                    <p class="card-title fw-bold">${Number(item.valor_liquidado).toLocaleString("pt-BR",{ 
                                    style: "currency",
                                    currency: "BRL"
                                    })}
                                    </p>` : ``}
                            </div>
                        </a>
                        <div class="d-flex justify-content-end mx-3 gap-1">
                            <button class="btn btn-danger btn-sm bi bi-trash" onclick="removerItem(${i})"></button>
                        </div>
                    </div>
                </div>
            </div>`;
        div.insertAdjacentHTML("beforeend", produto_carrinho);
        document.getElementById("total_carrinho").innerText = total;
        });
    }
})
function removerItem(i){
    carrinho.splice(i, 1);
    sessionStorage.setItem("carrinho", JSON.stringify(carrinho));
    location.reload();
};
function esvaziar(){
    sessionStorage.setItem("carrinho", JSON.stringify([]));
    location.reload();
};

function finalizar(){
    sessionStorage.setItem('itemAtual', JSON.stringify({'nome': 'carrinho', 'valor': total}))
    window.location.href = 'finalizar-compra.html'
};