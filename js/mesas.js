const API_URL = "http://localhost:8080/api/mesas";

const gridMesas = document.getElementById("gridMesas");
const contador = document.getElementById("contador");

const busca = document.getElementById("busca");
const status = document.getElementById("status");
const btnLimpar = document.getElementById("btnLimpar");


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


function carregarMesas() {
    exibirMesas(mesas);
}


function exibirMesas(lista) {

    gridMesas.innerHTML = "";

    if (lista.length === 0) {

        gridMesas.innerHTML = `
            <div class="empty-message">
                Nenhuma mesa encontrada.
            </div>
        `;

        contador.textContent = "0 mesas encontradas.";
        return;
    }


    lista.forEach(mesa => {

        const card = document.createElement("div");

        card.className = "mesa-card";

        const classeStatus = obterClasseStatus(mesa.status);

        card.innerHTML = `

            <div class="mesa-header">

                <span class="mesa-numero">
                    Mesa ${String(mesa.numero).padStart(2, "0")}
                </span>

                <span class="status ${classeStatus}">
                    ${mesa.status}
                </span>

            </div>


            <div class="mesa-info">
                🪑 ${mesa.capacidade} lugares
            </div>


            <div class="mesa-actions">

                <a
                    href="mesa-cadastro.html?id=${mesa.id}"
                    class="action-btn"
                >
                    Editar
                </a>

                <button
                    type="button"
                    class="action-btn"
                    onclick="alterarStatus(${mesa.id})"
                >
                    Alterar status
                </button>

                <button
                    type="button"
                    class="action-btn qr"
                    onclick="gerarQR(${mesa.id})"
                >
                    Gerar QR
                </button>

                <button
                    type="button"
                    class="action-btn qr"
                    onclick="visualizarQR(${mesa.id})"
                >
                    Visualizar QR
                </button>

                <button
                    type="button"
                    class="action-btn status-btn"
                    onclick="visualizarQR(${mesa.id})"
                >
                    Ver detalhes do QR
                </button>

            </div>
        `;

        gridMesas.appendChild(card);

    });


    contador.textContent =
        `${lista.length} mesa${lista.length !== 1 ? "s" : ""} encontrada${lista.length !== 1 ? "s" : ""}.`;
}


function obterClasseStatus(status) {

    switch (status) {

        case "LIVRE":
            return "status-livre";

        case "OCUPADA":
            return "status-ocupada";

        case "RESERVADA":
            return "status-reservada";

        case "INDISPONÍVEL":
            return "status-indisponivel";

        default:
            return "";

    }
}


function filtrarMesas() {

    const texto = busca.value
        .toLowerCase()
        .trim();

    const statusSelecionado = status.value;


    const resultado = mesas.filter(mesa => {

        const correspondeNumero =
            String(mesa.numero).includes(texto);

        const correspondeStatus =
            !statusSelecionado ||
            mesa.status === statusSelecionado;

        return correspondeNumero && correspondeStatus;

    });


    exibirMesas(resultado);
}


function alterarStatus(id) {

    const mesa = mesas.find(
        mesa => mesa.id === id
    );

    if (!mesa) {
        return;
    }


    const statusDisponiveis = [
        "LIVRE",
        "OCUPADA",
        "RESERVADA",
        "INDISPONÍVEL"
    ];


    const indiceAtual =
        statusDisponiveis.indexOf(mesa.status);

    const proximoIndice =
        (indiceAtual + 1) % statusDisponiveis.length;

    const novoStatus =
        statusDisponiveis[proximoIndice];


    const confirmar = confirm(
        `Alterar a Mesa ${String(mesa.numero).padStart(2, "0")} de ${mesa.status} para ${novoStatus}?`
    );


    if (!confirmar) {
        return;
    }


    mesa.status = novoStatus;

    filtrarMesas();
}


function gerarQR(id) {

    const mesa = mesas.find(
        mesa => mesa.id === id
    );

    if (!mesa) {
        return;
    }


    window.location.href =
        `mesa-qr.html?id=${mesa.id}&gerar=true`;
}


function visualizarQR(id) {

    const mesa = mesas.find(
        mesa => mesa.id === id
    );

    if (!mesa) {
        return;
    }


    window.location.href =
        `mesa-qr.html?id=${mesa.id}`;
}


btnLimpar.addEventListener("click", () => {

    busca.value = "";
    status.value = "";

    exibirMesas(mesas);

});


busca.addEventListener(
    "input",
    filtrarMesas
);


status.addEventListener(
    "change",
    filtrarMesas
);


carregarMesas();