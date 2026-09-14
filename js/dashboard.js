const btnFiltrar = document.getElementById("btnFiltrar");
const btnAtualizar = document.getElementById("btnAtualizar");
const btnRelatorios = document.getElementById("btnRelatorios");
const periodo = document.getElementById("periodo");
const chartTooltip = document.getElementById("chartTooltip");
const tooltipPeriodo = document.getElementById("tooltipPeriodo");
const tooltipValor = document.getElementById("tooltipValor");


// FILTRAR
btnFiltrar.addEventListener("click", function () {

    alert("Filtro aplicado para: " + periodo.options[periodo.selectedIndex].text);

});


// ATUALIZAR
btnAtualizar.addEventListener("click", function () {

    btnAtualizar.textContent = "ATUALIZANDO...";
    btnAtualizar.disabled = true;

    setTimeout(function () {

        btnAtualizar.textContent = "ATUALIZAR";
        btnAtualizar.disabled = false;

        alert("Dashboard atualizado com sucesso!");

    }, 1000);

});


// VER RELATÓRIOS
btnRelatorios.addEventListener("click", function () {

    alert("Tela de relatórios será implementada posteriormente.");

});

// ============================================
// DASHBOARD - HAWKCYBER
// ============================================


// ============================================
// DADOS TEMPORÁRIOS
// ============================================
//
// Estes valores são apenas para testar o gráfico.
//
// Futuramente estes dados serão substituídos
// pelos dados recebidos do Back-end.
//

const dadosGraficos = {

    semana: [
        { periodo: "Seg", valor: 1250 },
        { periodo: "Ter", valor: 1600 },
        { periodo: "Qua", valor: 900 },
        { periodo: "Qui", valor: 1800 },
        { periodo: "Sex", valor: 1450 },
        { periodo: "Sáb", valor: 1950 },
        { periodo: "Dom", valor: 1550 }
    ],

    mes: [
        { periodo: "1ª sem.", valor: 5200 },
        { periodo: "2ª sem.", valor: 7800 },
        { periodo: "3ª sem.", valor: 6500 },
        { periodo: "4ª sem.", valor: 9200 }
    ],

    ano: [
        { periodo: "Jan", valor: 12000 },
        { periodo: "Fev", valor: 14500 },
        { periodo: "Mar", valor: 13800 },
        { periodo: "Abr", valor: 17000 },
        { periodo: "Mai", valor: 15500 },
        { periodo: "Jun", valor: 19000 },
        { periodo: "Jul", valor: 21000 },
        { periodo: "Ago", valor: 18500 },
        { periodo: "Set", valor: 23000 },
        { periodo: "Out", valor: 25000 },
        { periodo: "Nov", valor: 27000 },
        { periodo: "Dez", valor: 30000 }
    ]

};


// ============================================
// ELEMENTOS
// ============================================

const chartButtons =
    document.querySelectorAll(".chart-btn");

const chartDescription =
    document.getElementById("chartDescription");

const linhaGrafico =
    document.getElementById("linhaGrafico");

const pontosGrafico =
    document.getElementById("pontosGrafico");

const chartLabels =
    document.getElementById("chartLabels");

const chartY =
    document.getElementById("chartY");


// ============================================
// FORMATAR DINHEIRO
// ============================================

function formatarMoeda(valor) {

    return valor.toLocaleString("pt-BR", {
        style: "currency",
        currency: "BRL",
        maximumFractionDigits: 0
    });

}


// ============================================
// ATUALIZAR ESCALA VERTICAL
// ============================================

function atualizarEscala(dados) {

    const valores = dados.map(item => item.valor);

    const maiorValor = Math.max(...valores);

    // Cria uma margem de 10% acima do maior valor
    const valorMaximo =
        maiorValor > 0
            ? maiorValor * 1.1
            : 100;

    chartY.innerHTML = "";

    for (let i = 4; i >= 0; i--) {

        const valor =
            (valorMaximo / 4) * i;

        const span =
            document.createElement("span");

        span.textContent =
            formatarMoeda(valor);

        chartY.appendChild(span);
    }

    return valorMaximo;
}


// ============================================
// DESENHAR GRÁFICO
// ============================================

function atualizarGrafico(dados) {

    if (!dados || dados.length === 0) {

        linhaGrafico.setAttribute("points", "");

        pontosGrafico.innerHTML = "";

        chartLabels.innerHTML = "";

        return;
    }


    const largura = 700;
    const altura = 250;
    const margem = 20;


    const maiorValor =
        Math.max(
            ...dados.map(item => item.valor)
        );


    const valorMaximo =
        maiorValor > 0
            ? maiorValor * 1.1
            : 100;


    const distanciaX =
        dados.length === 1
            ? 0
            : (largura - margem * 2) /
              (dados.length - 1);


    let pontosLinha = "";


    pontosGrafico.innerHTML = "";
    chartLabels.innerHTML = "";


    dados.forEach((item, index) => {

        const x =
            margem +
            (index * distanciaX);


        const percentual =
            item.valor / valorMaximo;


        const y =
            altura -
            margem -
            (
                percentual *
                (altura - margem * 2)
            );


        pontosLinha +=
            `${x},${y} `;


        // ================================
        // CRIA PONTO
        // ================================

        const ponto =
            document.createElementNS(
                "http://www.w3.org/2000/svg",
                "circle"
            );


        ponto.setAttribute("cx", x);
        ponto.setAttribute("cy", y);
        ponto.setAttribute("r", "6");


        // ================================
        // MINI CARD
        // ================================

        ponto.addEventListener(
            "mouseenter",
            function () {

                tooltipPeriodo.textContent =
                    item.periodo;

                tooltipValor.textContent =
                    formatarMoeda(item.valor);


                const svg =
                    document.getElementById(
                        "graficoLinha"
                    );


                const rect =
                    svg.getBoundingClientRect();


                const escalaX =
                    rect.width / 700;

                const escalaY =
                    rect.height / 250;


                chartTooltip.style.left =
                    `${x * escalaX}px`;

                chartTooltip.style.top =
                    `${y * escalaY}px`;


                chartTooltip.style.display =
                    "block";
            }
        );


        ponto.addEventListener(
            "mouseleave",
            function () {

                chartTooltip.style.display =
                    "none";

            }
        );


        pontosGrafico.appendChild(ponto);


        // ================================
        // LABEL
        // ================================

        const label =
            document.createElement("span");

        label.textContent =
            item.periodo;

        chartLabels.appendChild(label);

    });


    // ================================
    // DESENHA A LINHA
    // ================================

    linhaGrafico.classList.remove(
        "animando"
    );


    // Força o navegador a reiniciar
    // a animação

    void linhaGrafico.offsetWidth;


    linhaGrafico.setAttribute(
        "points",
        pontosLinha.trim()
    );


    linhaGrafico.classList.add(
        "animando"
    );


    // ================================
    // ANIMA OS PONTOS
    // ================================

    const pontos =
        pontosGrafico.querySelectorAll(
            "circle"
        );


    pontos.forEach((ponto, index) => {

        ponto.style.animationDelay =
            `${index * 0.08}s`;

        ponto.classList.add(
            "aparecer"
        );

    });


    // ================================
    // ESCALA
    // ================================

    atualizarEscala(dados);
}


// ============================================
// DESCRIÇÃO
// ============================================

function atualizarDescricao(periodo) {

    if (periodo === "semana") {

        chartDescription.textContent =
            "Faturamento dos últimos 7 dias";

    }

    else if (periodo === "mes") {

        chartDescription.textContent =
            "Faturamento das últimas semanas";

    }

    else if (periodo === "ano") {

        chartDescription.textContent =
            "Faturamento dos últimos 12 meses";

    }

}


// ============================================
// TROCAR GRÁFICO
// ============================================

chartButtons.forEach(button => {

    button.addEventListener(
        "click",
        function () {

            const periodo =
                this.dataset.chart;


            // Remove ativo
            chartButtons.forEach(btn => {

                btn.classList.remove(
                    "active"
                );

            });


            // Ativa botão clicado

            this.classList.add(
                "active"
            );


            // Atualiza gráfico

            atualizarGrafico(
                dadosGraficos[periodo]
            );


            // Atualiza texto

            atualizarDescricao(
                periodo
            );

        }
    );

});


// ============================================
// GRÁFICO INICIAL
// ============================================
//
// Semana aparece primeiro.
//

atualizarGrafico(
    dadosGraficos.semana
);

atualizarDescricao(
    "semana"
);