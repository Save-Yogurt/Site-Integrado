const database = require("../database/config");

function cadastrarEntrega(tipoVeiculo, placa, destino, codigoCarga) {
    const instrucao = `
        INSERT INTO entrega (tipo_veiculo, veiculo_placa, destino, fk_codigo_carga)
        VALUES ('${tipoVeiculo}', '${placa}', '${destino}', '${codigoCarga}');
    `;

    return database.executar(instrucao);
}

function vincularCarga(codigoCarga) {

  const instrucao = `
        UPDATE carga 
        SET status_carga = 'Em Transporte' 
        WHERE codigo_Carga = '${codigoCarga}';
    `;

    return database.executar(instrucao);
}



function listarCargasSemEntrega() {

    var instrucaoSql = `

       SELECT 
    c.id_carga, 
    c.codigo_Carga, 
    c.qtd_caixas
FROM carga c
LEFT JOIN entrega e ON c.codigo_Carga = e.fk_codigo_carga
WHERE e.id_entrega IS NULL;

    `;

    console.log("Executando SQL: \n" + instrucaoSql);

    return database.executar(instrucaoSql);
}

module.exports = {
    cadastrarEntrega,
    vincularCarga,
    listarCargasSemEntrega
};