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
const palavrasIgnoradas = [
    "de", "da", "do", "das", "dos",
    "para", "por", "com", "sem",
    "e", "ou", "a", "o", "as", "os"
];
function palavraCorresponde(buscaPalavra, chavePalavra) {
    if (!buscaPalavra || !chavePalavra) return false;

    // correspondência exata
    if (buscaPalavra === chavePalavra) return true;

    // plural simples (adiciona/remove 's')
    if (buscaPalavra + "s" === chavePalavra) return true;
    if (buscaPalavra === chavePalavra + "s") return true;

    return false;
}

    function calcularPontuacao(busca, pagina) {
    if (!pagina || !pagina.nome) return 0;

    const nomeNormalizado = normalizar(pagina.nome);
    const palavrasPagina = (pagina.palavrasChave || []).map(normalizar);
    const palavrasDigitadas = busca
    .split(" ")
    .filter(palavra => !palavrasIgnoradas.includes(palavra));
if (palavrasDigitadas.length === 0) return 0;


    // 🔥 PRIORIDADE 1 — Nome exatamente igual
    if (nomeNormalizado === busca) {
        return 1000;
    }

    // 🔥 PRIORIDADE 2 — Frase completa nas palavras-chave
    if (palavrasPagina.includes(busca)) {
        return 800;
    }

    // 🔥 PRIORIDADE 3 — Todas as palavras devem existir
const todasPresentes = palavrasDigitadas.every(palavraBusca => {
    // verifica no nome da página
    const noNome = nomeNormalizado.split(" ").some(p => palavraCorresponde(palavraBusca, p));
    // verifica nas palavras-chave
    const naChave = palavrasPagina.some(chave =>
        chave.split(" ").some(p => palavraCorresponde(palavraBusca, p))
    );
    return noNome || naChave;
});




if (!todasPresentes) {
    return 0; // 🚨 BLOQUEIA A PÁGINA
}

// se todas presentes, calcula pontuação
const palavrasNome = nomeNormalizado.split(" ").length;
const diferenca = palavrasNome - palavrasDigitadas.length;

return 500 - diferenca;
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

        resultados.sort((a, b) => {
    if (b.pontuacao !== a.pontuacao) {
        return b.pontuacao - a.pontuacao; // maior pontuação primeiro
    }
    return a.pagina.nome.localeCompare(b.pagina.nome); // empate → ordem alfabética
});

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
else {
    div.textContent = nomeOriginal;
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

    let resultados = [];

    paginas.forEach(pagina => {
        const pontuacao = calcularPontuacao(busca, pagina);
        if (pontuacao > 0) {
            resultados.push({ pagina, pontuacao });
        }
    });

    if (resultados.length === 0) return;

    // mesma ordenação do dropdown
    resultados.sort((a, b) => {
        if (b.pontuacao !== a.pontuacao) {
            return b.pontuacao - a.pontuacao;
        }
        return a.pagina.nome.localeCompare(b.pagina.nome);
    });

    // abre o primeiro da lista ordenada
    window.location.href = resultados[0].pagina.url;
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
