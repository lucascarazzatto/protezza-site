document.addEventListener("DOMContentLoaded", function () {

    const input = document.getElementById("campoBusca");
    const botao = document.getElementById("btnBusca");
    const resultadosDiv = document.getElementById("resultadosBusca");

    if (!input || !botao || !resultadosDiv) {
        console.error("Elementos da busca não encontrados.");
        return;
    }

    const paginas = [
        { nome: "Home", url: "index.html", palavrasChave: ["home", "inicio"] },
        { nome: "Produtos", url: "produtos.html", palavrasChave: ["produtos", "produto"] },
        { nome: "Contatos", url: "contatos.html", palavrasChave: ["contato", "contatos"] },
        { nome: "Localização", url: "localizacao.html", palavrasChave: ["localizacao", "localização"] },
        { nome: "Luvas", url: "luvas.html", palavrasChave: ["luva", "luvas"] },
        { nome: "Luvas Térmicas", url: "luvas-termicas.html", palavrasChave: ["luvas termicas", "luva termica"] },
        { nome: "Capacete Industrial", url: "capacete.html", palavrasChave: ["capacete", "industrial", "viseira"] }
    ];

    function normalizar(texto) {
        if (!texto) return "";
        return texto
            .toString()
            .toLowerCase()
            .trim()
            .normalize("NFD")
            .replace(/[\u0300-\u036f]/g, "")
            .replace(/\s+/g, " ");
    }

    function escaparRegex(texto) {
        return texto.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    }

    function calcularPontuacao(busca, pagina) {
        if (!pagina || !pagina.nome) return 0;

        const palavrasDigitadas = busca.split(" ");
        let pontuacao = 0;

        const nomeNormalizado = normalizar(pagina.nome);
        const palavrasPagina = (pagina.palavrasChave || []).map(normalizar);

        if (nomeNormalizado === busca) return 100;

        palavrasDigitadas.forEach(palavra => {
            palavrasPagina.forEach(chave => {
                if (chave === palavra) pontuacao += 5;
                else if (chave.startsWith(palavra)) pontuacao += 3;
                else if (chave.includes(palavra)) pontuacao += 1;
            });
        });

        return pontuacao;
    }

    function destacarTexto(texto, busca) {
        if (!busca) return texto;

        const buscaEscapada = escaparRegex(busca);
        const regex = new RegExp(`(${buscaEscapada})`, "gi");

        return texto.replace(regex, '<span class="highlight">$1</span>');
    }

    function mostrarResultados(busca) {

        resultadosDiv.innerHTML = "";
        resultadosDiv.style.display = "none";

        if (busca.length < 2) return;

        let resultados = [];

        paginas.forEach(pagina => {
            const pontuacao = calcularPontuacao(busca, pagina);
            if (pontuacao > 0) {
                resultados.push({ pagina, pontuacao });
            }
        });

        if (resultados.length === 0) return;

        resultados.sort((a, b) => b.pontuacao - a.pontuacao);

        resultadosDiv.style.display = "block";

        resultados.forEach(resultado => {
            const div = document.createElement("div");
            div.classList.add("resultado-item");

            const nomeOriginal = resultado.pagina.nome;
const nomeNormalizado = normalizar(nomeOriginal);
const indice = nomeNormalizado.indexOf(busca);

if (indice !== -1) {

    const antes = nomeOriginal.substring(0, indice);
    const digitado = nomeOriginal.substring(indice, indice + busca.length);
    const depois = nomeOriginal.substring(indice + busca.length);

    div.innerHTML = `
        ${antes}<span class="parte-digitada">${digitado}</span>${depois}
    `;
}

            div.addEventListener("click", function () {
                window.location.href = resultado.pagina.url;
            });

            resultadosDiv.appendChild(div);
        });
    }

    function realizarBusca() {
        const busca = normalizar(input.value);
        if (busca.length < 2) return;

        let melhorResultado = null;
        let maiorPontuacao = 0;

        paginas.forEach(pagina => {
            const pontuacao = calcularPontuacao(busca, pagina);
            if (pontuacao > maiorPontuacao) {
                maiorPontuacao = pontuacao;
                melhorResultado = pagina;
            }
        });

        if (melhorResultado) {
            window.location.href = melhorResultado.url;
        }
    }

    input.addEventListener("input", function () {
        try {
            mostrarResultados(normalizar(input.value));
        } catch (erro) {
            console.error("Erro na busca:", erro);
        }
    });

    botao.addEventListener("click", function () {
        try {
            realizarBusca();
        } catch (erro) {
            console.error("Erro ao realizar busca:", erro);
        }
    });

    input.addEventListener("keydown", function (event) {
        if (event.key === "Enter") {
            try {
                realizarBusca();
            } catch (erro) {
                console.error("Erro ao pressionar Enter:", erro);
            }
        }
    });

    document.addEventListener("click", function (e) {
        if (!e.target.closest(".barra-pesquisa")) {
            resultadosDiv.style.display = "none";
        }
    });

});
