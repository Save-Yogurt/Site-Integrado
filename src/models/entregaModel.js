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

    const instrucao = `
        SELECT
            c.id_carga,
            l.codigo_lote,
            s.codigo_sensor,
            c.temp_min,
            c.temp_max
        FROM carga c
        JOIN lote l
            ON c.fk_lote = l.id_lote
        LEFT JOIN monitoramento_sensor ms
            ON ms.fk_carga = c.id_carga
        LEFT JOIN sensor s
            ON s.id_sensor = ms.fk_sensor
        WHERE c.fk_entrega IS NULL;
    `;

    return database.executar(instrucao);
}

module.exports = {
    cadastrarEntrega,
    vincularCarga,
    listarCargasSemEntrega
};