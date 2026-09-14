const form = document.getElementById("formFuncionario");

const btnSalvar = document.getElementById("btnSalvar");
const btnCancelar = document.getElementById("btnCancelar");

const tituloPagina = document.getElementById("tituloPagina");

const toast = document.getElementById("toast");


// =====================================================
// MODO DA TELA
// =====================================================

// Futuramente o ID poderá vir da URL:
// funcionario-cadastro.html?id=15

const parametros = new URLSearchParams(window.location.search);
const idFuncionario = parametros.get("id");


// Se existir ID, a tela funciona como edição
if (idFuncionario) {

    tituloPagina.textContent = "Editar Funcionário";

    carregarFuncionario(idFuncionario);
}


// =====================================================
// CARREGAR FUNCIONÁRIO
// =====================================================

async function carregarFuncionario(id) {

    try {

        // FUTURO BACKEND:
        // const resposta = await fetch(`/api/funcionarios/${id}`);
        // const funcionario = await resposta.json();

        // Exemplo temporário
        const funcionario = {
            nome: "João da Silva",
            cpf: "123.456.789-00",
            email: "joao@email.com",
            telefone: "(16) 99999-9999",
            perfil: "garcom",
            status: "ativo"
        };

        document.getElementById("nome").value = funcionario.nome;
        document.getElementById("cpf").value = funcionario.cpf;
        document.getElementById("email").value = funcionario.email;
        document.getElementById("telefone").value = funcionario.telefone;
        document.getElementById("perfil").value = funcionario.perfil;
        document.getElementById("status").value = funcionario.status;

        // Na edição, senha pode ser preenchida somente
        // caso o backend exija uma nova senha.
        document.getElementById("senha").required = false;
        document.getElementById("confirmarSenha").required = false;

    } catch (erro) {

        mostrarToast("Não foi possível carregar o funcionário.");

        console.error(erro);
    }
}


// =====================================================
// ENVIO DO FORMULÁRIO
// =====================================================

form.addEventListener("submit", async function (event) {

    event.preventDefault();

    limparErros();

    if (!validarFormulario()) {
        return;
    }

    btnSalvar.disabled = true;
    btnSalvar.textContent = "SALVANDO...";


    const dadosFuncionario = {

        nome: document.getElementById("nome").value.trim(),

        cpf: document.getElementById("cpf").value.trim(),

        email: document.getElementById("email").value.trim(),

        telefone: document.getElementById("telefone").value.trim(),

        perfil: document.getElementById("perfil").value,

        status: document.getElementById("status").value,

        senha: document.getElementById("senha").value
    };


    try {

        /*
        =================================================
        FUTURO BACKEND
        =================================================

        const url = idFuncionario
            ? `/api/funcionarios/${idFuncionario}`
            : `/api/funcionarios`;

        const metodo = idFuncionario ? "PUT" : "POST";

        const resposta = await fetch(url, {
            method: metodo,
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(dadosFuncionario)
        });

        if (!resposta.ok) {
            throw new Error("Erro ao salvar funcionário.");
        }

        const funcionario = await resposta.json();

        =================================================
        */


        // Simulação temporária
        await new Promise(resolve => setTimeout(resolve, 800));


        if (idFuncionario) {
            mostrarToast("Funcionário atualizado com sucesso!");
        } else {
            mostrarToast("Funcionário cadastrado com sucesso!");
        }


        setTimeout(() => {
            window.location.href = "funcionarios.html";
        }, 1200);


    } catch (erro) {

        console.error(erro);

        mostrarToast("Não foi possível salvar o funcionário.");

        btnSalvar.disabled = false;
        btnSalvar.textContent = "SALVAR";
    }
});


// =====================================================
// VALIDAÇÃO
// =====================================================

function validarFormulario() {

    let valido = true;


    const nome = document.getElementById("nome").value.trim();
    const cpf = document.getElementById("cpf").value.trim();
    const email = document.getElementById("email").value.trim();
    const perfil = document.getElementById("perfil").value;

    const senha = document.getElementById("senha").value;
    const confirmarSenha =
        document.getElementById("confirmarSenha").value;


    if (nome.length < 3) {

        document.getElementById("erroNome").textContent =
            "Informe o nome completo.";

        valido = false;
    }


    if (cpf.length !== 14) {

        document.getElementById("erroCpf").textContent =
            "Informe um CPF válido.";

        valido = false;
    }


    if (!emailValido(email)) {

        document.getElementById("erroEmail").textContent =
            "Informe um e-mail válido.";

        valido = false;
    }


    if (!perfil) {

        document.getElementById("erroPerfil").textContent =
            "Selecione um perfil.";

        valido = false;
    }


    // Na criação, senha é obrigatória.
    // Na edição, só é validada se o usuário preencher.
    if (!idFuncionario && senha.length < 6) {

        document.getElementById("erroSenha").textContent =
            "A senha deve possuir pelo menos 6 caracteres.";

        valido = false;
    }


    if (senha || confirmarSenha) {

        if (senha !== confirmarSenha) {

            document.getElementById("erroConfirmarSenha").textContent =
                "As senhas não coincidem.";

            valido = false;
        }
    }


    return valido;
}


// =====================================================
// VALIDAÇÃO DE E-MAIL
// =====================================================

function emailValido(email) {

    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}


// =====================================================
// CPF
// =====================================================

document.getElementById("cpf").addEventListener("input", function () {

    let valor = this.value.replace(/\D/g, "");

    valor = valor.substring(0, 11);

    valor = valor.replace(/(\d{3})(\d)/, "$1.$2");
    valor = valor.replace(/(\d{3})(\d)/, "$1.$2");
    valor = valor.replace(/(\d{3})(\d{1,2})$/, "$1-$2");

    this.value = valor;
});


// =====================================================
// TELEFONE
// =====================================================

document.getElementById("telefone").addEventListener("input", function () {

    let valor = this.value.replace(/\D/g, "");

    valor = valor.substring(0, 11);

    if (valor.length <= 10) {

        valor = valor.replace(/(\d{2})(\d)/, "($1) $2");
        valor = valor.replace(/(\d{4})(\d)/, "$1-$2");

    } else {

        valor = valor.replace(/(\d{2})(\d)/, "($1) $2");
        valor = valor.replace(/(\d{5})(\d)/, "$1-$2");
    }

    this.value = valor;
});


// =====================================================
// MOSTRAR / OCULTAR SENHA
// =====================================================

document.querySelectorAll(".mostrar-senha").forEach(botao => {

    botao.addEventListener("click", function () {

        const input = document.getElementById(this.dataset.target);

        if (input.type === "password") {

            input.type = "text";
            this.textContent = "🙈";

        } else {

            input.type = "password";
            this.textContent = "👁";
        }
    });
});


// =====================================================
// CANCELAR
// =====================================================

btnCancelar.addEventListener("click", function () {

    window.location.href = "funcionarios.html";
});


// =====================================================
// ERROS
// =====================================================

function limparErros() {

    document.querySelectorAll(".erro").forEach(erro => {
        erro.textContent = "";
    });
}


// =====================================================
// TOAST
// =====================================================

function mostrarToast(mensagem) {

    toast.textContent = mensagem;
    toast.style.display = "block";

    setTimeout(() => {

        toast.style.display = "none";

    }, 3000);
}