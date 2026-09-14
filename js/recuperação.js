const form = document.getElementById("formRecuperacao");
const email = document.getElementById("email");
const erroEmail = document.getElementById("erroEmail");

form.addEventListener("submit", function (event) {
    event.preventDefault();

    // Limpa mensagem de erro
    erroEmail.textContent = "";

    // Verifica se o campo está vazio
    if (email.value.trim() === "") {
        erroEmail.textContent = "Digite seu e-mail.";
        email.focus();
        return;
    }

    // Verifica se o e-mail é válido
    if (!email.validity.valid) {
        erroEmail.textContent = "Digite um e-mail válido.";
        email.focus();
        return;
    }

    // Exibe alerta de confirmação
    alert("E-mail enviado! Verifique sua caixa de entrada para atualizar sua senha.");

    // Limpa o campo após o envio
    email.value = "";
});