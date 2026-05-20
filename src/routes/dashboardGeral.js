var express = require("express");
var router = express.Router();

var dashboardGeralController = require("../controllers/dashboardGeralController");

router.get("/cargasAlerta/:id_empresa", function (req, res) {
    dashboardGeralController.cargasAlerta(req, res);
});

router.get("/maiorTemperatura/:id_empresa", function (req, res) {
    dashboardGeralController.maiorTemperatura(req, res);
});

router.get("/menorTemperatura/:id_empresa", function (req, res) {
    dashboardGeralController.menorTemperatura(req, res);
});

router.get("/tabela/:id_empresa", function (req, res) {
    dashboardGeralController.tabela(req, res);
});

router.get("/pesquisar/:id_empresa/:termo", function (req, res) {
    dashboardGeralController.pesquisar(req, res);
});



module.exports = router;