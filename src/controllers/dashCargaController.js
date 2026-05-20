var cargaModel = require("../models/dashCargaModel");

function listarCargas(req, res) {
    cargaModel.listarCargas()
        .then(function (resultado) {
            if (resultado.length > 0) {
                res.status(200).json(resultado);
            } else {
                res.status(204).send("Nenhuma carga encontrada.");
            }
        }).catch(function (erro) {
            console.log(erro);
            console.log("Houve um erro ao buscar as cargas. Erro: ", erro.sqlMessage);
            res.status(500).json(erro.sqlMessage);
        });
}

function obterKpis(req, res) {
    var idCarga = req.params.idCarga;

    if (idCarga == undefined) {
        res.status(400).send("O idCarga está indefinido!");
    } else {
        cargaModel.obterKpis(idCarga)
            .then(function (resultado) {
                if (resultado.length > 0) {
                    // Trata os dados da KPI caso queira formatar o ícone dinamicamente por aqui
                    var kpi = resultado[0];
                    
                    // Exemplo de lógica de ícone injetada diretamente no objeto antes de enviar ao front
                    kpi.statusClasseIcone = "fa-solid fa-circle-check check-icon";
                    kpi.statusCorIcone = "";
                    
                    if (kpi.status_carga.includes("Crítico") || kpi.status_carga === "Alerta") {
                        kpi.statusClasseIcone = "fa-solid fa-circle-xmark";
                        kpi.statusCorIcone = "#e74c3c";
                    }

                    res.status(200).json(kpi);
                } else {
                    res.status(404).send("Nenhuma KPI encontrada para esta carga.");
                }
            }).catch(function (erro) {
                console.log(erro);
                res.status(500).json(erro.sqlMessage);
            });
    }
}

function obterDadosGrafico(req, res) {
    var idCarga = req.params.idCarga;

    if (idCarga == undefined) {
        res.status(400).send("O idCarga está indefinido!");
    } else {
        cargaModel.obterDadosGrafico(idCarga)
            .then(function (resultado) {
                // Monta a estrutura de vetores/arrays separada que o Chart.js exige por padrão
                var dadosGrafico = {
                    labels: [],
                    valores: []
                };

                // Varre os registros do banco ordenados cronologicamente preenchendo os eixos
                resultado.forEach(registro => {
                    dadosGrafico.labels.push(registro.registro_hora);
                    dadosGrafico.valores.push(Number(registro.registro_temperatura));
                });

                res.status(200).json(dadosGrafico); 
            }).catch(function (erro) {
                console.log(erro);
                res.status(500).json(erro.sqlMessage);
            });
    }
}

function obterTabelaDesvios(req, res) {
    var idCarga = req.params.idCarga;

    if (idCarga == undefined) {
        res.status(400).send("O idCarga está indefinido!");
    } else {
        cargaModel.obterTabelaDesvios(idCarga)
            .then(function (resultado) {
                var tabelaDesvios = [];

                // AQUI ENTRA A SUA LÓGICA DE MÉTRICAS!
                // Varremos todas as linhas de registros vindas do banco e filtramos apenas as que são desvios
                resultado.forEach(row => {
                    if (row.desvio_status !== null) {
                        tabelaDesvios.push({
                            data: row.desvio_data,
                            valor: `${row.registro_temperatura}°C`,
                            status: row.desvio_status,       // Ex: "Alerta Alto", "Crítico Baixo"
                            classeCor: row.desvio_classe_cor // Ex: "text-orange", "text-red"
                        });
                    }
                });

                res.status(200).json(tabelaDesvios);
            }).catch(function (erro) {
                console.log(erro);
                res.status(500).json(erro.sqlMessage);
            });
    }
}

module.exports = {
    listarCargas,
    obterKpis,
    obterDadosGrafico,
    obterTabelaDesvios
};