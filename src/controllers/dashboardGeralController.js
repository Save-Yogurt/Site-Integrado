var dashboardGeralModel = require("../models/dashboardGeralModel");


function cargasAlerta(req,res){
    var id_empresa = req.params.id_empresa;

    dashboardGeralModel.cargasAlerta(id_empresa)
        .then(resultado => res.json(resultado))

        .catch(erro => {
            console.log(erro);
             res.status(500).json(erro.sqlMessage);   
        });
}

function maiorTemperatura(req,res){
    var id_empresa = req.params.id_empresa;
    dashboardGeralModel.maiorTemperatura(id_empresa)
        .then(resultado => res.json(resultado))

        .catch(erro => {
            console.log(erro);
             res.status(500).json(erro.sqlMessage);   
        });
}

function menorTemperatura(req,res){
    var id_empresa = req.params.id_empresa;
    dashboardGeralModel.menorTemperatura(id_empresa)
        .then(resultado => res.json(resultado))

        .catch(erro => {
            console.log(erro);
             res.status(500).json(erro.sqlMessage);   
        });
}

function tabela(req,res){
    var id_empresa = req.params.id_empresa;
    console.log("=== CHEGOU NO CONTROLLER ===");
    console.log("ID Recebido:", req.params.id_empresa);

    dashboardGeralModel.tabela(id_empresa)

        .then(resultado => res.json(resultado))

        .catch(erro => {
            console.log(erro);
             res.status(500).json(erro.sqlMessage);   
        });
}

function pesquisar(req, res) {

    var id_empresa = req.params.id_empresa;
    var termo = req.params.termo;

    dashboardGeralModel.pesquisar(id_empresa, termo)

        .then(resultado => {
            res.json(resultado);
        })

        .catch(erro => {
            console.log(erro);
            res.status(500).json(erro.sqlMessage);
        });
}
module.exports = {
    cargasAlerta,
    maiorTemperatura,
    menorTemperatura,
    tabela,
    pesquisar
};