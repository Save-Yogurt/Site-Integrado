var cadastroCargaModel = require("../models/cadastroCargaModel");

function cadastrarCarga(req, res) {
    var codigoCarga = req.body.codigoCargaServer;
    var id_lote     = req.body.id_LoteServer;
    var id_sensor   = req.body.id_sensorServer;
    var produto     = req.body.produtoServer;
    var qtd_caixa   = req.body.qtd_caixaServer;

    cadastroCargaModel.cadastrarCarga(codigoCarga, id_lote, id_sensor, produto, qtd_caixa)
        .then(function(resultado) {
            res.json(resultado);
        })
        .catch(function(erro) {
            console.log("\nErro ao cadastrar carga:", erro.sqlMessage);
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

module.exports = {
    cadastrarCarga,
    listarLotes,
    listarSensoresDisponiveis
};