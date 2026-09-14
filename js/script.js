const loginForm = document.getElementById("loginForm");

const loginInput = document.getElementById("login");
const senhaInput = document.getElementById("senha");

const loginError = document.getElementById("loginError");
const senhaError = document.getElementById("senhaError");

const toggleSenha = document.getElementById("toggleSenha");

const btnEntrar = document.getElementById("btnEntrar");

const message = document.getElementById("message");

const form = document.getElementById("loginForm");


// MOSTRAR / OCULTAR SENHA

toggleSenha.addEventListener("click", function () {

    if (senhaInput.type === "password") {

        senhaInput.type = "text";
        toggleSenha.textContent = "Ocultar";

    } else {

        senhaInput.type = "password";
        toggleSenha.textContent = "Mostrar";

    }

});


// LOGIN

loginForm.addEventListener("submit", function (event) {

    event.preventDefault();

    // Limpa mensagens anteriores

    loginError.textContent = "";
    senhaError.textContent = "";

    message.className = "message";
    message.textContent = "";


    let valido = true;


    // VALIDA LOGIN

    if (loginInput.value.trim() === "") {

        loginError.textContent = "Informe seu login ou e-mail.";

        valido = false;
    }


    // VALIDA SENHA

    if (senhaInput.value.trim() === "") {

        senhaError.textContent = "Informe sua senha.";

        valido = false;
    }


    if (!valido) {
        return;
    }


    // ESTADO DE LOADING

    btnEntrar.disabled = true;
    btnEntrar.textContent = "ENTRANDO...";


    // Simulação de comunicação com o Back-End

    setTimeout(function () {

        btnEntrar.disabled = false;
        btnEntrar.textContent = "ENTRAR";


        // Por enquanto, apenas simula o login

        message.className = "message success";
        message.textContent = "Login realizado com sucesso!";

    }, 1500);

});

form.addEventListener("submit", function (event){
    event.preventDefault();

    window.location.href = "dashboard.html";
});