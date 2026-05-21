var express = require("express");
var router = express.Router();

var statusCargaController = require("../controllers/statusCargaController");

router.post("/atualizar", function (req, res) {
    statusCargaController.atualizar(req, res);
});

module.exports = router;