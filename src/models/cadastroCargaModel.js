var database = require("../database/config");

function cadastrarCarga(codigoCarga, id_lote, id_sensor, produto, qtd_caixas) {
    // 1. Insere a carga
    var sqlCarga = `
        INSERT INTO carga (codigo_Carga, produto, qtd_caixas, status_carga, fk_lote)
        VALUES ('${codigoCarga}', '${produto}', '${qtd_caixas}', 'Armazenada', ${id_lote});
    `;

    return database.executar(sqlCarga)
        .then(function(resultadoCarga) {
            var id_carga_nova = resultadoCarga.insertId; // pega o ID gerado automaticamente

            // 2. Vincula o sensor à carga no monitoramento
            var sqlMonit = `
                INSERT INTO monitoramento_sensor (fk_sensor, fk_carga, dt_inicio)
                VALUES (${id_sensor}, ${id_carga_nova}, NOW());
            `;

            // 3. Atualiza o sensor para "Em Uso"
            var sqlSensor = `
                UPDATE sensor SET status_sensor = 'Em Uso' WHERE id_sensor = ${id_sensor};
            `;

            return database.executar(sqlMonit)
                .then(function() {
                    return database.executar(sqlSensor);
                });
        });
}

function listarLotes() {
    var sql = `SELECT id_lote, codigo_lote FROM lote;`;
    return database.executar(sql);
}

function listarSensoresDisponiveis() {
    var sql = `SELECT id_sensor, codigo_sensor FROM sensor WHERE status_sensor = 'Disponível';`;
    return database.executar(sql);
}

module.exports = {
    cadastrarCarga,
    listarLotes,
    listarSensoresDisponiveis
};