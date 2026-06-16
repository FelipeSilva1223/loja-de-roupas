async function verificarLogin() {
    const token = sessionStorage.getItem('token') || localStorage.getItem('token');
    const usuario = JSON.parse(sessionStorage.getItem('usuarioLogado') || localStorage.getItem('usuarioLogado'));
    if(!token || !usuario || usuario.hierarquia !== "admin"){
        window.location.href = "/paginas/login.html"
        return;
    };

    try {
        const resposta = await fetch(`${API_URL}/validar-token`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        if (!resposta.ok) {
            sessionStorage.clear();
            localStorage.removeItem('token');
            localStorage.removeItem('usuarioLogado');

            alert('Sessão expirada. Faça login novamente.');
            window.location.href = '/paginas/login.html';
            return;
        };

    } catch (erro) {
        console.log(erro);
        sessionStorage.removeItem('token');
        sessionStorage.removeItem('usuarioLogado');
        localStorage.removeItem('token');
        localStorage.removeItem('usuarioLogado');
        
        alert('Erro ao verificar sessão.');
        window.location.href = '/paginas/login.html';
    };
};

function logout(){
    sessionStorage.removeItem('token');
    sessionStorage.removeItem('usuarioLogado');
    localStorage.removeItem('token');
    localStorage.removeItem('usuarioLogado');
    
    window.location.href = "/paginas/login.html";
};

verificarLogin();