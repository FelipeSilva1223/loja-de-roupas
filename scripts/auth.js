function Logout() {
    sessionStorage.setItem('usuarioLogado', false)
    localStorage.setItem('usuarioLogado', false)
    window.location.href = "../../index.html"
}
function VerificarLogin() {
    if (sessionStorage.getItem("usuarioLogado") === "true" || localStorage.getItem("usuarioLogado") === "true"){
        
    } else {
        window.location.href = "../../paginas/login.html"
    }
}

VerificarLogin();