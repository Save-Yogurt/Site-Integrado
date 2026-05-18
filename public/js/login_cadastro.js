// Array para armazenar empresas cadastradas
let listaEmpresasCadastradas = [];

let erros = [];

// ================= CADASTRO =================

function cadastro_realizado() {

    let codigo = ipt_codigo_cadastro.value;
    let cpf = ipt_cpf_cadastro.value;
    let email_cadastro = ipt_email_cadastro.value;
    let senha_cadastrada = ipt_senha_cadastro.value;
    let confirmar_senha_cadastro = ipt_confirmar_senha_cadastro.value;

    let resultado = document.getElementById("div_resultado_cadastro");

    let idEmpresaVincular;

    resultado.innerHTML = "";
    resultado.style.color = "";

    // VALIDAÇÃO CAMPOS
    if (
        codigo == "" ||
        cpf == "" ||
        email_cadastro == "" ||
        senha_cadastrada == "" ||
        confirmar_senha_cadastro == ""
    ) {

        resultado.innerHTML = "Preencha todos os campos obrigatórios!";
        resultado.style.color = "red";
        return false;
    }

    // VALIDAÇÃO SENHA
    if (senha_cadastrada !== confirmar_senha_cadastro) {

        resultado.innerHTML = "As senhas não coincidem!";
        resultado.style.color = "red";
        return false;
    }

    // VALIDAR CÓDIGO DA EMPRESA
    let codigoValido = false;

    for (let i = 0; i < listaEmpresasCadastradas.length; i++) {

        if (listaEmpresasCadastradas[i].codigo_ativacao == codigo) {

            idEmpresaVincular = listaEmpresasCadastradas[i].id;
            codigoValido = true;

            console.log("Código válido!");
            break;
        }
    }

    if (!codigoValido) {

        resultado.innerHTML = "Código de ativação inválido!";
        resultado.style.color = "red";
        return false;
    }

    // FETCH CADASTRO
    fetch("/usuarios/cadastrar", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },

        body: JSON.stringify({

            nomeServer: cpf, // se quiser trocar depois por nome real
            emailServer: email_cadastro,
            senhaServer: senha_cadastrada,
            idEmpresaVincularServer: idEmpresaVincular

        }),

    })

        .then(function (resposta) {

            console.log("resposta: ", resposta);

            if (resposta.ok) {

                resultado.innerHTML = "Cadastro realizado com sucesso!";
                resultado.style.color = "green";

                setTimeout(() => {

                    window.location.href = "login.html";

                }, 2000);

            } else {

                throw ("Erro ao realizar cadastro!");

            }

        })

        .catch(function (erro) {

            console.log("#ERRO:", erro);

            resultado.innerHTML = "Erro ao realizar cadastro!";
            resultado.style.color = "red";

        });

    return false;
}

// ================= LOGIN =================

function login() {

    let email = ipt_email_login.value;
    let senha = ipt_senha_login.value;

    let resultado = document.getElementById("div_resultado_login");

    let tentativas = 3;
    let acertou = false;

    if (email == "" || senha == "") {

        resultado.innerHTML = "Todos os campos devem ser preenchidos.";
        resultado.style.color = "red";

        return false;
    }

    fetch("/usuarios/autenticar", {

        method: "POST",

        headers: {
            "Content-Type": "application/json"
        },

        body: JSON.stringify({

            emailServer: email,
            senhaServer: senha

        })

    })

        .then(function (resposta) {

            console.log("ESTOU NO THEN DO login()!");

            if (resposta.ok) {

                resposta.json().then(json => {

                    console.log(json);

                    sessionStorage.EMAIL_USUARIO = json.email;
                    sessionStorage.NOME_USUARIO = json.nome;
                    sessionStorage.ID_USUARIO = json.id;

                    resultado.innerHTML = "Login confirmado!";
                    resultado.style.color = "green";

                    acertou = true;

                    setTimeout(function () {

                        window.location = "dash-geral.html";

                    }, 1000);

                });

            } else {

                erros.push("bloqueado");

                for (let i = 0; i < erros.length; i++) {

                    if (i == 2) {

                        alert("Você excedeu o número de tentativas.");

                        botao_acao.style.display = "none";
                        break;
                    }
                }

                tentativas = tentativas - erros.length;

                resultado.innerHTML =
                    `Email ou senha incorretos. Restam ${tentativas} tentativa(s).`;

                resultado.style.color = "red";

            }

        })

        .catch(function (erro) {

            console.log(erro);

            resultado.innerHTML = "Erro ao realizar login.";
            resultado.style.color = "red";

        });

    return false;
}

// ================= REDEFINIR SENHA =================

function redefinir() {

    let email_informado = ipt_email_redefinir.value;
    let senha_nova = ipt_nova_senha.value;
    let senha_confirmada = ipt_confirmar_senha.value;

    let resultado = document.getElementById("div_resultado_redefinir");

    if (
        email_informado == "" ||
        senha_nova == "" ||
        senha_confirmada == ""
    ) {

        resultado.innerHTML = "Preencha todos os campos.";
        resultado.style.color = "red";

        return false;
    }

    if (senha_nova != senha_confirmada) {

        resultado.innerHTML = "As senhas não coincidem!";
        resultado.style.color = "red";

        return false;
    }

    fetch("/usuarios/redefinirSenha", {

        method: "PUT",

        headers: {
            "Content-Type": "application/json"
        },

        body: JSON.stringify({

            emailServer: email_informado,
            senhaServer: senha_nova

        })

    })

        .then(function (resposta) {

            if (resposta.ok) {

                resultado.innerHTML = "Senha alterada com sucesso!";
                resultado.style.color = "green";

                setTimeout(() => {

                    window.location.href = "login.html";

                }, 2000);

            } else {

                resultado.innerHTML = "Esse e-mail não possui conta.";
                resultado.style.color = "red";

            }

        })

        .catch(function (erro) {

            console.log(erro);

            resultado.innerHTML = "Erro ao redefinir senha.";
            resultado.style.color = "red";

        });

}

// ================= LISTAR EMPRESAS =================

function listar() {

    fetch("/empresas/listar", {

        method: "GET"

    })

        .then(function (resposta) {

            resposta.json().then((empresas) => {

                empresas.forEach((empresa) => {

                    listaEmpresasCadastradas.push(empresa);

                });

                console.log(listaEmpresasCadastradas);

            });

        })

        .catch(function (erro) {

            console.log("#ERRO:", erro);

        });

}