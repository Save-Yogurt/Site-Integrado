var cadastroCargaModel = require("../models/cadastroCargaModel");

function cadastrarCarga(req, res) {
    var codigoCarga = req.body.codigoCargaServer;
    var codigo_lote     = req.body.id_LoteServer;
    var id_sensor   = req.body.id_sensorServer;
    var produto     = req.body.produtoServer;
    var qtd_caixa   = req.body.qtd_caixaServer;

    cadastroCargaModel.cadastrarCarga(codigoCarga, codigo_lote, id_sensor, produto, qtd_caixa)
        .then(function(resultado) {
            res.json(resultado);
        })
        .catch(function(erro) {
            console.log("\nErro ao cadastrar carga:", erro.sqlMessage);
            res.status(500).json(erro.sqlMessage);
        });
}

function verificarQuantidadeCaixas(req, res) {
    var codigo_lote = req.params.codigo_lote;
    cadastroCargaModel.verificarQuantidadeCaixas(codigo_lote)
        .then(function(resultado) {
            if (resultado.length > 0) {
                res.status(200).json(resultado);
            } else {
                res.status(404).send("Nenhum lote encontrado com esse código.");
            }
        })
        .catch(function(erro) {
            console.log("\nErro ao verificar quantidade de caixas: ", erro.sqlMessage);
            res.status(500).json(erro.sqlMessage);
        });
}

function listarLotes(req, res) {
    cadastroCargaModel.listarLotes()
        .then(function(resultado) {
            res.json(resultado);
        })
        .catch(function(erro) {
            res.status(500).json(erro.sqlMessage);
        });
}

function listarSensoresDisponiveis(req, res) {
    cadastroCargaModel.listarSensoresDisponiveis()
        .then(function(resultado) {
            res.json(resultado);
        })
        .catch(function(erro) {
            res.status(500).json(erro.sqlMessage);
        });
}
// exporta as funcoes
module.exports = {
    cadastrarCarga,
    listarLotes,
    listarSensoresDisponiveis,
    verificarQuantidadeCaixas
};