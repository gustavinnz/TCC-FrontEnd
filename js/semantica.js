document.addEventListener("DOMContentLoaded", () => {

    const header = document.getElementById("header");
    const sidebar = document.getElementById("sidebar");
    const footer = document.getElementById("footer");

    if (header) {
        fetch("components/header.html")
            .then(response => response.text())
            .then(data => {
                header.innerHTML = data;
            });
    }

    if (sidebar) {
        fetch("components/sidebar.html")
            .then(response => response.text())
            .then(data => {
                sidebar.innerHTML = data;
                marcarPaginaAtual();
            });
    }

    if (footer) {
        fetch("components/footer.html")
            .then(response => response.text())
            .then(data => {
                footer.innerHTML = data;
            });
    }

});


function marcarPaginaAtual() {

    const paginaAtual = window.location.pathname.split("/").pop();

    const links = document.querySelectorAll(".menu-item");

    links.forEach(link => {

        const paginaLink = link.getAttribute("href");

        if (paginaLink === paginaAtual) {
            link.classList.add("active");
        }

    });

}