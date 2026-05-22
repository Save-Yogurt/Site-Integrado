var statusCargaModel = require("../models/statusCargaModel");

function atualizar(req, res) {
    var codigoCarga = req.body.codigoCargaServer;
    var novaLocalizacao = req.body.novaLocalizacaoServer;
    var statusCarga = req.body.statusServer;

    if (codigoCarga == undefined || codigoCarga == "") {
        return res.status(400).send("O código da carga está undefined!");
    }

    if (novaLocalizacao == undefined || novaLocalizacao == "") {
        return res.status(400).send("A nova localização está undefined!");
    }

    if (statusCarga == undefined || statusCarga == "") {
        return res.status(400).send("O status da carga está undefined!");
    }

    statusCargaModel.atualizar(codigoCarga, novaLocalizacao, statusCarga)
        .then(function (resultadoAtualizar) {

            console.log("Resultado da atualização:", resultadoAtualizar);

            if (resultadoAtualizar.affectedRows > 0) {
                res.json({
                    mensagem: "Status da carga atualizado com sucesso!",
                    codigoCarga: codigoCarga,
                    novaLocalizacao: novaLocalizacao,
                    statusCarga: statusCarga
                });
            } else {
                res.status(404).send("Nenhuma carga encontrada com esse código.");
            }

        })
        .catch(function (erro) {
            console.log(erro);
            console.log("\nHouve um erro ao atualizar o status da carga! Erro: ", erro.sqlMessage);
            res.status(500).json(erro.sqlMessage);
        });
}

module.exports = {
    atualizar
};