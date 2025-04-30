async function atualizarTabelaRegistro() {
  const alunos = await carregarAlunos();
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

async function atualizarAniversariantes() {
  const listaElem = document.getElementById("lista-aniversariantes");
  if (!listaElem) return;

  const alunos = await carregarAlunos();
  const hoje = new Date();
  const mesAtual = String(hoje.getMonth() + 1).padStart(2, '0');

  const aniversariantes = alunos.filter(aluno => {
    if (!aluno.dataNascimento) return false;

    let partes;

    if (aluno.dataNascimento.includes('-')) {
      partes = aluno.dataNascimento.split('-'); // [AAAA, MM, DD]
      return partes[1] === mesAtual;
    } else if (aluno.dataNascimento.includes('/')) {
      partes = aluno.dataNascimento.split('/'); // [DD, MM, AAAA]
      return partes[1] === mesAtual;
    }

    return false;
  });

  if (aniversariantes.length === 0) {
    listaElem.innerHTML = "<p>Nenhum aniversariante este mês.</p>";
  } else {
    let html = "<ul>";
    aniversariantes.forEach(aluno => {
      let partes;
      if (aluno.dataNascimento.includes('-')) {
        partes = aluno.dataNascimento.split('-'); // [AAAA, MM, DD]
        html += `<li>${aluno.nome} - ${partes[2]}/${partes[1]}</li>`;
      } else {
        partes = aluno.dataNascimento.split('/'); // [DD, MM, AAAA]
        html += `<li>${aluno.nome} - ${partes[0]}/${partes[1]}</li>`;
      }
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

async function carregarAlunos() {
  try {
    const resposta = await fetch("http://localhost:3000/alunos");

    if (!resposta.ok) {
      throw new Error(`Erro HTTP: ${resposta.status}`);
    }
    const dados = await resposta.json();
    return dados;
  } catch (erro) {
    console.error("Erro ao carregar alunos:", erro);
    return [];
  }
}
