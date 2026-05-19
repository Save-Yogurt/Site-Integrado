const entregaModel = require("../models/entregaModel");

async function cadastrar(req, res) {

    const {
        placa,
        destino,
        tipoVeiculo,
        cargas
    } = req.body;

    try {

        const resultadoEntrega =
            await entregaModel.cadastrarEntrega(
                tipoVeiculo,
                placa,
                destino
            );

        const idEntrega = resultadoEntrega.insertId;

        for (let i = 0; i < cargas.length; i++) {

            await entregaModel.vincularCarga(
                idEntrega,
                cargas[i]
            );
        }

        res.status(200).json({
            mensagem: "Entrega cadastrada com sucesso"
        });

    } catch (erro) {

        console.log(erro);

        res.status(500).json(erro.sqlMessage);
    }
}

function listarSemEntrega(req, res) {

    entregaModel.listarCargasSemEntrega()
    .then((resultado) => {

        res.status(200).json(resultado);

    }).catch((erro) => {

        console.log(erro);

        res.status(500).json(erro.sqlMessage);
    });
}

module.exports = {
    cadastrar,
    listarSemEntrega
};