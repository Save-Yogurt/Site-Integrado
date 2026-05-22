const database = require("../database/config");

function cadastrarEntrega(
    tipoVeiculo,
    placa,
    destino
) {

    const instrucao = `
        INSERT INTO entrega
        (tipo_veiculo, veiculo_placa, destino)
        VALUES
        ('${tipoVeiculo}', '${placa}', '${destino}');
    `;

    return database.executar(instrucao);
}

function vincularCarga(idEntrega, idCarga) {

    const instrucao = `
        UPDATE carga
        SET fk_entrega = ${idEntrega},
            status_carga = 'Em Transporte'
        WHERE id_carga = ${idCarga};
    `;

    return database.executar(instrucao);
}

function listarCargasSemEntrega() {

    var instrucaoSql = `

        SELECT
            id_carga,
            codigo_Carga
        FROM carga
        WHERE fk_entrega IS NULL;

    `;

    console.log("Executando SQL: \n" + instrucaoSql);

    return database.executar(instrucaoSql);
}

module.exports = {
    cadastrarEntrega,
    vincularCarga,
    listarCargasSemEntrega
};