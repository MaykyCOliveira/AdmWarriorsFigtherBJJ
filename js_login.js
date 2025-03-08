document.getElementById("loginForm").addEventListener("submit", function(e) {
  e.preventDefault();
  const username = document.getElementById("username").value.trim();
  const password = document.getElementById("password").value.trim();

  // Verifica se os dados estão corretos
  if (username === "WarriorsAdmin2025" && password === "2025warriorsAdmin") {
    // Login correto: redireciona para o formulário (index.html)
    window.location.href = "index.html";
  } else {
    // Dados incorretos: exibe um popup de erro
    alert("Login ou senha inválidos!");
  }
});
