var express = require("express");
var router = express.Router();
var cadastroCargaController = require("../controllers/cadastroCargaController");

router.post("/cadastrarCarga", function(req, res) {
    cadastroCargaController.cadastrarCarga(req, res);
});

router.get("/lotes", function(req, res) {
    cadastroCargaController.listarLotes(req, res);
});

router.get("/sensores", function(req, res) {
    cadastroCargaController.listarSensoresDisponiveis(req, res);
});

module.exports = router;