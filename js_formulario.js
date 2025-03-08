// Recupera os alunos do localStorage ou inicia com um array vazio
let alunos = JSON.parse(localStorage.getItem("alunos")) || [];

function salvarDados() {
  localStorage.setItem("alunos", JSON.stringify(alunos));
}

function mostrarFeedback(mensagem, tipo) {
  const feedback = document.getElementById("feedback");
  feedback.innerText = mensagem;
  feedback.style.color = tipo === "error" ? "red" : "green";
  setTimeout(() => feedback.innerText = "", 3000);
}

function validarEntrada(nome, faixa, grau, telefone, email, endereco, rg, cpf, dataNascimento, nomeResponsavel, cpfResponsavel) {
  if (!nome) { mostrarFeedback("Digite o nome do aluno!", "error"); return false; }
  if (!faixa) { mostrarFeedback("Selecione a faixa!", "error"); return false; }

  // Define o limite de graus conforme a faixa escolhida
  const limiteGrau = faixa === "Preta" ? 10 : 4;
  
  if (grau < 0 || grau > limiteGrau) {
    mostrarFeedback(`O grau deve estar entre 0 e ${limiteGrau}!`, "error");
    return false;
  }

  if (!telefone) { mostrarFeedback("Digite o telefone do aluno!", "error"); return false; }
  if (!email) { mostrarFeedback("Digite o email do aluno!", "error"); return false; }
  if (!endereco) { mostrarFeedback("Digite o endereço do aluno!", "error"); return false; }
  if (!rg) { mostrarFeedback("Digite o RG do aluno!", "error"); return false; }
  if (!cpf) { mostrarFeedback("Digite o CPF do aluno!", "error"); return false; }
  if (!dataNascimento) { mostrarFeedback("Digite a data de nascimento!", "error"); return false; }
  if (nomeResponsavel && !cpfResponsavel) { mostrarFeedback("Digite o CPF do responsável!", "error"); return false; }
  return true;
}

function alunoJaExiste(nome) {
  return alunos.some(aluno => aluno.nome.toLowerCase() === nome.toLowerCase());
}

function adicionarAluno() {
  const nome = document.getElementById("nome").value.trim();
  const faixa = document.getElementById("faixa").value;
  let grau = parseInt(document.getElementById("grau").value, 10);
  const telefone = document.getElementById("telefone").value.trim();
  const email = document.getElementById("email").value.trim();
  const endereco = document.getElementById("endereco").value.trim();
  const rg = document.getElementById("rg").value.trim();
  const cpf = document.getElementById("cpf").value.trim();
  const dataNascimento = document.getElementById("data-nascimento").value;
  const nomeResponsavel = document.getElementById("nome-responsavel").value.trim();
  const cpfResponsavel = document.getElementById("cpf-responsavel").value.trim();

  if (!dataNascimento) {
    mostrarFeedback("Digite a data de nascimento!", "error");
    return;
  }

  // Converte a data para o formato DD/MM/AAAA
  const partesData = dataNascimento.split("-");
  const dataNascimentoFormatada = `${partesData[2]}/${partesData[1]}/${partesData[0]}`;

  // Define o limite de grau com base na faixa escolhida
  const limiteGrau = faixa === "Preta" ? 10 : 4;
  if (grau < 0 || grau > limiteGrau) {
    mostrarFeedback(`O grau deve estar entre 0 e ${limiteGrau}!`, "error");
    return;
  }

  if (!validarEntrada(nome, faixa, grau, telefone, email, endereco, rg, cpf, dataNascimentoFormatada, nomeResponsavel, cpfResponsavel)) return;
  if (alunoJaExiste(nome)) { mostrarFeedback("Este aluno já está cadastrado!", "error"); return; }

  alunos.push({ 
    nome, faixa, grau, telefone, email, endereco, rg, cpf, 
    dataNascimento: dataNascimentoFormatada, 
    nomeResponsavel, cpfResponsavel 
  });

  salvarDados();
  mostrarFeedback("Aluno adicionado com sucesso!", "success");
  limparCampos();
}

// Atualiza o limite de grau dinamicamente ao selecionar a faixa
document.getElementById("faixa").addEventListener("change", function() {
  const grauInput = document.getElementById("grau");
  grauInput.max = this.value === "Preta" ? 10 : 4;
  if (parseInt(grauInput.value, 10) > grauInput.max) {
    grauInput.value = grauInput.max;
  }
});

function limparCampos() {
  document.getElementById("nome").value = "";
  document.getElementById("faixa").value = "";
  document.getElementById("grau").value = "";
  document.getElementById("telefone").value = "";
  document.getElementById("email").value = "";
  document.getElementById("endereco").value = "";
  document.getElementById("rg").value = "";
  document.getElementById("cpf").value = "";
  document.getElementById("data-nascimento").value = "";
  document.getElementById("nome-responsavel").value = "";
  document.getElementById("cpf-responsavel").value = "";
}
