var database = require("../database/config");

function atualizar(codigoCarga, novaLocalizacao, statusCarga) {
    console.log(
        "ACESSEI O STATUS CARGA MODEL \n",
        "function atualizar(): ",
        codigoCarga,
        novaLocalizacao,
        statusCarga
    );

    var instrucaoSql = `
        UPDATE entrega e
        JOIN carga c 
            ON e.fk_codigo_carga = c.codigo_Carga
        SET 
            e.ultima_loc = '${novaLocalizacao}',
            c.status_carga = '${statusCarga}'
        WHERE c.codigo_Carga = '${codigoCarga}';
    `;

    console.log("Executando a instrução SQL: \n" + instrucaoSql);

    return database.executar(instrucaoSql);
}

module.exports = {
    atualizar
};