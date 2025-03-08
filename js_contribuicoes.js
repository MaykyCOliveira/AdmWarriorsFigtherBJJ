let alunos = JSON.parse(localStorage.getItem("alunos")) || [];
let alunoEditandoIndex = null;

function salvarDados() {
  localStorage.setItem("alunos", JSON.stringify(alunos));
}

function atualizarTabela() {
  const tabela = document.getElementById("lista-alunos");
  tabela.innerHTML = "";
  const totais = inicializarTotais();
  let totalAnual = 0;
  alunos.sort((a, b) => a.nome.localeCompare(b.nome));
  alunos.forEach((aluno, index) => {
    const linha = criarLinhaAluno(aluno, index, totais);
    tabela.innerHTML += linha;
  });
  atualizarTotais(totais, totalAnual);
  salvarDados();
  atualizarInadimplentes();
}

function inicializarTotais() {
  return {
    Janeiro: 0, Fevereiro: 0, Março: 0,
    Abril: 0, Maio: 0, Junho: 0,
    Julho: 0, Agosto: 0, Setembro: 0,
    Outubro: 0, Novembro: 0, Dezembro: 0
  };
}

function criarLinhaAluno(aluno, index, totais) {
  if (!aluno.pagamentos) {
    aluno.pagamentos = {
      Janeiro: false, Fevereiro: false, Março: false,
      Abril: false, Maio: false, Junho: false,
      Julho: false, Agosto: false, Setembro: false,
      Outubro: false, Novembro: false, Dezembro: false
    };
  }
  
  if (alunoEditandoIndex === index) {
    return `<tr>
              <td><input type="text" id="edit-nome-${index}" value="${aluno.nome}"></td>
              <td>
                <select id="edit-faixa-${index}">
                  <option value="Branca" ${aluno.faixa === "Branca" ? "selected" : ""}>Branca</option>
                  <option value="Cinza" ${aluno.faixa === "Cinza" ? "selected" : ""}>Cinza</option>
                  <option value="Amarela" ${aluno.faixa === "Amarela" ? "selected" : ""}>Amarela</option>
                  <option value="Laranja" ${aluno.faixa === "Laranja" ? "selected" : ""}>Laranja</option>
                  <option value="Verde" ${aluno.faixa === "Verde" ? "selected" : ""}>Verde</option>
                  <option value="Azul" ${aluno.faixa === "Azul" ? "selected" : ""}>Azul</option>
                  <option value="Roxa" ${aluno.faixa === "Roxa" ? "selected" : ""}>Roxa</option>
                  <option value="Marrom" ${aluno.faixa === "Marrom" ? "selected" : ""}>Marrom</option>
                  <option value="Preta" ${aluno.faixa === "Preta" ? "selected" : ""}>Preta</option>
                </select>
              </td>
              <td><input type="number" id="edit-grau-${index}" value="${aluno.grau}" min="0" max="4"></td>
              ${Object.keys(aluno.pagamentos).map(mes => {
                if (aluno.pagamentos[mes]) totais[mes] += 30;
                return `<td><input type="checkbox" ${aluno.pagamentos[mes] ? "checked" : ""} onchange="togglePagamento(${index}, '${mes}')"></td>`;
              }).join(" ")}
              <td>
                <button onclick="salvarEdicao(${index})">Salvar</button>
                <button onclick="cancelarEdicao()">Cancelar</button>
              </td>
            </tr>`;
  }
  
  const cores = {
    "Branca": "#FFFFFF",
    "Cinza": "#5c5b56",
    "Amarela": "#ffdd00",
    "Laranja": "#fc5203",
    "Verde": "#008000",
    "Azul": "#0000FF",
    "Roxa": "#800080",
    "Marrom": "#8B4513",
    "Preta": "#000000"
  };
  const corFaixa = cores[aluno.faixa] || "#FFFFFF";
  const textoFaixa = aluno.faixa === "Branca" ? "Branca" : aluno.faixa;
  const pagamentos = Object.keys(aluno.pagamentos).map(mes => {
    if (aluno.pagamentos[mes]) totais[mes] += 30;
    return `<td><input type="checkbox" ${aluno.pagamentos[mes] ? "checked" : ""} onchange="togglePagamento(${index}, '${mes}')"></td>`;
  }).join(" ");
  
  return `<tr>
            <td>${aluno.nome}</td>
            <td style="background-color: ${corFaixa}; color: ${aluno.faixa === 'Branca' ? '#000' : '#FFF'};">${textoFaixa}</td>
            <td>${aluno.grau}</td>
            ${pagamentos}
            <td>
              <button onclick="prepararEdicao(${index})">Editar</button>
              <button onclick="confirmarRemocao(${index})">Excluir</button>
            </td>
          </tr>`;
}

function prepararEdicao(index) {
  alunoEditandoIndex = index;
  atualizarTabela();
}

function salvarEdicao(index) {
  const novoNome = document.getElementById(`edit-nome-${index}`).value;
  const novaFaixa = document.getElementById(`edit-faixa-${index}`).value;
  const novoGrau = document.getElementById(`edit-grau-${index}`).value;
  alunos[index].nome = novoNome;
  alunos[index].faixa = novaFaixa;
  alunos[index].grau = novoGrau;
  alunoEditandoIndex = null;
  atualizarTabela();
}

function cancelarEdicao() {
  alunoEditandoIndex = null;
  atualizarTabela();
}

function atualizarTotais(totais, totalAnual) {
  Object.keys(totais).forEach(mes => {
    document.getElementById(`total-${mes.toLowerCase()}`).innerText = totais[mes].toFixed(2);
    totalAnual += totais[mes];
  });
  document.getElementById("total-anual").innerText = totalAnual.toFixed(2);
}

function atualizarInadimplentes() {
  const mesSelecionado = document.getElementById("mes-inadimplente") ? document.getElementById("mes-inadimplente").value : "";
  const tabelaInadimplentes = document.getElementById("lista-inadimplentes");
  if(tabelaInadimplentes) {
    tabelaInadimplentes.innerHTML = "";
    const alunosInadimplentes = new Set();
    alunos.forEach(aluno => {
      const mesesInadimplentes = Object.keys(aluno.pagamentos).filter(mes => !aluno.pagamentos[mes]);
      if (mesesInadimplentes.includes(mesSelecionado)) {
        alunosInadimplentes.add(aluno);
      }
    });
    alunosInadimplentes.forEach(aluno => {
      const linha = `<tr>
                      <td>${aluno.nome}</td>
                      <td>${aluno.faixa}</td>
                      <td>${aluno.grau}</td>
                    </tr>`;
      tabelaInadimplentes.innerHTML += linha;
    });
  }
}

function confirmarRemocao(index) {
  if (confirm("Tem certeza que deseja excluir este aluno?")) {
    removerAluno(index);
  }
}

function removerAluno(index) {
  alunos.splice(index, 1);
  atualizarTabela();
  alert("Aluno excluído com sucesso!");
}

function togglePagamento(index, mes) {
  alunos[index].pagamentos[mes] = !alunos[index].pagamentos[mes];
  atualizarTabela();
}

function buscarAluno() {
  let termo = document.getElementById("search").value.toLowerCase();
  document.querySelectorAll("#lista-alunos tr").forEach(tr => {
    tr.style.display = tr.innerText.toLowerCase().includes(termo) ? "" : "none";
  });
}

function exportarDados() {
  const meses = ["Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho", "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"];
  const anoAtual = new Date().getFullYear();
  let csvContent = "";
  meses.forEach(mes => {
    csvContent += `MÊS: ${mes}\n`;
    let header = "Nome,Cor da Faixa,Grau," + mes;
    csvContent += header + "\n";
    alunos.forEach((aluno, index) => {
      let row = `"${aluno.nome}","${aluno.faixa}","${aluno.grau}"`;
      const presente = aluno.pagamentos[mes] ? "Pago" : "Não Pago";
      row += `,"${presente}"`;
      csvContent += row + "\n";
    });
    csvContent += "\n";
  });
  const blob = new Blob([csvContent], { type: 'text/csv' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.setAttribute("href", url);
  a.setAttribute("download", `contribuicoes_jiu_jitsu_${anoAtual}.csv`);
  a.click();
  URL.revokeObjectURL(url);
}

function exportarPDF() {
  const { jsPDF } = window.jspdf;
  const doc = new jsPDF();
  const meses = ["Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho", "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"];
  const anoAtual = new Date().getFullYear();
  let y = 10;
  meses.forEach(mes => {
    doc.text(`MÊS: ${mes}`, 14, y);
    y += 10;
    let headerRow = "Nome | Cor da Faixa | Grau | " + mes;
    doc.text(headerRow, 14, y);
    y += 10;
    alunos.forEach((aluno, index) => {
      let row = `${aluno.nome} | ${aluno.faixa} | ${aluno.grau}`;
      row += ` | ${aluno.pagamentos[mes] ? "Pago" : "Não Pago"}`;
      doc.text(row, 14, y);
      y += 10;
      if (y > 280) {
        doc.addPage();
        y = 10;
      }
    });
    y += 10;
    if (y > 280) {
      doc.addPage();
      y = 10;
    }
  });
  doc.save(`contribuicoes_jiu_jitsu_${anoAtual}.pdf`);
}

atualizarTabela();
