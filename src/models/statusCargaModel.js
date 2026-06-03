var database = require("../database/config");

function atualizar(codigoCarga, novaLocalizacao, statusCarga) {
    console.log(
        "ACESSEI O STATUS CARGA MODEL \n",
        "function atualizar(): ",
        codigoCarga,
        novaLocalizacao,
        statusCarga
    );

    var instrucaoSql = "";

    if (statusCarga == "Entregue") {
        instrucaoSql = `
            UPDATE entrega e
            JOIN carga c 
                ON e.fk_codigo_carga = c.codigo_Carga
            LEFT JOIN monitoramento_sensor ms
                ON ms.fk_carga = c.id_carga
                AND ms.dt_fim IS NULL
            LEFT JOIN sensor s
                ON s.id_sensor = ms.fk_sensor
            SET 
                e.ultima_loc = '${novaLocalizacao}',
                c.status_carga = '${statusCarga}',
                ms.dt_fim = NOW(),
                s.status_sensor = 'Disponível'
            WHERE c.codigo_Carga = '${codigoCarga}';
        `;
    } else {
        instrucaoSql = `
            UPDATE entrega e
            JOIN carga c 
                ON e.fk_codigo_carga = c.codigo_Carga
            SET 
                e.ultima_loc = '${novaLocalizacao}',
                c.status_carga = '${statusCarga}'
            WHERE c.codigo_Carga = '${codigoCarga}';
        `;
    }

    console.log("Executando a instrução SQL: \n" + instrucaoSql);

    return database.executar(instrucaoSql);
}

module.exports = {
    atualizar
};