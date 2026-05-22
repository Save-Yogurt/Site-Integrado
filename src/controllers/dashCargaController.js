var cargaModel = require("../models/dashCargaModel");

async function processarLeitura(req, res) {
    var { temperatura, idSensor, idCarga } = req.body;

    if (!temperatura || !idSensor || !idCarga) {
        console.log("ERRO: Dados incompletos no body.");
        return res.status(400).send("Dados incompletos");
    }

    try {
        // 2. Teste do registrarLeitura
        console.log("Tentando inserir leitura no banco...");
        const resultadoRegistro = await cargaModel.registrarLeitura(temperatura, idSensor);
        console.log("Resultado do insert de leitura:", resultadoRegistro);
        
        var idRegistro = resultadoRegistro.insertId;

        if (!idRegistro) {
            console.log("ERRO: O banco não retornou um ID de registro (Insert falhou silenciosamente).");
            return res.status(500).send("Falha ao salvar registro");
        }

        // 3. Teste do obterKpis
        console.log(`Buscando KPIs para carga ${idCarga}...`);
        const resultadoKpi = await cargaModel.obterKpis(idCarga);
        console.log("Resultado dos KPIs:", resultadoKpi);

        // ... resto da lógica de alerta ...
        res.status(200).send("Processamento finalizado");

    } catch (erro) {
        console.error("ERRO CRÍTICO NO BANCO:", erro);
        res.status(500).json(erro);
    }
}

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
                    var kpi = resultado[0];
                    var temp = Number(kpi.ultima_temperatura);
                    
                    var textoStatus = "";
                    var icone = "";

                    // CRÍTICO (< 0 ou > 10)
                    if (temp < 0 || temp > 10) {
                        textoStatus = "Crítico";
                        icone = "fa-solid fa-circle-xmark";
                    } 
                    // ALERTA (0 a 2 OU 5 a 10)
                    else if ((temp >= 0 && temp < 2) || (temp > 5 && temp <= 10)) {
                        textoStatus = "Alerta";
                        icone = "fa-solid fa-triangle-exclamation";
                    } 
                    // EM CONFORMIDADE (2 a 5)
                    else {
                        textoStatus = "Em conformidade";
                        icone = "fa-solid fa-circle-check check-icon";
                    }

                    var kpiFormatada = {
                        statusTexto: textoStatus,
                        lote: kpi.codigo_lote,
                        sensor: kpi.codigo_sensor,
                        dataInicio: kpi.dt_inicio_formatada,
                        statusClasseIcone: icone
                    };

                    res.status(200).json(kpiFormatada);
                } else {
                    res.status(204).send("Nenhuma carga encontrada.");
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
                    dadosGrafico.labels.push(registro.horario); 
                    dadosGrafico.valores.push(Number(registro.temperatura));
                });

                dadosGrafico.labels.reverse();
                dadosGrafico.valores.reverse();

                

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

                resultado.forEach(row => {
                    tabelaDesvios.push({
                        data: row.data_formatada,
                        valor: row.temperatura,
                        status: row.descricao,
                        classeCor: row.descricao && row.descricao.includes("Crítico") ? "text-red" : "text-orange" 
                    });
                });

                res.status(200).json(tabelaDesvios);
            }).catch(function (erro) {
                console.log(erro);
                res.status(500).json(erro.sqlMessage);
            });
    }
}

function obterDadoTempoReal(req, res) {
    var idCarga = req.params.idCarga;

    console.log(`Recuperando dados em tempo real para a carga ID: ${idCarga}`);

    cargaModel.obterDadoTempoReal(idCarga).then(function (resultado) {
        if (resultado.length > 0) {
            res.status(200).json(resultado); 
        } else {
            console.log("Nenhum dado novo encontrado para o tempo real.");
            res.status(204).send("Nenhum resultado encontrado!");
        }
    }).catch(function (erro) {
        console.log(erro);
        console.log("Houve um erro ao buscar os dados em tempo real.", erro.sqlMessage);
        res.status(500).json(erro.sqlMessage);
    });
}

module.exports = {
    listarCargas,
    obterKpis,
    obterDadosGrafico,
    obterTabelaDesvios,
    obterDadoTempoReal,
    processarLeitura
};