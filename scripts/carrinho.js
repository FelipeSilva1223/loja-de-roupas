const span = document.getElementById('span_carrinho');

function atualizar() {
    let obj = JSON.parse(sessionStorage.getItem('carrinho')) || 0;
if (obj === 0 || obj.length === 0) {
    span.innerText = '';
} else {
    span.innerText = obj.length;
};
};

atualizar();