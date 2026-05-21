var express = require("express");
var router = express.Router();


var cadastroLoteController = require("../controllers/cadastroLoteController");

router.post("/cadastrarLote", function (req, res){
    cadastroLoteController.cadastrarLote(req, res);
});

module.exports = router;