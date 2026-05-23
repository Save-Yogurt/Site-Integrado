var database = require("../database/config");
// cadastrar carga 
function cadastrarCarga(codigoCarga, id_lote, id_sensor, produto, qtd_caixas) {
    var sqlCarga = `
        INSERT INTO carga (codigo_Carga, produto, qtd_caixas, status_carga, fk_lote)
        VALUES ('${codigoCarga}', '${produto}', '${qtd_caixas}', 'Armazenada', ${id_lote});
    `;

    return database.executar(sqlCarga)
        .then(function(resultadoCarga) {
            var id_carga_nova = resultadoCarga.insertId; 

          
            var sqlMonit = `
                INSERT INTO monitoramento_sensor (fk_sensor, fk_carga, dt_inicio)
                VALUES (${id_sensor}, ${id_carga_nova}, NOW());
            `;

            
            var sqlSensor = `
                UPDATE sensor SET status_sensor = 'Em Uso' WHERE id_sensor = ${id_sensor};
            `;

            return database.executar(sqlMonit)
                .then(function() {
                    return database.executar(sqlSensor);
                });
        });
}
// lista os lotes por meio do select 
function listarLotes() {
    var sql = `SELECT id_lote, codigo_lote FROM lote;`;
    return database.executar(sql);
}
// lista os sensore por meio de select
function listarSensoresDisponiveis() {
    var sql = `SELECT id_sensor, codigo_sensor FROM sensor WHERE status_sensor = 'Disponível';`;
    return database.executar(sql);
}

module.exports = {
    cadastrarCarga,
    listarLotes,
    listarSensoresDisponiveis
};