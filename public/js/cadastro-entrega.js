let cargasSelecionadas = [];

window.onload = () => {
    listarCargas();
};

function listarCargas() {

    fetch("/entrega/listarSemEntrega")
    .then(res => res.json())
    .then(dados => {

        const tbody = document.querySelector("tbody");

        tbody.innerHTML = "";

        dados.forEach((carga) => {

            tbody.innerHTML += `
                <tr onclick="selecionarCarga(${carga.id_carga}, this)">
                    <td>${carga.id_carga}</td>
                    <td>${carga.codigo_lote}</td>
                    <td>${carga.codigo_sensor}</td>
                    <td>${carga.temp_min}°C</td>
                    <td>${carga.temp_max}°C</td>
                </tr>
            `;
        });

    })
    .catch((erro) => {
        console.log("Erro ao listar cargas:", erro);
    });
}

function selecionarCarga(idCarga, linha) {

    if (cargasSelecionadas.includes(idCarga)) {

        cargasSelecionadas =
            cargasSelecionadas.filter(id => id != idCarga);

        linha.style.backgroundColor = "";

    } else {

        cargasSelecionadas.push(idCarga);

        linha.style.backgroundColor = "#d1f5ff";
    }
}

function cadastrarEntrega() {

    const inputs = document.querySelectorAll("input");

    const placa = inputs[0].value;
    const destino = inputs[1].value;
    const tipoVeiculo = inputs[2].value;

    if (
        placa == "" ||
        destino == "" ||
        tipoVeiculo == ""
    ) {
        alert("Preencha todos os campos");
        return;
    }

    if (cargasSelecionadas.length == 0) {
        alert("Selecione ao menos uma carga");
        return;
    }

    fetch("/entrega/cadastrar", {

        method: "POST",

        headers: {
            "Content-Type": "application/json"
        },

        body: JSON.stringify({
            placa,
            destino,
            tipoVeiculo,
            cargas: cargasSelecionadas
        })

    })
    .then(res => res.json())
    .then(resposta => {

        alert(resposta.mensagem);

        window.location.reload();
    })
    .catch((erro) => {

        console.log("Erro ao cadastrar entrega:", erro);
    });
}