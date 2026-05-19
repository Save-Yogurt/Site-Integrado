var express = require("express");
var router = express.Router();

var dashboardGeralController = require("../controllers/dashboardGeralController");

router.get("/cargasAlerta", function (req, res) {
    dashboardGeralController.cargasAlerta(req, res);
});

router.get("/maiorTemperatura", function (req, res) {
    dashboardGeralController.maiorTemperatura(req, res);
});

router.get("/menorTemperatura", function (req, res) {
    dashboardGeralController.menorTemperatura(req, res);
});

router.get("/tabela", function (req, res) {
    dashboardGeralController.tabela(req, res);
});



module.exports = router;