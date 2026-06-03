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

function tabela(id_empresa) {
    console.log("ACESSEI graficosModel - tabela");

    var instrucaoSql = `
   SELECT 
    l.codigo_lote,
    -- Case para a Placa do Veículo
    CASE 
        WHEN e.veiculo_placa IS NULL THEN 'Não saiu para entrega'
        ELSE e.veiculo_placa
    END AS veiculo_placa,
    
    -- Case para o Tipo de Veículo
    CASE 
        WHEN e.tipo_veiculo IS NULL THEN 'Não saiu para entrega'
        ELSE e.tipo_veiculo
    END AS tipo_veiculo,
    
    c.status_carga,
    COUNT(a.id_alerta) AS total_alertas,
    c.codigo_Carga,
    
    -- Case para o Destino
    CASE 
        WHEN e.destino IS NULL THEN 'Não saiu para entrega'
        ELSE e.destino
    END AS destino,
    
    -- Case para a Última Localização
    CASE 
        WHEN e.ultima_loc IS NULL THEN 'Não saiu para entrega'
        ELSE e.ultima_loc
    END AS ultima_loc
FROM lote l
JOIN carga c ON l.id_lote = c.fk_lote
LEFT JOIN entrega e ON c.codigo_Carga = e.fk_codigo_Carga
LEFT JOIN monitoramento_sensor ms ON c.id_carga = ms.fk_carga
LEFT JOIN sensor s ON ms.fk_sensor = s.id_sensor
LEFT JOIN registro r ON s.id_sensor = r.fk_sensor
LEFT JOIN alerta a ON r.id_registro = a.fk_registro
WHERE l.fk_empresa = ${id_empresa}
  AND (c.status_carga != 'Entregue' OR c.status_carga IS NULL)
GROUP BY 
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
function pesquisar(id_empresa, termo) {

    console.log("ACESSEI MODEL pesquisar");

    var instrucaoSql = `
    
    SELECT 
    l.codigo_lote,

    CASE 
        WHEN e.veiculo_placa IS NULL THEN 'Não saiu para entrega'
        ELSE e.veiculo_placa
    END AS veiculo_placa,
    
    CASE 
        WHEN e.tipo_veiculo IS NULL THEN 'Não saiu para entrega'
        ELSE e.tipo_veiculo
    END AS tipo_veiculo,
    
    c.status_carga,
    COUNT(a.id_alerta) AS total_alertas,
    c.codigo_Carga,

    CASE 
        WHEN e.destino IS NULL THEN 'Não saiu para entrega'
        ELSE e.destino
    END AS destino,

    CASE 
        WHEN e.ultima_loc IS NULL THEN 'Não saiu para entrega'
        ELSE e.ultima_loc
    END AS ultima_loc
FROM lote l
JOIN carga c ON l.id_lote = c.fk_lote
LEFT JOIN entrega e ON c.codigo_Carga = e.fk_codigo_Carga
LEFT JOIN monitoramento_sensor ms ON c.id_carga = ms.fk_carga
LEFT JOIN sensor s ON ms.fk_sensor = s.id_sensor
LEFT JOIN registro r ON s.id_sensor = r.fk_sensor
LEFT JOIN alerta a ON r.id_registro = a.fk_registro
WHERE l.fk_empresa = ${id_empresa}
  AND (c.status_carga != 'Entregue' OR c.status_carga IS NULL)
   AND (
        l.codigo_lote like '%${termo}%' or c.codigo_Carga like '%${termo}%'
    )
GROUP BY 
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