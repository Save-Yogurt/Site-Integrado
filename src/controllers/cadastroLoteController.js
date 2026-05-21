var cadastroLoteModel = require("../models/cadastroLoteModel");

function cadastrarLote(req, res) {
    // Crie uma variável que vá recuperar os valores do arquivo cadastro.html
    var codigo = req.body.codigoServer;
    var dataProducao = req.body.dataProducaoServer;
    var dataValidade = req.body.dataValidadeServer;
    var quantidade_caixas = req.body.quantidade_caixasServer;
    var id_empresa = req.body.id_empresaServer;

        cadastroLoteModel.cadastrarLote(codigo, dataProducao, dataValidade, quantidade_caixas, id_empresa)
            .then(
                function (resultado) {
                    res.json(resultado);
                }
            ).catch(
                function (erro) {
                    console.log(erro);
                    console.log(
                        "\nHouve um erro ao realizar o cadastro! Erro: ",
                        erro.sqlMessage
                    );
                    res.status(500).json(erro.sqlMessage);
                }
            );
    }

module.exports = {
    cadastrarLote
};