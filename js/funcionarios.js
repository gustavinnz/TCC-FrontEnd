const btnNovoFuncionario = document.getElementById("btnNovoFuncionario");
const btnFiltrar = document.getElementById("btnFiltrar");
const busca = document.getElementById("busca");


// NOVO FUNCIONÁRIO
btnNovoFuncionario.addEventListener("click", function () {
    window.location.href = "funcionario-cadastro.html";
});


// FILTRAR
btnFiltrar.addEventListener("click", function () {

    const textoBusca = busca.value.trim();

    if (textoBusca === "") {
        alert("Informe um nome ou e-mail para realizar a busca.");
        return;
    }

    alert("Busca realizada por: " + textoBusca);

});


// EDITAR FUNCIONÁRIO
const botoesEditar = document.querySelectorAll(".action-btn.edit");

botoesEditar.forEach(function (botao) {

    botao.addEventListener("click", function () {

        const nome = botao.getAttribute("data-nome");

        alert("Editar funcionário: " + nome);

    });

});


// EXCLUIR FUNCIONÁRIO
const botoesExcluir = document.querySelectorAll(".action-btn.delete");

botoesExcluir.forEach(function (botao) {

    botao.addEventListener("click", function () {

        const nome = botao.getAttribute("data-nome");

        const confirmar = confirm(
            "Deseja realmente excluir o funcionário " + nome + "?"
        );

        if (confirmar) {

            alert("Funcionário excluído temporariamente.");

        }

    });

});