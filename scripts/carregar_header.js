const usuario = JSON.parse(sessionStorage.getItem('usuarioLogado')) || JSON.parse(localStorage.getItem('usuarioLogado'));
let opcoes = ''
if (usuario){
    
    if(usuario.hierarquia === "admin"){
        opcoes = `
        <li><a href="/paginas/admin/adicionar.html" class="dropdown-item">Painel de controle</a></li>`
    } else {
        opcoes = `
        <li><a href="/paginas/publico/perfil.html" class="dropdown-item">Perfil</a></li>`
    }

} else {
    opcoes = `
    <li><a href="/paginas/login.html" class="dropdown-item">Log in/Sign in</a></li>`
}

const headerTag = document.querySelector('header')

headerTag.insertAdjacentHTML('afterbegin', `
        <nav class="navbar justify-content-between align-items-center px-3 py-2" style="background-color: #0E2340;">
            <div name="logo">
                <a href="/index.html" class="logo-marca mb-0" style="text-decoration: none;">Logo</a>
            </div>
            <div class="dropdown">
                <button type="button" class="btn bi bi-person me-3 icone-header dropdown-toggle" data-bs-toggle="dropdown"></button>
                <ul class="dropdown-menu dropdown-menu-end">
                    ${opcoes}
                </ul>
                <a href="/paginas/publico/carrinho.html" class="bi bi-cart4 me-3 icone-header position-relative">
                    <span class="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger" style="font-size:10px; padding:2px 5px;" id="span_carrinho"></span>
                </a>
            </div>
        </nav>`)

const span = document.getElementById('span_carrinho');

function atualizar() {
    // Função para atualizar o numero no desenho do carrinho
    let obj = JSON.parse(sessionStorage.getItem('carrinho')) || 0;
    if (obj === 0 || obj.length === 0) {
        span.innerText = '';
    } else {
        span.innerText = obj.length;
    };
};

atualizar();