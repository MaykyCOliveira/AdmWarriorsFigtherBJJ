// Recupera os alunos do localStorage ou inicia com um array vazio
let alunos = JSON.parse(localStorage.getItem("alunos")) || [];

function atualizarTabelaRegistro() {
  const tbody = document.getElementById("lista-registro");
  tbody.innerHTML = "";

  if (alunos.length === 0) {
    tbody.innerHTML = `<tr><td colspan="11">Nenhum aluno cadastrado.</td></tr>`;
    return;
  }

  // Ordena os alunos por nome para melhor visualização
  alunos.sort((a, b) => a.nome.localeCompare(b.nome));

  alunos.forEach(aluno => {
    // Formata a data de nascimento para DD/MM/AAAA se necessário
    let dataNascimentoFormatada = aluno.dataNascimento;
    if (aluno.dataNascimento && aluno.dataNascimento.includes("-")) {
      const partesData = aluno.dataNascimento.split("-");
      dataNascimentoFormatada = `${partesData[2]}/${partesData[1]}/${partesData[0]}`;
    }

    const linha = `<tr>
                     <td style="white-space: nowrap; overflow: hidden; text-overflow: ellipsis;" title="${aluno.nome}">${aluno.nome}</td>
                     <td>${aluno.faixa}</td>
                     <td>${aluno.grau}</td>
                     <td>${aluno.telefone}</td>
                     <td>${aluno.email}</td>
                     <td class="endereco-coluna">${aluno.endereco}</td>
                     <td>${aluno.rg}</td>
                     <td>${aluno.cpf}</td>
                     <td>${dataNascimentoFormatada}</td>
                     <td>${aluno.nomeResponsavel}</td>
                     <td>${aluno.cpfResponsavel}</td>
                   </tr>`;
    tbody.innerHTML += linha;
  });
}

function atualizarAniversariantes() {
  const listaElem = document.getElementById("lista-aniversariantes");
  if (!listaElem) return;

  // Obtém o mês atual (1 a 12)
  const hoje = new Date();
  const mesAtual = hoje.getMonth() + 1;

  // Filtra os alunos cujas datas de nascimento têm o mesmo mês
  const aniversariantes = alunos.filter(aluno => {
    if (aluno.dataNascimento && aluno.dataNascimento.includes("/")) {
      const partes = aluno.dataNascimento.split("/");
      const mesAniversario = parseInt(partes[1], 10);
      return mesAniversario === mesAtual;
    }
    return false;
  });

  // Atualiza a seção de aniversariantes
  if (aniversariantes.length === 0) {
    listaElem.innerHTML = "<p>Nenhum aniversariante este mês.</p>";
  } else {
    let html = "<ul>";
    aniversariantes.forEach(aluno => {
      html += `<li>${aluno.nome} - ${aluno.dataNascimento}</li>`;
    });
    html += "</ul>";
    listaElem.innerHTML = html;
  }
}

// Atualiza os registros e a lista de aniversariantes ao carregar a página
document.addEventListener("DOMContentLoaded", () => {
  atualizarTabelaRegistro();
  atualizarAniversariantes();
});
