var database = require("../database/config");
// cadastrar carga 
function cadastrarCarga(codigoCarga, codigo_lote, id_sensor, produto, qtd_caixas) {
    var sqlCarga = `
        INSERT INTO carga (codigo_Carga, produto, qtd_caixas, status_carga, fk_lote)
        VALUES ('${codigoCarga}', '${produto}', '${qtd_caixas}', 'Armazenada', ${codigo_lote});
    `;

    return database.executar(sqlCarga)
        .then(function (resultadoCarga) {
            var id_carga_nova = resultadoCarga.insertId;


            var sqlMonit = `
                INSERT INTO monitoramento_sensor (fk_sensor, fk_carga, dt_inicio)
                VALUES (${id_sensor}, ${id_carga_nova}, NOW());
            `;


            var sqlSensor = `
                UPDATE sensor SET status_sensor = 'Em Uso' WHERE id_sensor = ${id_sensor};
            `;

            return database.executar(sqlMonit)
                .then(function () {
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

function verificarQuantidadeCaixas(codigo_lote){

    var sql = `SELECT 
        l.codigo_lote,
        l.qtd_caixas AS caixas_limite_do_lote,
        IFNULL(total_lote.soma_total_das_cargas, 0) AS soma_total_das_cargas
    FROM lote l
    LEFT JOIN (
        SELECT fk_lote, SUM(qtd_caixas) AS soma_total_das_cargas
        FROM carga
        GROUP BY fk_lote
    ) total_lote ON l.id_lote = total_lote.fk_lote
    WHERE l.id_lote = ${codigo_lote} OR l.codigo_lote = '${codigo_lote}';`;

    return database.executar(sql);
}


module.exports = {
    cadastrarCarga,
    listarLotes,
    listarSensoresDisponiveis,
    verificarQuantidadeCaixas
};