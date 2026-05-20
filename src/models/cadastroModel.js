var database = require("../database/config")

function cadastrar(nome, email, senha, fkEmpresa, cpf) {
    console.log("ACESSEI O CADASTRO MODEL \n \n\t\t >> Se aqui der erro de 'Error: connect ECONNREFUSED',\n \t\t >> verifique suas credenciais de acesso ao banco\n \t\t >> e se o servidor de seu BD está rodando corretamente. \n\n function cadastrar():", nome, email, senha, fkEmpresa);

    // Insira exatamente a query do banco aqui, lembrando da nomenclatura exata nos valores
    //  e na ordem de inserção dos dados.
    var instrucaoSql = `
        INSERT INTO usuario (nome, email, senha, fk_empresa, cpf) VALUES ('${nome}', '${email}', '${senha}', '${fkEmpresa}', '${cpf}')`;

    console.log("Executando a instrução SQL: \n" + instrucaoSql);
    return database.executar(instrucaoSql);
}

function listar() {
    var instrucaoSql = `SELECT id_empresa, razao_social, cnpj, token FROM empresa`;

    return database.executar(instrucaoSql);
}

module.exports = {
    cadastrar,
    listar
};