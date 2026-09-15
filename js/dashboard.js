/*DADOS TEMPORÁRIOS*/


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


/* =====================================================
   MÉTODOS DE PAGAMENTO
   ===================================================== */

const dadosPagamentos = [

    {
        metodo: "Cartão",
        valor: 4200,
        quantidade: 52
    },

    {
        metodo: "Dinheiro",
        valor: 1850,
        quantidade: 21
    },

    {
        metodo: "Pix",
        valor: 5600,
        quantidade: 73
    }

];


/* =====================================================
   PRODUTOS MAIS VENDIDOS
   =====================================================

   Futuramente esses dados virão dos produtos cadastrados
   pelo ADM e das vendas registradas pelo sistema.
*/

let produtosMaisVendidos = [

    {
        nome: "Hambúrguer",
        quantidade: 82
    },

    {
        nome: "Batata Frita",
        quantidade: 67
    },

    {
        nome: "Refrigerante",
        quantidade: 61
    },

    {
        nome: "X-Salada",
        quantidade: 48
    },

    {
        nome: "Suco Natural",
        quantidade: 35
    }

];


/* =====================================================
   ELEMENTOS DO GRÁFICO
   ===================================================== */

const linhaGrafico =
    document.getElementById("linhaGrafico");

const pontosGrafico =
    document.getElementById("pontosGrafico");

const chartLabels =
    document.getElementById("chartLabels");

const chartY =
    document.getElementById("chartY");

const chartTooltip =
    document.getElementById("chartTooltip");

const tooltipPeriodo =
    document.getElementById("tooltipPeriodo");

const tooltipValor =
    document.getElementById("tooltipValor");


/* =====================================================
   FORMATAÇÃO
   ===================================================== */

function formatarMoeda(valor) {

    return valor.toLocaleString("pt-BR", {
        style: "currency",
        currency: "BRL",
        maximumFractionDigits: 0
    });

}


/* =====================================================
   ESCALA DO GRÁFICO
   ===================================================== */

function atualizarEscala(dados) {

    const valores =
        dados.map(item => item.valor);

    const maiorValor =
        Math.max(...valores);

    const maximo =
        maiorValor * 1.1;

    chartY.innerHTML = "";


    for (let i = 4; i >= 0; i--) {

        const valor =
            maximo * (i / 4);

        const elemento =
            document.createElement("span");

        elemento.textContent =
            formatarMoeda(valor);

        chartY.appendChild(elemento);
    }

}


/* =====================================================
   GRÁFICO DE FATURAMENTO
   ===================================================== */

function atualizarGrafico(dados) {

    if (!dados || dados.length === 0) {
        return;
    }


    atualizarEscala(dados);


    const valores =
        dados.map(item => item.valor);

    const maiorValor =
        Math.max(...valores) * 1.1;


    const largura = 1000;

    const altura = 250;

    const margemX = 30;

    const margemY = 15;


    const espaco =
        dados.length === 1
            ? 0
            : (largura - margemX * 2) /
              (dados.length - 1);


    const pontos = dados.map((item, index) => {

        const x =
            dados.length === 1
                ? largura / 2
                : margemX + (index * espaco);


        const y =
            altura -
            margemY -
            ((item.valor / maiorValor) *
            (altura - margemY * 2));


        return {
            x,
            y,
            item
        };

    });


    linhaGrafico.setAttribute(
        "points",
        pontos
            .map(p => `${p.x},${p.y}`)
            .join(" ")
    );


    pontosGrafico.innerHTML = "";


    chartLabels.innerHTML = "";


    pontos.forEach((ponto, index) => {


        /* PONTO */

        const circle =
            document.createElementNS(
                "http://www.w3.org/2000/svg",
                "circle"
            );


        circle.setAttribute(
            "cx",
            ponto.x
        );

        circle.setAttribute(
            "cy",
            ponto.y
        );

        circle.setAttribute(
            "r",
            "6"
        );


        circle.addEventListener(
            "mouseenter",
            () => mostrarTooltip(ponto)
        );


        circle.addEventListener(
            "mouseleave",
            esconderTooltip
        );


        pontosGrafico.appendChild(circle);


        /* LABEL */

        const label =
            document.createElement("span");

        label.textContent =
            ponto.item.periodo;

        chartLabels.appendChild(label);

    });


    animarGrafico();

}


/* =====================================================
   ANIMAÇÃO
   ===================================================== */

function animarGrafico() {

    const comprimento =
        linhaGrafico.getTotalLength();


    linhaGrafico.style.strokeDasharray =
        comprimento;

    linhaGrafico.style.strokeDashoffset =
        comprimento;


    linhaGrafico.getBoundingClientRect();


    linhaGrafico.style.transition =
        "stroke-dashoffset 0.8s ease";


    linhaGrafico.style.strokeDashoffset =
        "0";


    const pontos =
        pontosGrafico.querySelectorAll("circle");


    pontos.forEach((ponto, index) => {

        ponto.style.opacity = "0";

        ponto.style.transform = "scale(0)";


        setTimeout(() => {

            ponto.style.transition =
                "opacity 0.25s ease, transform 0.25s ease";

            ponto.style.opacity = "1";

            ponto.style.transform = "scale(1)";

        }, index * 80);

    });

}


/* =====================================================
   TOOLTIP
   ===================================================== */

function mostrarTooltip(ponto) {

    tooltipPeriodo.textContent =
        ponto.item.periodo;

    tooltipValor.textContent =
        formatarMoeda(ponto.item.valor);


    chartTooltip.style.display =
        "block";


    const svg =
        document.getElementById(
            "graficoFaturamento"
        );


    const rect =
        svg.getBoundingClientRect();


    const x =
        (ponto.x / 1000) *
        rect.width;


    const y =
        (ponto.y / 250) *
        rect.height;


    chartTooltip.style.left =
        `${x}px`;

    chartTooltip.style.top =
        `${y}px`;

}


function esconderTooltip() {

    chartTooltip.style.display =
        "none";

}


/* =====================================================
   BOTÕES SEMANA / MÊS / ANO
   ===================================================== */

document.querySelectorAll(".chart-btn")
    .forEach(botao => {

        botao.addEventListener(
            "click",
            function () {

                document
                    .querySelectorAll(".chart-btn")
                    .forEach(btn => {

                        btn.classList.remove("active");

                    });


                this.classList.add("active");


                const periodo =
                    this.dataset.chart;


                atualizarGrafico(
                    dadosGraficos[periodo]
                );

            }
        );

    });


/* =====================================================
   MÉTODOS DE PAGAMENTO
   ===================================================== */

function atualizarPagamentos() {

    const container =
        document.getElementById(
            "paymentBars"
        );

    const resumo =
        document.getElementById(
            "paymentSummary"
        );


    container.innerHTML = "";

    resumo.innerHTML = "";


    const maiorValor =
        Math.max(
            ...dadosPagamentos.map(
                item => item.valor
            )
        );


    let metodoMaisUtilizado =
        dadosPagamentos[0];


    dadosPagamentos.forEach(item => {

        if (
            item.quantidade >
            metodoMaisUtilizado.quantidade
        ) {

            metodoMaisUtilizado = item;

        }


        /* COLUNA */

        const coluna =
            document.createElement("div");

        coluna.className =
            "payment-column";


        const barra =
            document.createElement("div");

        barra.className =
            "payment-bar";


        const altura =
            (item.valor / maiorValor) * 100;


        barra.style.height =
            `${altura}%`;


        barra.title =
            `${item.metodo}: ${formatarMoeda(item.valor)} • ${item.quantidade} pagamentos`;


        const label =
            document.createElement("span");

        label.className =
            "payment-label";

        label.textContent =
            item.metodo;


        coluna.appendChild(barra);

        coluna.appendChild(label);

        container.appendChild(coluna);


        /* RESUMO */

        const resumoItem =
            document.createElement("div");

        resumoItem.className =
            "payment-summary-item";


        resumoItem.innerHTML = `
            <strong>${formatarMoeda(item.valor)}</strong>
            <span>${item.quantidade} pagamentos</span>
        `;


        resumo.appendChild(resumoItem);

    });


    document.getElementById(
        "metodoMaisUtilizado"
    ).textContent =
        `${metodoMaisUtilizado.metodo} (${metodoMaisUtilizado.quantidade})`;

}


/* =====================================================
   PRODUTOS MAIS VENDIDOS
   ===================================================== */

function atualizarProdutos() {

    const container =
        document.getElementById(
            "productsChart"
        );


    container.innerHTML = "";


    if (
        !produtosMaisVendidos ||
        produtosMaisVendidos.length === 0
    ) {

        container.innerHTML =
            "<p>Nenhum produto vendido no período.</p>";

        return;

    }


    const maiorQuantidade =
        Math.max(
            ...produtosMaisVendidos.map(
                produto => produto.quantidade
            )
        );


    produtosMaisVendidos.forEach(produto => {

        const linha =
            document.createElement("div");

        linha.className =
            "product-row";


        const nome =
            document.createElement("span");

        nome.className =
            "product-name";

        nome.textContent =
            produto.nome;


        const barraContainer =
            document.createElement("div");

        barraContainer.className =
            "product-bar-container";


        const barra =
            document.createElement("div");

        barra.className =
            "product-bar";


        barra.style.width =
            `${(produto.quantidade / maiorQuantidade) * 100}%`;


        const quantidade =
            document.createElement("span");

        quantidade.className =
            "product-quantity";

        quantidade.textContent =
            produto.quantidade;


        barraContainer.appendChild(
            barra
        );


        linha.appendChild(nome);

        linha.appendChild(
            barraContainer
        );

        linha.appendChild(
            quantidade
        );


        container.appendChild(linha);

    });

}


/* =====================================================
   ATUALIZAR DASHBOARD
   ===================================================== */

async function atualizarDashboard() {

    /*
    FUTURO BACKEND:

    const periodo =
        document.getElementById(
            "periodoDashboard"
        ).value;


    const resposta =
        await fetch(
            `/api/dashboard?periodo=${periodo}`
        );


    const dados =
        await resposta.json();


    document.getElementById(
        "cardFaturamento"
    ).textContent =
        formatarMoeda(dados.faturamento);


    document.getElementById(
        "cardCustos"
    ).textContent =
        formatarMoeda(dados.custos);


    document.getElementById(
        "cardLucro"
    ).textContent =
        formatarMoeda(dados.lucro);


    dadosGraficos.semana =
        dados.graficos.semana;


    dadosGraficos.mes =
        dados.graficos.mes;


    dadosGraficos.ano =
        dados.graficos.ano;


    dadosPagamentos.length = 0;

    dados.pagamentos.forEach(item => {
        dadosPagamentos.push(item);
    });


    produtosMaisVendidos =
        dados.produtosMaisVendidos;


    atualizarGrafico(
        dadosGraficos.semana
    );

    atualizarPagamentos();

    atualizarProdutos();
    */


    /* Simulação temporária */

    const botaoAtivo =
        document.querySelector(
            ".chart-btn.active"
        );


    const periodo =
        botaoAtivo.dataset.chart;


    atualizarGrafico(
        dadosGraficos[periodo]
    );


    atualizarPagamentos();

    atualizarProdutos();

}


/* =====================================================
   BOTÃO ATUALIZAR
   ===================================================== */

document.getElementById(
    "btnAtualizar"
).addEventListener(
    "click",
    async function () {

        this.disabled = true;

        this.textContent =
            "ATUALIZANDO...";


        await atualizarDashboard();


        setTimeout(() => {

            this.disabled = false;

            this.textContent =
                "ATUALIZAR";

        }, 600);

    }
);


/* =====================================================
   FILTRAR
   ===================================================== */

document.getElementById(
    "btnFiltrar"
).addEventListener(
    "click",
    function () {

        const periodo =
            document.getElementById(
                "periodoDashboard"
            ).value;


        console.log(
            "Filtro selecionado:",
            periodo
        );


        atualizarDashboard();

    }
);


/* =====================================================
   RELATÓRIOS
   ===================================================== */

document.getElementById(
    "btnRelatorios"
).addEventListener(
    "click",
    function () {

        window.location.href =
            "relatorios.html";

    }
);


/* =====================================================
   INICIALIZAÇÃO
   ===================================================== */

atualizarDashboard();