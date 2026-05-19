const express = require("express");
const router = express.Router();

const entregaController =
    require("../controllers/entregaController");

router.post("/cadastrar", (req, res) => {
    entregaController.cadastrar(req, res);
});

router.get("/listarSemEntrega", (req, res) => {
    entregaController.listarSemEntrega(req, res);
});

module.exports = router;