var express = require("express");
var router = express.Router();
var cadastroCargaController = require("../controllers/cadastroCargaController");
// cadatrar carga rota
router.post("/cadastrarCarga", function(req, res) {
    cadastroCargaController.cadastrarCarga(req, res);
});
// buscar lotes 
router.get("/lotes", function(req, res) {
    cadastroCargaController.listarLotes(req, res);
});
// buscar sensores
router.get("/sensores", function(req, res) {
    cadastroCargaController.listarSensoresDisponiveis(req, res);
});

module.exports = router;