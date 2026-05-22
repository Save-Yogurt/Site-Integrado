var database = require("../database/config");

function listarCargas() {
    var instrucaoSql = `SELECT id_carga, codigo_Carga FROM carga;`;
    console.log("Executando a instrução SQL: \n" + instrucaoSql);
    return database.executar(instrucaoSql);
}

function obterKpis(idCarga) {
    var instrucaoSql = `
        SELECT 
            c.codigo_Carga,
            l.codigo_lote,
            s.codigo_sensor,
            DATE_FORMAT(ms.dt_inicio, '%d/%m/%Y') AS dt_inicio_formatada,
            (SELECT r.temperatura FROM registro r 
             WHERE r.fk_sensor = s.id_sensor 
             ORDER BY r.dt_registro DESC LIMIT 1) AS ultima_temperatura
        FROM carga c
        JOIN lote l ON c.fk_lote = l.id_lote
        LEFT JOIN monitoramento_sensor ms ON ms.fk_carga = c.id_carga AND ms.dt_fim IS NULL
        LEFT JOIN sensor s ON ms.fk_sensor = s.id_sensor
        WHERE c.id_carga = ${idCarga};
    `;
    console.log("Executando a instrução SQL: \n" + instrucaoSql);
    return database.executar(instrucaoSql);
}

function obterDadosGrafico(idCarga) {
    var instrucaoSql = `
        SELECT 
            DATE_FORMAT(r.dt_registro, '%H:%i') AS horario,
            r.temperatura
        FROM registro r
        JOIN monitoramento_sensor ms ON r.fk_sensor = ms.fk_sensor
        WHERE ms.fk_carga = ${idCarga}
          AND r.dt_registro >= ms.dt_inicio
          AND (ms.dt_fim IS NULL OR r.dt_registro <= ms.dt_fim)
        ORDER BY r.dt_registro DESC
        LIMIT 12;
    `;
    console.log("Executando a instrução SQL: \n" + instrucaoSql);
    return database.executar(instrucaoSql);
}

function obterTabelaDesvios(idCarga) {
    var instrucaoSql = `
        SELECT 
            DATE_FORMAT(a.dt_alerta, '%d/%m %H:%i') AS data_formatada,
            r.temperatura,
            a.descricao
        FROM alerta a
        JOIN registro r ON a.fk_registro = r.id_registro
        WHERE a.fk_carga = ${idCarga}
        ORDER BY a.dt_alerta DESC;
    `;
    console.log("Executando a instrução SQL: \n" + instrucaoSql);
    return database.executar(instrucaoSql);
}

function obterDadoTempoReal(idCarga) {
    var instrucaoSql = `
        SELECT 
            r.temperatura, 
            DATE_FORMAT(r.dt_registro, '%H:%i:%s') AS horario 
        FROM registro r
        JOIN monitoramento_sensor ms ON r.fk_sensor = ms.fk_sensor
        WHERE ms.fk_carga = ${idCarga}
        ORDER BY r.dt_registro DESC 
        LIMIT 1;
    `;
    console.log("Executando a instrução SQL Tempo Real: \n" + instrucaoSql);
    return database.executar(instrucaoSql);
}

module.exports = {
    listarCargas,
    obterKpis,
    obterDadosGrafico,
    obterTabelaDesvios,
    obterDadoTempoReal,
};