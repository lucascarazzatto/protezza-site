document.addEventListener("DOMContentLoaded", function () {

    fetch("footer.html")
        .then(resposta => resposta.text())
        .then(dados => {
            document.getElementById("footer").innerHTML = dados;
        })
        .catch(erro => {
            console.error("Erro ao carregar footer:", erro);
        });

});
