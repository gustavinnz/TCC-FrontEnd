const API_URL = "http://localhost:8080/api/produtos";
const CATEGORIAS_URL = "http://localhost:8080/api/categorias";

const tabela = document.getElementById("tabelaProdutos");
const estadoVazio = document.getElementById("estadoVazio");
const estadoCarregando = document.getElementById("estadoCarregando");
const contador = document.getElementById("contador");
const mensagem = document.getElementById("mensagem");

const busca = document.getElementById("busca");
const categoria = document.getElementById("categoria");
const setor = document.getElementById("setor");
const status = document.getElementById("status");

let produtos = [
    {
        id: 1,
        nome: "X-Bacon",
        preco: 25.90,
        categoriaId: 1,
        categoriaNome: "Hambúrgueres",
        setor: "COZINHA",
        status: "Ativo"
    },
    {
        id: 2,
        nome: "X-Salada",
        preco: 22.90,
        categoriaId: 1,
        categoriaNome: "Hambúrgueres",
        setor: "COZINHA",
        status: "Ativo"
    },
    {
        id: 3,
        nome: "Batata Frita",
        preco: 18.00,
        categoriaId: 2,
        categoriaNome: "Porções",
        setor: "COZINHA",
        status: "Ativo"
    },
    {
        id: 4,
        nome: "Refrigerante Lata",
        preco: 6.00,
        categoriaId: 3,
        categoriaNome: "Bebidas",
        setor: "SALÃO",
        status: "Ativo"
    },
    {
        id: 5,
        nome: "Suco Natural",
        preco: 9.00,
        categoriaId: 3,
        categoriaNome: "Bebidas",
        setor: "SALÃO",
        status: "Inativo"
    }
];

function formatarMoeda(valor) {

    return Number(valor).toLocaleString("pt-BR", {
        style: "currency",
        currency: "BRL"
    });
}

function mostrarMensagem(texto, tipo) {

    mensagem.textContent = texto;
    mensagem.className = `mensagem ${tipo}`;

    setTimeout(() => {
        mensagem.className = "mensagem";
    }, 3000);
}

function criarLinha(produto) {

    const tr = document.createElement("tr");

    const classeStatus =
        produto.status === "Ativo"
            ? "ativo"
            : "inativo";

    const classeSetor =
        produto.setor === "COZINHA"
            ? "cozinha"
            : "salao";

    const textoSetor =
        produto.setor === "COZINHA"
            ? "Cozinha"
            : "Salão";

    tr.innerHTML = `
        <td>
            <span class="produto-nome">
                ${produto.nome}
            </span>
        </td>

        <td>
            ${produto.categoriaNome || produto.categoria || "-"}
        </td>

        <td>
            <span class="preco">
                ${formatarMoeda(produto.preco)}
            </span>
        </td>

        <td>
            <span class="badge ${classeSetor}">
                ${textoSetor}
            </span>
        </td>

        <td>
            <span class="badge ${classeStatus}">
                ${produto.status}
            </span>
        </td>

        <td>

            <div class="acoes">

                <a
                    href="produto-cadastro.html?id=${produto.id}"
                    class="btn-acao"
                >
                    Editar
                </a>

                <button
                    class="btn-acao"
                    onclick="alterarStatus(${produto.id}, '${produto.status}')"
                >
                    ${produto.status === "Ativo" ? "Desativar" : "Ativar"}
                </button>

                <button
                    class="btn-acao excluir"
                    onclick="excluirProduto(${produto.id})"
                >
                    Excluir
                </button>

            </div>

        </td>
    `;

    return tr;
}

function renderizarProdutos() {

    tabela.innerHTML = "";

    const textoBusca = busca.value
        .toLowerCase()
        .trim();

    const categoriaSelecionada = categoria.value;
    const setorSelecionado = setor.value;
    const statusSelecionado = status.value;

    const filtrados = produtos.filter(produto => {

        const correspondeBusca =
            !textoBusca ||
            produto.nome.toLowerCase().includes(textoBusca);

        const nomeCategoria =
            produto.categoriaNome || produto.categoria || "";

        const correspondeCategoria =
            !categoriaSelecionada ||
            String(produto.categoriaId) === categoriaSelecionada ||
            nomeCategoria === categoriaSelecionada;

        const correspondeSetor =
            !setorSelecionado ||
            produto.setor === setorSelecionado;

        const correspondeStatus =
            !statusSelecionado ||
            produto.status === statusSelecionado;

        return (
            correspondeBusca &&
            correspondeCategoria &&
            correspondeSetor &&
            correspondeStatus
        );
    });

    contador.textContent =
        `${filtrados.length} produto${filtrados.length !== 1 ? "s" : ""}`;

    if (filtrados.length === 0) {

        estadoVazio.style.display = "block";
        return;
    }

    estadoVazio.style.display = "none";

    filtrados.forEach(produto => {
        tabela.appendChild(criarLinha(produto));
    });
}

async function carregarCategorias() {

    try {

        const resposta = await fetch(CATEGORIAS_URL);

        if (!resposta.ok) {
            throw new Error();
        }

        const categorias = await resposta.json();

        categorias.forEach(item => {

            const option = document.createElement("option");

            option.value = item.id;
            option.textContent = item.nome;

            categoria.appendChild(option);
        });

    } catch (erro) {

        console.error("Erro ao carregar categorias:", erro);
    }
}

async function carregarProdutos() {

    estadoCarregando.style.display = "none";

    renderizarProdutos();
}

async function alterarStatus(id, statusAtual) {

    const novoStatus =
        statusAtual === "Ativo"
            ? "Inativo"
            : "Ativo";

    const confirmacao = confirm(
        `Deseja realmente ${novoStatus === "Ativo" ? "ativar" : "desativar"} este produto?`
    );

    if (!confirmacao) {
        return;
    }

    try {

        const resposta = await fetch(
            `${API_URL}/${id}/status`,
            {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    status: novoStatus
                })
            }
        );

        if (!resposta.ok) {
            throw new Error();
        }

        mostrarMensagem(
            `Produto ${novoStatus.toLowerCase()} com sucesso.`,
            "sucesso"
        );

        carregarProdutos();

    } catch (erro) {

        mostrarMensagem(
            "Não foi possível alterar o status do produto.",
            "erro"
        );
    }
}

async function excluirProduto(id) {

    const confirmacao = confirm(
        "Deseja realmente excluir este produto? Essa ação não poderá ser desfeita."
    );

    if (!confirmacao) {
        return;
    }

    try {

        const resposta = await fetch(
            `${API_URL}/${id}`,
            {
                method: "DELETE"
            }
        );

        if (!resposta.ok) {
            throw new Error();
        }

        mostrarMensagem(
            "Produto excluído com sucesso.",
            "sucesso"
        );

        carregarProdutos();

    } catch (erro) {

        mostrarMensagem(
            "Não foi possível excluir o produto.",
            "erro"
        );
    }
}

busca.addEventListener("input", renderizarProdutos);
categoria.addEventListener("change", renderizarProdutos);
setor.addEventListener("change", renderizarProdutos);
status.addEventListener("change", renderizarProdutos);

carregarCategorias();
carregarProdutos();