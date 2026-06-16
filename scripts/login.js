const formulario = document.getElementById('form_login');

formulario.addEventListener('submit', logar);

async function logar(event) {
    event.preventDefault();
    const input_senha = document.getElementById('senha').value;
    const input_email = document.getElementById('email').value;
    const lembrar = document.getElementById('lembrardemim');
    const storage = lembrar.checked ? localStorage : sessionStorage;

    try {
        const resposta = await fetch(`${API_URL}/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                email: input_email,
                senha: input_senha,
                lembrar: lembrar.checked
            })
        });

        const dados = await resposta.json();

        if (resposta.status === 401) {
            alert(dados.mensagem|| 'Email ou senha inválidos');
            return;
        }        
        if (!resposta.ok) {
            alert(dados.mensagem|| 'Email ou senha inválidos');
            return;
        };
        storage.setItem('token', dados.token);
        storage.setItem('usuarioLogado', JSON.stringify(dados.usuario));

        location.href = '/paginas/admin/adicionar.html';

    } catch (erro) {
        console.log(erro);
        alert('Erro ao conectar com o servidor');
    };
};