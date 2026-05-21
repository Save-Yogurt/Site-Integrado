var database = require("../database/config");

function cadastrarLote(codigo, dataProducao, dataValidade, quantidade_caixas, id_empresa){
    var instrucaoSQL = `
    INSERT INTO lote (codigo_lote, dt_fabricacao, dt_validade,qtd_caixas, fk_empresa) VALUES
    ('${codigo}', '${dataProducao}', '${dataValidade}', '${quantidade_caixas}', '${id_empresa}');`
    
    return database.executar(instrucaoSQL)
}

module.exports = {
    cadastrarLote
};