var entregaModel = require("../models/entregaModel");

function cadastrar(req, res) {
    var placa = req.body.placa;
    var destino = req.body.destino;
    var tipoVeiculo = req.body.tipoVeiculo;
    var cargas = req.body.cargas;

    if (placa == undefined || destino == undefined || tipoVeiculo == undefined || cargas == undefined) {
        return res.status(400).send("Dados da entrega estão undefined!");
    }

    entregaModel.cadastrarEntrega(tipoVeiculo, placa, destino, cargas)
    .then(function (resultado) {
        
        return entregaModel.vincularCarga(cargas);

    }).then(function (resultadoFinal) {
        
        res.json({ mensagem: "Entrega cadastrada com sucesso!" });

    }).catch(function (erro) {
        console.log(erro);
        res.status(500).json(erro.sqlMessage);
    });
}

function listarSemEntrega(req, res) {

    entregaModel.listarCargasSemEntrega()
    .then(function (resultado) {

        if (resultado.length > 0) {

            res.status(200).json(resultado);

        } else {

            res.status(204).send("Nenhuma carga encontrada!");
        }

    }).catch(function (erro) {

        console.log(erro);

        console.log(
            "Erro ao listar cargas sem entrega",
            erro.sqlMessage
        );

        res.status(500).json(erro.sqlMessage);
    });
}

module.exports = {
    cadastrar,
    listarSemEntrega
};