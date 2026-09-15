const categorias = [
    {
        id: 1,
        nome: "Hambúrgueres"
    },
    {
        id: 2,
        nome: "Porções"
    },
    {
        id: 3,
        nome: "Bebidas"
    },
    {
        id: 4,
        nome: "Sobremesas"
    },
    {
        id: 5,
        nome: "Pratos Executivos"
    }
];

let produtos = [
    {
        id: 1,
        nome: "X-Bacon",
        descricao: "Hambúrguer artesanal com bacon e queijo.",
        preco: 25.90,
        categoriaId: 1,
        setor: "COZINHA",
        status: "Ativo"
    },
    {
        id: 2,
        nome: "X-Salada",
        descricao: "Hambúrguer com queijo, alface, tomate e molho especial.",
        preco: 22.90,
        categoriaId: 1,
        setor: "COZINHA",
        status: "Ativo"
    },
    {
        id: 3,
        nome: "Batata Frita",
        descricao: "Porção de batatas fritas crocantes.",
        preco: 18.00,
        categoriaId: 2,
        setor: "COZINHA",
        status: "Ativo"
    },
    {
        id: 4,
        nome: "Refrigerante Lata",
        descricao: "Refrigerante em lata.",
        preco: 6.00,
        categoriaId: 3,
        setor: "SALÃO",
        status: "Ativo"
    }
];

const form = document.getElementById("formProduto");

const campoNome = document.getElementById("nome");
const campoDescricao = document.getElementById("descricao");
const campoPreco = document.getElementById("preco");
const campoCategoria = document.getElementById("categoria");
const campoSetor = document.getElementById("setor");
const campoStatus = document.getElementById("status");
const campoImagem = document.getElementById("imagem");

const previewImagem = document.getElementById("previewImagem");
const semImagem = document.getElementById("semImagem");

const mensagem = document.getElementById("mensagem");
const btnSalvar = document.getElementById("btnSalvar");

const tituloPagina = document.getElementById("tituloPagina");
const subtituloPagina = document.getElementById("subtituloPagina");

const params = new URLSearchParams(window.location.search);
const id = params.get("id");


/* Carrega as categorias */

function carregarCategorias() {

    categorias.forEach(categoria => {

        const option = document.createElement("option");

        option.value = categoria.id;
        option.textContent = categoria.nome;

        campoCategoria.appendChild(option);
    });
}


/* Carrega produto para edição */

function carregarProduto() {

    if (!id) {
        return;
    }

    const produto = produtos.find(
        produto => produto.id === Number(id)
    );

    if (!produto) {

        mostrarMensagem(
            "Produto não encontrado.",
            "erro"
        );

        return;
    }

    tituloPagina.textContent = "Editar produto";

    subtituloPagina.textContent =
        "Altere os dados do produto.";

    btnSalvar.textContent =
        "Salvar alterações";

    campoNome.value = produto.nome;
    campoDescricao.value = produto.descricao || "";
    campoPreco.value = produto.preco;
    campoCategoria.value = produto.categoriaId;
    campoSetor.value = produto.setor;
    campoStatus.value = produto.status;
}


/* Pré-visualização da imagem */

campoImagem.addEventListener("change", function () {

    const arquivo = this.files[0];

    if (!arquivo) {
        return;
    }

    const leitor = new FileReader();

    leitor.onload = function (event) {

        previewImagem.src = event.target.result;

        previewImagem.style.display = "block";
        semImagem.style.display = "none";
    };

    leitor.readAsDataURL(arquivo);
});


/* Mensagem */

function mostrarMensagem(texto, tipo) {

    mensagem.textContent = texto;
    mensagem.className = `mensagem ${tipo}`;
}


/* Salvar produto */

form.addEventListener("submit", function (event) {

    event.preventDefault();

    const nome = campoNome.value.trim();
    const descricao = campoDescricao.value.trim();
    const preco = Number(campoPreco.value);
    const categoriaId = Number(campoCategoria.value);
    const setor = campoSetor.value;
    const status = campoStatus.value;

    if (!nome) {

        mostrarMensagem(
            "Informe o nome do produto.",
            "erro"
        );

        campoNome.focus();
        return;
    }

    if (!preco || preco <= 0) {

        mostrarMensagem(
            "Informe um preço válido.",
            "erro"
        );

        campoPreco.focus();
        return;
    }

    if (!categoriaId) {

        mostrarMensagem(
            "Selecione uma categoria.",
            "erro"
        );

        campoCategoria.focus();
        return;
    }

    if (!setor) {

        mostrarMensagem(
            "Selecione o setor de destino.",
            "erro"
        );

        campoSetor.focus();
        return;
    }

    const dados = {
        nome,
        descricao,
        preco,
        categoriaId,
        setor,
        status
    };

    if (id) {

        const produto = produtos.find(
            produto => produto.id === Number(id)
        );

        if (produto) {
            Object.assign(produto, dados);
        }

        mostrarMensagem(
            "Produto atualizado com sucesso!",
            "sucesso"
        );

    } else {

        const novoId = produtos.length > 0
            ? Math.max(...produtos.map(produto => produto.id)) + 1
            : 1;

        produtos.push({
            id: novoId,
            ...dados
        });

        mostrarMensagem(
            "Produto cadastrado com sucesso!",
            "sucesso"
        );
    }

    btnSalvar.disabled = true;

    setTimeout(() => {

        window.location.href = "produtos.html";

    }, 1000);

});


/* Inicia a página */

carregarCategorias();
carregarProduto();