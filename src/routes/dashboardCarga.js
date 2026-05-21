var express = require("express");
var router = express.Router();
var cargaController = require("../controllers/dashCargaController");

router.get("/listar-cargas", function (req, res) {
    cargaController.listarCargas(req, res);
});

router.get("/kpis/:idCarga", function (req, res) {
    cargaController.obterKpis(req, res);
});

router.get("/grafico/:idCarga", function (req, res) {
    cargaController.obterDadosGrafico(req, res);
});

router.get("/desvios/:idCarga", function (req, res) {
    cargaController.obterTabelaDesvios(req, res);
});

router.get("/tempo-real/:idCarga", function (req, res) {
    cargaController.obterDadoTempoReal(req, res);
});

router.post("/capturar", function (req, res) {
    cargaController.processarLeitura(req, res);
});

module.exports = router;