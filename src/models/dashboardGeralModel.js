var database = require("../database/config");

function cargasAlerta() {
    console.log("ACESSEI graficosModel - Kpi1");

    var instrucaoSql = `
    SELECT 
    COUNT(DISTINCT c.id_carga) AS qtd_cargas_criticas,
    
    GROUP_CONCAT(
        DISTINCT c.codigo_Carga 
        ORDER BY c.codigo_Carga 
        SEPARATOR ', '
    ) AS identificadores_cargas

    FROM alerta a
    JOIN carga c 
    ON a.fk_carga = c.id_carga

    WHERE a.descricao = 'Critico';
    `;

    return database.executar(instrucaoSql);
}
function maiorTemperatura() {
    console.log("ACESSEI graficosModel - Kpi2");

    var instrucaoSql = `
    select
    max(temperatura) as maiorTemp,
    carga.codigo_Carga
    from registro
        join sensor on registro.fk_sensor = sensor.id_sensor
        join monitoramento_sensor ms on sensor.id_sensor = ms.fk_sensor
    join carga on ms.fk_carga = carga.id_carga
    group by carga.codigo_Carga
    order by maiorTemp desc
    limit 1;
    `;

    return database.executar(instrucaoSql);
}
function menorTemperatura() {
    console.log("ACESSEI graficosModel - Kpi3");

    var instrucaoSql = `
    select
    max(temperatura) as maiorTemp,
    carga.codigo_Carga
    from registro
        join sensor on registro.fk_sensor = sensor.id_sensor
        join monitoramento_sensor ms on sensor.id_sensor = ms.fk_sensor
    join carga on ms.fk_carga = carga.id_carga
    group by carga.codigo_Carga
    order by maiorTemp asc
    limit 1;
    `;

    return database.executar(instrucaoSql);
}

function tabela (req,res){
    console.log("ACESSEI graficosModel - tabela");

    var instrucaoSql = `
    select
    max(temperatura) as maiorTemp,
    carga.codigo_Carga
    from registro
        join sensor on registro.fk_sensor = sensor.id_sensor
        join monitoramento_sensor ms on sensor.id_sensor = ms.fk_sensor
    join carga on ms.fk_carga = carga.id_carga
    group by carga.codigo_Carga
    order by maiorTemp asc
    limit 1;
    `;

    return database.executar(instrucaoSql);
}


module.exports = {
    cargasAlerta,
    maiorTemperatura,
    menorTemperatura
};