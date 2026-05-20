var database = require("../database/config");

function cargasAlerta(fk_empresa) {
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
    JOIN carga c ON a.fk_carga = c.id_carga
    JOIN lote l ON c.fk_lote = l.id_lote
    WHERE a.descricao = 'Critico'
    AND l.fk_empresa = ${fk_empresa};
    `;

    return database.executar(instrucaoSql);
}

function maiorTemperatura(fk_empresa) {
    console.log("ACESSEI graficosModel - Kpi2");

    var instrucaoSql = `
    select
    max(registro.temperatura) as maiortemp,
    carga.codigo_carga
    from registro
    join sensor on registro.fk_sensor = sensor.id_sensor
    join monitoramento_sensor ms on sensor.id_sensor = ms.fk_sensor
    join carga on ms.fk_carga = carga.id_carga
    join lote on carga.fk_lote = lote.id_lote 
    where sensor.fk_empresa = ${fk_empresa}
  and lote.fk_empresa =${fk_empresa}
    group by carga.codigo_carga, sensor.codigo_sensor
    order by maiortemp desc
    limit 1;
    `;

    return database.executar(instrucaoSql);
}

function menorTemperatura(fk_empresa) {
    console.log("ACESSEI graficosModel - Kpi3");

    var instrucaoSql = `
    select
    min(registro.temperatura) as menortemp,
    carga.codigo_carga
    from registro
    join sensor on registro.fk_sensor = sensor.id_sensor
    join monitoramento_sensor ms on sensor.id_sensor = ms.fk_sensor
    join carga on ms.fk_carga = carga.id_carga
    join lote on carga.fk_lote = lote.id_lote 
    where sensor.fk_empresa = ${fk_empresa}
    and lote.fk_empresa =${fk_empresa}
    group by carga.codigo_carga, sensor.codigo_sensor
    order by menortemp desc
    limit 1;
    `;

    return database.executar(instrucaoSql);
}

function tabela (id_empresa){
    console.log("ACESSEI graficosModel - tabela");

    var instrucaoSql = `
    select l.codigo_lote,
		e.veiculo_placa,
        e.tipo_veiculo,
        c.status_carga,
        count(id_alerta) as total_alertas,
        c.codigo_Carga,
        e.destino,
        e.ultima_loc
        from lote l
        join carga c on l.id_lote = c.fk_lote
        join entrega e on c.fk_entrega = e.id_entrega
        join monitoramento_sensor ms on c.id_carga = ms.fk_carga
        join sensor s on ms.fk_sensor = s.id_sensor
        join registro r on s.id_sensor = r.fk_sensor
        join alerta a on r.id_registro = a.fk_registro
        where l.fk_empresa = ${id_empresa}
        group by l.codigo_lote, 
         e.veiculo_placa, 
         e.tipo_veiculo, 
         c.status_carga, 
         c.codigo_Carga, 
         e.destino, 
         e.ultima_loc; 
        
    `;

    return database.executar(instrucaoSql);
}
function pesquisar(id_empresa, termo) {

    console.log("ACESSEI MODEL pesquisar");

    var instrucaoSql = `
    
    select 
        l.codigo_lote,
        e.veiculo_placa,
        e.tipo_veiculo,
        c.status_carga,
        count(a.id_alerta) as total_alertas,
        c.codigo_Carga,
        e.destino,
        e.ultima_loc

    from lote l

    join carga c on l.id_lote = c.fk_lote
    join entrega e on c.fk_entrega = e.id_entrega
    join monitoramento_sensor ms on c.id_carga = ms.fk_carga
    join sensor s on ms.fk_sensor = s.id_sensor
    join registro r on s.id_sensor = r.fk_sensor
    join alerta a on r.id_registro = a.fk_registro

    where l.fk_empresa = ${id_empresa}
    and (
        l.codigo_lote like '%${termo}%' or c.codigo_Carga like '%${termo}%'
    )

    group by 
        l.codigo_lote,
        e.veiculo_placa,
        e.tipo_veiculo,
        c.status_carga,
        c.codigo_Carga,
        e.destino,
        e.ultima_loc;
    `;

    return database.executar(instrucaoSql);
}

module.exports = {
    cargasAlerta,
    maiorTemperatura,
    menorTemperatura,
    tabela,
    pesquisar
};