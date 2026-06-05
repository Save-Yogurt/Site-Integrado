var express = require("express");
var router = express.Router();

const { GoogleGenAI } = require("@google/genai");

const chatIA = new GoogleGenAI({
    apiKey: process.env.MINHA_CHAVE
});

router.post("/", async (req, res) => {

    try {

        const pergunta = req.body.pergunta;

        const resposta = await chatIA.models.generateContent({
            model: "gemini-2.5-flash",
            contents: pergunta
        });

        res.json({
            resultado: resposta.text
        });

    } catch (erro) {

        console.error(erro);

        res.status(500).json({
            erro: "Erro interno"
        });
    }
});

module.exports = router;