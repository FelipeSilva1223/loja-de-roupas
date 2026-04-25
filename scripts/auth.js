function Logout() {
    sessionStorage.clear();
    localStorage.clear();
    window.location.href = "/paginas/login.html"
}
function VerificarLogin() {
    if (sessionStorage.getItem("usuariologado") === "true" || localStorage.getItem("usuariologado") === "true"){
        
    } else {
        window.location.href = "/paginas/login.html"
    }
}

VerificarLogin();