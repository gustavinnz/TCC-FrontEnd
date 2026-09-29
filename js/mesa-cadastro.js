const API_URL = "http://localhost:8080/api/mesas";

const form = document.getElementById("formMesa");

const numero = document.getElementById("numero");
const capacidade = document.getElementById("capacidade");
const status = document.getElementById("status");

const tituloPagina = document.getElementById("tituloPagina");
const descricaoPagina = document.getElementById("descricaoPagina");
const btnSalvar = document.getElementById("btnSalvar");


let mesas = [
    {
        id: 1,
        numero: 1,
        capacidade: 2,
        status: "LIVRE",
        ativo: true
    },
    {
        id: 2,
        numero: 2,
        capacidade: 4,
        status: "OCUPADA",
        ativo: true
    },
    {
        id: 3,
        numero: 3,
        capacidade: 6,
        status: "RESERVADA",
        ativo: true
    },
    {
        id: 4,
        numero: 4,
        capacidade: 4,
        status: "LIVRE",
        ativo: true
    },
    {
        id: 5,
        numero: 5,
        capacidade: 6,
        status: "OCUPADA",
        ativo: true
    },
    {
        id: 6,
        numero: 6,
        capacidade: 2,
        status: "INDISPONÍVEL",
        ativo: false
    }
];


const parametros =
    new URLSearchParams(window.location.search);

const id = parametros.get("id");


function carregarMesa() {

    if (!id) {
        return;
    }

    const mesa = mesas.find(
        mesa => mesa.id === Number(id)
    );

    if (!mesa) {
        alert("Mesa não encontrada.");
        window.location.href = "mesas.html";
        return;
    }


    tituloPagina.textContent = "Editar Mesa";

    descricaoPagina.textContent =
        "Altere os dados da mesa cadastrada.";


    numero.value = mesa.numero;
    capacidade.value = mesa.capacidade;
    status.value = mesa.status;

    btnSalvar.textContent = "Salvar alterações";
}


form.addEventListener("submit", event => {

    event.preventDefault();


    const numeroValor =
        Number(numero.value);

    const capacidadeValor =
        Number(capacidade.value);

    const statusValor =
        status.value;


    if (numeroValor <= 0) {
        alert("Informe um número de mesa válido.");
        numero.focus();
        return;
    }


    if (capacidadeValor <= 0) {
        alert("Informe uma capacidade válida.");
        capacidade.focus();
        return;
    }


    const mesaExistente =
        mesas.find(mesa =>
            mesa.numero === numeroValor &&
            mesa.id !== Number(id)
        );


    if (mesaExistente) {
        alert("Já existe uma mesa com esse número.");
        numero.focus();
        return;
    }


    if (id) {

        const mesa = mesas.find(
            mesa => mesa.id === Number(id)
        );

        if (!mesa) {
            return;
        }

        mesa.numero = numeroValor;
        mesa.capacidade = capacidadeValor;
        mesa.status = statusValor;

        alert("Mesa atualizada com sucesso.");

    } else {

        const novoId =
            mesas.length > 0
                ? Math.max(...mesas.map(mesa => mesa.id)) + 1
                : 1;


        mesas.push({
            id: novoId,
            numero: numeroValor,
            capacidade: capacidadeValor,
            status: statusValor,
            ativo: statusValor !== "INDISPONÍVEL"
        });


        alert("Mesa cadastrada com sucesso.");

    }


    window.location.href = "mesas.html";

});


carregarMesa();