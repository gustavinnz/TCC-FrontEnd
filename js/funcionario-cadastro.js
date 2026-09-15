const API_URL = "http://localhost:8080/api/funcionarios";

const form = document.getElementById("formFuncionario");
const tituloPagina = document.getElementById("tituloPagina");

const nome = document.getElementById("nome");
const email = document.getElementById("email");
const senha = document.getElementById("senha");
const perfil = document.getElementById("perfil");
const status = document.getElementById("status");

const btnSalvar = document.getElementById("btnSalvar");
const btnCancelar = document.getElementById("btnCancelar");
const btnLimpar = document.getElementById("btnLimpar");
const btnMostrarSenha = document.getElementById("btnMostrarSenha");

const mensagem = document.getElementById("mensagem");

const id = new URLSearchParams(window.location.search).get("id");

let modoEdicao = Boolean(id);


/* Carrega os dados para edição */

async function carregarFuncionario() {

    if (!modoEdicao) {
        return;
    }

    tituloPagina.textContent = "Editar Funcionário";

    document.getElementById("asteriscoSenha").textContent = "";

    document.getElementById("ajudaSenha").textContent =
        "Deixe vazio para manter a senha atual.";

    senha.removeAttribute("required");

    try {

        btnSalvar.disabled = true;
        btnSalvar.textContent = "CARREGANDO...";

        const resposta = await fetch(`${API_URL}/${id}`);

        if (!resposta.ok) {
            throw new Error("Funcionário não encontrado.");
        }

        const funcionario = await resposta.json();

        nome.value = funcionario.nome || "";
        email.value = funcionario.email || "";
        perfil.value = funcionario.perfil || "";
        status.value = funcionario.status || "Ativo";

    } catch (erro) {

        mostrarMensagem(
            "Não foi possível carregar os dados do funcionário.",
            "error"
        );

        console.error(erro);

    } finally {

        btnSalvar.disabled = false;
        btnSalvar.textContent = "SALVAR";
    }
}


/* Mostra ou esconde a senha */

btnMostrarSenha.addEventListener("click", () => {

    if (senha.type === "password") {

        senha.type = "text";
        btnMostrarSenha.textContent = "Ocultar";

    } else {

        senha.type = "password";
        btnMostrarSenha.textContent = "Mostrar";
    }
});


/* Limpa os erros */

function limparErros() {

    document.getElementById("erroNome").textContent = "";
    document.getElementById("erroEmail").textContent = "";
    document.getElementById("erroSenha").textContent = "";
    document.getElementById("erroPerfil").textContent = "";
}


/* Validação */

function validarFormulario() {

    limparErros();

    let valido = true;

    if (nome.value.trim() === "") {

        document.getElementById("erroNome").textContent =
            "Informe o nome do funcionário.";

        valido = false;
    }

    if (email.value.trim() === "") {

        document.getElementById("erroEmail").textContent =
            "Informe o login/e-mail.";

        valido = false;

    } else if (!email.validity.valid) {

        document.getElementById("erroEmail").textContent =
            "Informe um e-mail válido.";

        valido = false;
    }

    if (!modoEdicao && senha.value.length < 6) {

        document.getElementById("erroSenha").textContent =
            "A senha deve possuir pelo menos 6 caracteres.";

        valido = false;
    }

    if (modoEdicao && senha.value.length > 0 && senha.value.length < 6) {

        document.getElementById("erroSenha").textContent =
            "A senha deve possuir pelo menos 6 caracteres.";

        valido = false;
    }

    if (perfil.value === "") {

        document.getElementById("erroPerfil").textContent =
            "Selecione um perfil.";

        valido = false;
    }

    return valido;
}


/* Salva o funcionário */

form.addEventListener("submit", async (event) => {

    event.preventDefault();

    if (!validarFormulario()) {
        return;
    }

    const funcionario = {
        nome: nome.value.trim(),
        email: email.value.trim(),
        perfil: perfil.value,
        status: status.value
    };

    if (senha.value.trim() !== "") {
        funcionario.senha = senha.value;
    }

    try {

        btnSalvar.disabled = true;
        btnSalvar.textContent = "SALVANDO...";

        const resposta = await fetch(
            modoEdicao ? `${API_URL}/${id}` : API_URL,
            {
                method: modoEdicao ? "PUT" : "POST",

                headers: {
                    "Content-Type": "application/json"
                },

                body: JSON.stringify(funcionario)
            }
        );

        const dados = await resposta.json().catch(() => null);

        if (!resposta.ok) {

            const erroBackend =
                dados?.message ||
                dados?.erro ||
                "Não foi possível salvar o funcionário.";

            throw new Error(erroBackend);
        }

        mostrarMensagem(
            modoEdicao
                ? "Funcionário atualizado com sucesso!"
                : "Funcionário cadastrado com sucesso!",
            "success"
        );

        setTimeout(() => {
            window.location.href = "funcionarios.html";
        }, 1200);

    } catch (erro) {

        console.error(erro);

        mostrarMensagem(
            erro.message,
            "error"
        );

    } finally {

        btnSalvar.disabled = false;
        btnSalvar.textContent = "SALVAR";
    }
});


/* Limpar formulário */

btnLimpar.addEventListener("click", () => {

    form.reset();

    limparErros();

    status.value = "Ativo";

    if (modoEdicao) {
        senha.value = "";
    }

    mensagem.className = "message";
    mensagem.textContent = "";
});


/* Voltar para a lista */

btnCancelar.addEventListener("click", () => {

    window.location.href = "funcionarios.html";
});


/* Exibe mensagens */

function mostrarMensagem(texto, tipo) {

    mensagem.textContent = texto;

    mensagem.className = `message ${tipo}`;
}


/* Inicia a página */

carregarFuncionario();