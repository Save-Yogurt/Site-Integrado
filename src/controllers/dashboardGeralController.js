var dashboardGeralModel = require("../models/dashboardGeralModel");


function cargasAlerta(req,res){

    dashboardGeralModel.cargasAlerta()
        .then(resultado => res.json(resultado))

        .catch(erro => {
            console.log(erro);
             res.status(500).json(erro.sqlMessage);   
        });
}
function maiorTemperatura(req,res){

    dashboardGeralModel.maiorTemperatura()
        .then(resultado => res.json(resultado))

        .catch(erro => {
            console.log(erro);
             res.status(500).json(erro.sqlMessage);   
        });
}
function menorTemperatura(req,res){

    dashboardGeralModel.menorTemperatura()
        .then(resultado => res.json(resultado))

        .catch(erro => {
            console.log(erro);
             res.status(500).json(erro.sqlMessage);   
        });
}
function tabela(req,res){

    dashboardGeralModel.tabela()
        .then(resultado => res.json(resultado))

        .catch(erro => {
            console.log(erro);
             res.status(500).json(erro.sqlMessage);   
        });
}
module.exports = {
    cargasAlerta,
    maiorTemperatura,
    menorTemperatura,
    tabela
};