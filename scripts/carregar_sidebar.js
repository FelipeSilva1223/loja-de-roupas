const sidebar = document.querySelector('.sidebar')
sidebar.insertAdjacentHTML('afterbegin', `
<button type="button" class="nav-link mx-3" data-bs-toggle="collapse" data-bs-target=".collapse-horizontal">
                    <i class="bi bi-list"></i>
                </button>
                <nav class="nav flex-column">
                    <a href="adicionar.html" class="nav-link">
                        <span class="bi bi-cloud-plus"></span>
                        <span class="descricao collapse collapse-horizontal">Adicionar</span>
                    </a>
                    <a href="pedidos.html" class="nav-link">
                        <span class="bi bi-handbag"></span>
                        <span class="descricao collapse collapse-horizontal">Pedidos</span>
                    </a>
                    <a href="estoque.html" class="nav-link">
                        <span class="bi bi-box-seam"></span>
                        <span class="descricao collapse collapse-horizontal">Estoque</span>
                    </a>
                    <a href="entregas.html" class="nav-link">
                        <span class="bi bi-truck"></span>
                        <span class="descricao collapse collapse-horizontal">Entregas a fazer</span>
                    </a>
                    <a href="historico.html" class="nav-link">
                        <span class="bi bi-receipt-cutoff"></span>
                        <span class="descricao collapse collapse-horizontal">Historico de pedidos</span>
                    </a>
                    <a href="#" class="nav-link mt-5" onclick="Logout()">
                        <span class="bi bi-box-arrow-right"></span>
                        <span class="descricao collapse collapse-horizontal">Log out</span>
                    </a>
                </nav>`)

document.addEventListener("DOMContentLoaded", () => {

    const descricoes = document.querySelectorAll(".descricao");

    function ajustarSidebar() {

        descricoes.forEach(item => {

            const collapse = bootstrap.Collapse.getOrCreateInstance(item, {
                toggle: false
            });

            if (window.innerWidth < 768) {
                collapse.hide();
            } else {
                collapse.show();
            }

        });
    }

    ajustarSidebar();

    window.addEventListener("resize", ajustarSidebar);

});