var loginModel = require("../models/loginModel");

function autenticar(req, res) {
    var email = req.body.emailServer;
    var senha = req.body.senhaServer;

    if (email == undefined) {
        return res.status(400).send("Seu email está undefined!");
    } 
    
    if (senha == undefined) {
        return res.status(400).send("Sua senha está indefinida!");
    }

    loginModel.autenticar(email, senha)
        .then(function (resultadoAutenticar) {
            if (resultadoAutenticar.length == 1) {
                res.json({
                    id_usuario: resultadoAutenticar[0].id_usuario,
                    email: resultadoAutenticar[0].email,
                    nome: resultadoAutenticar[0].nome,
                    senha: resultadoAutenticar[0].senha,
                    id_empresa: resultadoAutenticar[0].fk_empresa
                });
            } else if (resultadoAutenticar.length == 0) {
                res.status(403).send("Email e/ou senha inválido(s)");
            } else {
                res.status(403).send("Mais de um usuário com o mesmo login e senha!");
            }
        })
        .catch(function (erro) {
            console.log(erro);
            console.log("\nHouve um erro ao realizar o login! Erro: ", erro.sqlMessage);
            res.status(500).json(erro.sqlMessage);
        });
}

module.exports = {
    autenticar
};