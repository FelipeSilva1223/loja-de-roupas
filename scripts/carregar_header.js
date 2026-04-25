let opcoes = ''
if (sessionStorage.getItem("usuariologado") === "true" || localStorage.getItem("usuariologado") === "true"){
    
    if(sessionStorage.getItem("hierarquia") === "admin"){
        opcoes = `
        <li><a href="/paginas/admin/adicionar.html" class="dropdown-item">Painel de controle</a></li>
        <li><a href="/paginas/login.html" class="dropdown-item">Log out</a></li>`
    } else {
        opcoes = `
        <li><a href="#" class="dropdown-item">Perfil</a></li>
        <li><a href="/paginas/login.html" class="dropdown-item">Log out</a></li>`
    }

} else {
    opcoes = `
    <li><a href="/paginas/login.html" class="dropdown-item">Log in/Sign in</a></li>`
}

const headerTag = document.getElementById('header')
headerTag.insertAdjacentHTML('afterbegin', `
        <nav class="navbar justify-content-between align-items-center px-3 py-2" style="background-color: #0E2340;">
            <div name="logo">
                <a href="/index.html" class="logo-marca mb-0" style="text-decoration: none;">Logotipo</a>
            </div>
            <div class="dropdown">
                <button type="button" class="btn bi bi-person me-3 icone-header dropdown-toggle" data-bs-toggle="dropdown"></button>
                <ul class="dropdown-menu">
                    ${opcoes}
                </ul>
                <a href="/paginas/publico/carrinho.html" class="bi bi-cart4 me-3 icone-header position-relative">
                    <span class="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger" style="font-size:10px; padding:2px 5px;" id="span_carrinho"></span>
                </a>
            </div>
        </nav>`)