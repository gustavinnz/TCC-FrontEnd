const API_URL = "http://localhost:8080/api/categorias";

const tabela = document.getElementById("tabelaCategorias");
const contador = document.getElementById("contador");

const busca = document.getElementById("busca");
const status = document.getElementById("status");

const btnFiltrar = document.getElementById("btnFiltrar");
const btnLimpar = document.getElementById("btnLimpar");

let categorias = [
    {
        id: 1,
        nome: "Hambúrgueres",
        descricao: "Hambúrgueres artesanais e tradicionais",
        ordem: 1,
        status: "Ativo"
    },
    {
        id: 2,
        nome: "Porções",
        descricao: "Porções e acompanhamentos",
        ordem: 2,
        status: "Ativo"
    },
    {
        id: 3,
        nome: "Bebidas",
        descricao: "Refrigerantes, sucos e outras bebidas",
        ordem: 3,
        status: "Ativo"
    },
    {
        id: 4,
        nome: "Sobremesas",
        descricao: "Sobremesas e doces",
        ordem: 4,
        status: "Ativo"
    },
    {
        id: 5,
        nome: "Pratos Executivos",
        descricao: "Pratos completos para refeições",
        ordem: 5,
        status: "Inativo"
    }
];


/* Carrega as categorias */

function carregarCategorias() {

    exibirCategorias(categorias);

}


/* Exibe as categorias */

function exibirCategorias(lista) {

    tabela.innerHTML = "";

    if (lista.length === 0) {

        tabela.innerHTML = `
            <tr>
                <td colspan="5" class="empty-message">
                    Nenhuma categoria encontrada.
                </td>
            </tr>
        `;

        contador.textContent = "0 categorias encontradas.";

        return;
    }

    lista.forEach(categoria => {

        const linha = document.createElement("tr");

        const ativo = categoria.status === "Ativo";

        linha.innerHTML = `
            <td>
                <strong>${categoria.nome}</strong>
            </td>

            <td>
                ${categoria.descricao || "Sem descrição"}
            </td>

            <td>
                ${categoria.ordem}
            </td>

            <td>
                <span class="status ${ativo ? "status-active" : "status-inactive"}">
                    ${categoria.status}
                </span>
            </td>

            <td class="actions">

                <a
                    href="categoria-cadastro.html?id=${categoria.id}"
                    class="action-btn edit"
                >
                    Editar
                </a>

                <button
                    class="action-btn toggle"
                    onclick="alterarStatus(${categoria.id})"
                >
                    ${ativo ? "Desativar" : "Ativar"}
                </button>

                <button
                    class="action-btn delete"
                    onclick="excluirCategoria(${categoria.id})"
                >
                    Excluir
                </button>

            </td>
        `;

        tabela.appendChild(linha);
    });

    contador.textContent =
        `${lista.length} categoria${lista.length !== 1 ? "s" : ""} encontrada${lista.length !== 1 ? "s" : ""}.`;
}


/* Filtra as categorias */

function filtrarCategorias() {

    const texto = busca.value.toLowerCase().trim();
    const statusSelecionado = status.value;

    const resultado = categorias.filter(categoria => {

        const correspondeTexto =
            categoria.nome.toLowerCase().includes(texto) ||
            (categoria.descricao || "").toLowerCase().includes(texto);

        const correspondeStatus =
            !statusSelecionado ||
            categoria.status === statusSelecionado;

        return correspondeTexto && correspondeStatus;
    });

    exibirCategorias(resultado);
}


/* Limpa os filtros */

btnLimpar.addEventListener("click", () => {

    busca.value = "";
    status.value = "";

    exibirCategorias(categorias);

});


/* Botão filtrar */

btnFiltrar.addEventListener("click", filtrarCategorias);


/* Busca automática */

busca.addEventListener("input", filtrarCategorias);

status.addEventListener("change", filtrarCategorias);


/* Ativa ou desativa uma categoria */

function alterarStatus(id) {

    const categoria = categorias.find(
        categoria => categoria.id === id
    );

    if (!categoria) {
        return;
    }

    const novoStatus =
        categoria.status === "Ativo"
            ? "Inativo"
            : "Ativo";

    const confirmar = confirm(
        `Deseja realmente ${novoStatus === "Ativo" ? "ativar" : "desativar"} esta categoria?`
    );

    if (!confirmar) {
        return;
    }

    categoria.status = novoStatus;

    filtrarCategorias();

}


/* Exclui uma categoria */

function excluirCategoria(id) {

    const categoria = categorias.find(
        categoria => categoria.id === id
    );

    if (!categoria) {
        return;
    }

    const confirmar = confirm(
        `Deseja realmente excluir a categoria "${categoria.nome}"?`
    );

    if (!confirmar) {
        return;
    }

    categorias = categorias.filter(
        categoria => categoria.id !== id
    );

    filtrarCategorias();

}


/* Inicia a página */

carregarCategorias();