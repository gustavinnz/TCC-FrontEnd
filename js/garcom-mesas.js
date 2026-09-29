const API_URL = "http://localhost:8080/api/mesas";

let mesas = [
    {
        id: 1,
        numero: 1,
        capacidade: 2,
        status: "LIVRE",
        consumo: 0,
        notificacao: false
    },
    {
        id: 2,
        numero: 2,
        capacidade: 4,
        status: "OCUPADA",
        consumo: 86.50,
        notificacao: false
    },
    {
        id: 3,
        numero: 3,
        capacidade: 6,
        status: "RESERVADA",
        consumo: 0,
        notificacao: false
    },
    {
        id: 4,
        numero: 4,
        capacidade: 4,
        status: "LIVRE",
        consumo: 0,
        notificacao: true
    },
    {
        id: 5,
        numero: 5,
        capacidade: 6,
        status: "OCUPADA",
        consumo: 124.90,
        notificacao: true
    },
    {
        id: 6,
        numero: 6,
        capacidade: 2,
        status: "OCUPADA",
        consumo: 48.00,
        notificacao: false
    },
    {
        id: 7,
        numero: 7,
        capacidade: 4,
        status: "LIVRE",
        consumo: 0,
        notificacao: false
    },
    {
        id: 8,
        numero: 8,
        capacidade: 6,
        status: "RESERVADA",
        consumo: 0,
        notificacao: false
    }
];

let filtroAtual = "TODAS";

const mesasContainer = document.getElementById("mesasContainer");
const estadoVazio = document.getElementById("estadoVazio");
const buscaMesa = document.getElementById("buscaMesa");

function formatarMoeda(valor) {
    return valor.toLocaleString("pt-BR", {
        style: "currency",
        currency: "BRL"
    });
}

function obterClasseStatus(status) {

    if (status === "LIVRE") {
        return "badge-livre";
    }

    if (status === "OCUPADA") {
        return "badge-ocupada";
    }

    if (status === "RESERVADA") {
        return "badge-reservada";
    }

    return "badge-indisponivel";
}

function renderizarMesas() {

    const busca = buscaMesa.value.trim().toLowerCase();

    let mesasFiltradas = mesas.filter(mesa => {

        const correspondeBusca =
            mesa.numero.toString().includes(busca);

        let correspondeFiltro = true;

        if (filtroAtual !== "TODAS") {

            if (filtroAtual === "NOTIFICACAO") {
                correspondeFiltro = mesa.notificacao === true;
            } else {
                correspondeFiltro = mesa.status === filtroAtual;
            }

        }

        return correspondeBusca && correspondeFiltro;
    });

    mesasContainer.innerHTML = "";

    if (mesasFiltradas.length === 0) {
        estadoVazio.style.display = "block";
        return;
    }

    estadoVazio.style.display = "none";

    mesasFiltradas.forEach(mesa => {

        const card = document.createElement("div");

        card.className = "mesa-card";

        const consumoHTML = mesa.status === "OCUPADA"
            ? `
                <div class="consumo">
                    <div class="consumo-label">
                        Consumo atual
                    </div>

                    <div class="consumo-valor">
                        ${formatarMoeda(mesa.consumo)}
                    </div>
                </div>
            `
            : `
                <div class="consumo">
                    <div class="consumo-label">
                        Consumo atual
                    </div>

                    <div class="consumo-valor">
                        R$ 0,00
                    </div>
                </div>
            `;

        const alertaHTML = mesa.notificacao
            ? `
                <div class="alerta">
                    🔔 Nova notificação
                </div>
            `
            : "";

        card.innerHTML = `
            <div class="mesa-topo">

                <div>
                    <div class="mesa-numero">
                        Mesa ${String(mesa.numero).padStart(2, "0")}
                    </div>

                    <div class="mesa-capacidade">
                        ${mesa.capacidade} lugares
                    </div>
                </div>

                <span class="badge ${obterClasseStatus(mesa.status)}">
                    ${mesa.status}
                </span>

            </div>

            ${consumoHTML}

            ${alertaHTML}

            <div class="mesa-acoes">

                <button
                    class="btn-acao principal"
                    onclick="abrirMesa(${mesa.id})">
                    ABRIR MESA
                </button>

                <button
                    class="btn-acao"
                    onclick="novoPedido(${mesa.id})">
                    NOVO PEDIDO
                </button>

                <button
                    class="btn-acao"
                    onclick="verConta(${mesa.id})">
                    VER CONTA
                </button>

                <button
                    class="btn-acao"
                    onclick="verDetalhes(${mesa.id})">
                    DETALHES
                </button>

            </div>
        `;

        mesasContainer.appendChild(card);
    });
}

function abrirMesa(id) {

    const mesa = mesas.find(mesa => mesa.id === id);

    if (!mesa) {
        return;
    }

    if (mesa.status === "INDISPONÍVEL") {
        alert("Esta mesa está indisponível.");
        return;
    }

    alert(`Mesa ${mesa.numero} selecionada.`);
}

function novoPedido(id) {

    const mesa = mesas.find(mesa => mesa.id === id);

    if (!mesa) {
        return;
    }

    window.location.href = `novo-pedido.html?mesa=${mesa.id}`;
}

function verConta(id) {

    const mesa = mesas.find(mesa => mesa.id === id);

    if (!mesa) {
        return;
    }

    alert(`Abrindo conta da Mesa ${mesa.numero}.`);
}

function verDetalhes(id) {

    const mesa = mesas.find(mesa => mesa.id === id);

    if (!mesa) {
        return;
    }

    window.location.href = `mesa-detalhes.html?id=${mesa.id}`;
}

document.querySelectorAll(".filtro").forEach(botao => {

    botao.addEventListener("click", () => {

        document.querySelectorAll(".filtro").forEach(item => {
            item.classList.remove("active");
        });

        botao.classList.add("active");

        filtroAtual = botao.dataset.filtro;

        renderizarMesas();
    });

});

buscaMesa.addEventListener("input", renderizarMesas);

document.getElementById("btnNotificacoes").addEventListener("click", () => {
    window.location.href = "notificacoes.html";
});

renderizarMesas();