function Logout() {
    sessionStorage.clear();
    localStorage.clear();
    window.location.href = "/paginas/login.html"
}
function VerificarLogin() {
    if (sessionStorage.getItem("usuarioLogado") === "true" || localStorage.getItem("usuarioLogado") === "true"){
        
    } else {
        window.location.href = "/paginas/login.html"
    }
}

VerificarLogin();