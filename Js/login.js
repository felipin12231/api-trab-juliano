var body = document.querySelector("body");
var signInButton = document.querySelector("#signIn");
var signUpButton = document.querySelector("#signUp");

body.onload = function () {
    body.className = "on-load";
};
signInButton.addEventListener("click", function () {
    body.className = "sign-in";
});
signUpButton.addEventListener("click", function () {
    body.className = "sign-up";
});
async function fazerRequisicao(url, method, bodyData) {
    try {
        const response = await fetch(url, {
            method: method,
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(bodyData)
        });

        const responseText = await response.text();

        if (!response.ok) {
            throw new Error(`Erro ao realizar a requisição. Status: ${response.status} - ${responseText}`);
        }
        if (responseText) {
            try {
                return JSON.parse(responseText);
            } catch (err) {
                throw new Error("Erro ao converter a resposta para JSON: " + err.message);
            }
        }
        return {}; 
    } catch (err) {
        alert("Erro na requisição! Detalhes: " + err.message);
        return null;
    }
}
document.querySelector("#register-form").addEventListener("submit", async function (e) {
    e.preventDefault();
    const email = document.querySelector("#register-email").value;
    const senha = document.querySelector("#register-password").value;
    const senhaConfirmada = document.querySelector("#register-password-confirm").value;
    if (senha !== senhaConfirmada) {
        alert("As senhas não coincidem!");
        return;
    }
    if (senha.length < 6 || senha.length > 50) {
        alert("A senha deve ter entre 6 e 50 caracteres.");
        return;
    }
    const body = {
        email: email,
        senha: senha,
        senhaConfirmada: senhaConfirmada
    };
    const result = await fazerRequisicao("https://umfgcloud-autenticacao-service-7e27ead80532.herokuapp.com/autenticacao/registar", "POST", body);

    if (result) {
        alert("Cadastro realizado com sucesso!");
        document.querySelector("#signIn").click();
    }
});
document.querySelector("#access").addEventListener("click", async function (e) {
    e.preventDefault();

    const email = document.querySelector("#login-email").value;
    const senha = document.querySelector("#login-password").value;

    const body = {
        email: email,
        senha: senha
    };
    const result = await fazerRequisicao("https://umfgcloud-autenticacao-service-7e27ead80532.herokuapp.com/autenticacao/autenticar", "POST", body);

    
    if (result) {
        const expira = new Date(result.dataExpiracao).toLocaleString();
        localStorage.setItem("usuario", email);
        localStorage.setItem("expira", expira);
        localStorage.setItem("token", result.token);
        window.location.href = "bemvindo.html";
    }
});
