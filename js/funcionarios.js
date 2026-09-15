const busca = document.getElementById("busca");
const perfil = document.getElementById("perfil");
const status = document.getElementById("status");
const btnFiltrar = document.getElementById("btnFiltrar");

const tabela = document.getElementById("tabelaFuncionarios");
const contador = document.getElementById("contador");


function filtrarFuncionarios() {

    const textoBusca =
        busca.value.toLowerCase().trim();

    const perfilSelecionado =
        perfil.value.toLowerCase();

    const statusSelecionado =
        status.value.toLowerCase();

    const linhas =
        tabela.querySelectorAll("tr");

    let quantidade = 0;


    linhas.forEach(linha => {

        const texto =
            linha.textContent.toLowerCase();

        const perfilFuncionario =
            linha.children[2].textContent.toLowerCase();

        const statusFuncionario =
            linha.children[3].textContent.toLowerCase();


        const correspondeBusca =
            texto.includes(textoBusca);

        const correspondePerfil =
            !perfilSelecionado ||
            perfilFuncionario.includes(perfilSelecionado);

        const correspondeStatus =
            !statusSelecionado ||
            statusFuncionario.includes(statusSelecionado);


        if (
            correspondeBusca &&
            correspondePerfil &&
            correspondeStatus
        ) {

            linha.style.display = "";

            quantidade++;

        } else {

            linha.style.display = "none";

        }

    });


    contador.textContent =
        `${quantidade} funcionário${quantidade !== 1 ? "s" : ""} encontrado${quantidade !== 1 ? "s" : ""}`;

}


btnFiltrar.addEventListener(
    "click",
    filtrarFuncionarios
);


busca.addEventListener(
    "input",
    filtrarFuncionarios
);


/* ==================== EXCLUIR ==================== */

const botoesExcluir =
    document.querySelectorAll(".action-btn.delete");


botoesExcluir.forEach(botao => {

    botao.addEventListener("click", () => {

        const nome =
            botao.dataset.nome;

        const confirmar =
            confirm(
                `Deseja realmente excluir o funcionário ${nome}?`
            );


        if (confirmar) {

            const linha =
                botao.closest("tr");

            linha.remove();

            filtrarFuncionarios();

            alert(
                "Funcionário excluído com sucesso!"
            );

        }

    });

});