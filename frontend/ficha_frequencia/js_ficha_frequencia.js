// Carrega os alunos direto do banco de dados
let alunos = [];
fetch("http://localhost:3000/alunos")
  .then(res => res.json())
  .then(data => {
    alunos = data;

    // Garante que cada aluno possua um identificador único e a propriedade 'frequencia'
    alunos.forEach((aluno, index) => {
      if (!aluno.id) {
        aluno.id = Date.now() + index;
      }
      if (!aluno.frequencia) {
        aluno.frequencia = {};
      }
    });

    gerarTabelaFrequencia();
  })
  .catch(error => {
    console.error("Erro ao carregar alunos:", error);
  })

// Salva os alunos (incluindo os dados de frequência) no banco de dados
function salvarAlunos() {
  fetch("http://localhost:3000/alunos", {
    method: "PUT",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(alunos)
  }).catch(error => console.error("Erro ao salvar alunos no backend:", error));
}

// Função para obter as datas de aula (apenas terças e quintas) para um dado mês e ano
function getDatasAulas(mes, ano) {
  const datas = [];
  const mesesObj = {
    "Janeiro": 0, "Fevereiro": 1, "Março": 2, "Abril": 3,
    "Maio": 4, "Junho": 5, "Julho": 6, "Agosto": 7,
    "Setembro": 8, "Outubro": 9, "Novembro": 10, "Dezembro": 11
  };
  const mesIndex = mesesObj[mes];
  const dataInicio = new Date(ano, mesIndex, 1);
  const dataFim = new Date(ano, mesIndex + 1, 0);

  for (let dia = dataInicio.getDate(); dia <= dataFim.getDate(); dia++) {
    const dataAtual = new Date(ano, mesIndex, dia);
    const diaSemana = dataAtual.getDay(); // 0: domingo, 1: segunda, 2: terça, etc.
    if (diaSemana === 2 || diaSemana === 4) { // Apenas terças (2) e quintas (4)
      const anoStr = dataAtual.getFullYear();
      const mesStr = (dataAtual.getMonth() + 1).toString().padStart(2, '0');
      const diaStr = dataAtual.getDate().toString().padStart(2, '0');
      datas.push(`${anoStr}-${mesStr}-${diaStr}`);
    }
  }
  return datas;
}

// Gera a tabela de frequência para o mês selecionado
function gerarTabelaFrequencia() {
  const mesSelecionado = document.getElementById("mes-selecionado").value;
  const anoAtual = new Date().getFullYear();
  const datasAulas = getDatasAulas(mesSelecionado, anoAtual);

  // Cria o cabeçalho da tabela
  let cabecalho = `<tr>
                      <th>Aluno (Nome, Faixa, Grau)</th>
                      <th>Telefone</th>`;
  datasAulas.forEach(data => {
    const dia = data.substr(8, 2);
    const mes = data.substr(5, 2);
    cabecalho += `<th>${dia}/${mes}</th>`;
  });
  cabecalho += `</tr>`;

  let linhas = "";
  // Cria uma cópia ordenada (para exibição) sem alterar a ordem original armazenada
  let alunosOrdenados = [...alunos].sort((a, b) => a.nome.localeCompare(b.nome));

  alunosOrdenados.forEach(aluno => {
    // Apenas inicializa a frequência para o mês se ainda não existir para esse aluno
    if (!aluno.frequencia[mesSelecionado]) {
      aluno.frequencia[mesSelecionado] = {};
      datasAulas.forEach(data => {
        if (aluno.frequencia[mesSelecionado][data] === undefined) {
          aluno.frequencia[mesSelecionado][data] = false;
        }
      });
    }

    const infoAluno = `${aluno.nome} - ${aluno.faixa} - Grau ${aluno.grau}`;
    const telefone = aluno.telefone;

    let checkboxHTML = "";
    datasAulas.forEach(data => {
      const checked = aluno.frequencia[mesSelecionado][data] ? "checked" : "";
      // Usa o id do aluno para associar o checkbox corretamente
      checkboxHTML += `<td><input type="checkbox" ${checked} onchange="atualizarFrequencia('${aluno.id}', '${mesSelecionado}', '${data}', this.checked)"></td>`;
    });

    linhas += `<tr>
                 <td>${infoAluno}</td>
                 <td>${telefone}</td>
                 ${checkboxHTML}
               </tr>`;
  });

  document.getElementById("tabela-frequencia").innerHTML = cabecalho + linhas;
  salvarAlunos();
}

// Atualiza a frequência de um aluno (identificado pelo id) para uma determinada data
function atualizarFrequencia(studentId, mes, data, presente) {
  const aluno = alunos.find(a => a.id == studentId);
  if (aluno) {
    if (!aluno.frequencia[mes]) {
      aluno.frequencia[mes] = {};
    }
    aluno.frequencia[mes][data] = presente;
    salvarAlunos();
  }
}

// Função para exportar os dados de frequência para CSV
function exportarFrequenciaCSV() {
  const mesesArr = ["Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho", "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"];
  const anoAtual = new Date().getFullYear();
  let csvContent = "";

  mesesArr.forEach(mes => {
    csvContent += `MÊS: ${mes}\n`;
    const datasAulas = getDatasAulas(mes, anoAtual);
    let header = "Aluno (Nome, Faixa, Grau),Telefone";
    datasAulas.forEach(data => {
      const dia = data.substr(8, 2);
      const mesStr = data.substr(5, 2);
      header += `,${dia}/${mesStr}`;
    });
    csvContent += header + "\n";

    alunos.forEach(aluno => {
      // Certifica que a frequência para o mês existe para esse aluno
      let freqMes = (aluno.frequencia && aluno.frequencia[mes]) ? aluno.frequencia[mes] : {};
      const infoAluno = `${aluno.nome} - ${aluno.faixa} - Grau ${aluno.grau}`;
      const telefone = aluno.telefone;
      let row = `"${infoAluno}","${telefone}"`;
      datasAulas.forEach(data => {
        const status = freqMes[data] ? "Presente" : "Falta";
        row += `,"${status}"`;
      });
      csvContent += row + "\n";
    });
    csvContent += "\n";
  });

  const blob = new Blob([csvContent], { type: 'text/csv' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `frequencia_anual_${anoAtual}.csv`;
  a.click();
  URL.revokeObjectURL(url);
}

// Função para exportar os dados de frequência para PDF
function exportarFrequenciaPDF() {
  const { jsPDF } = window.jspdf;
  const doc = new jsPDF();
  const mesesArr = ["Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho", "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"];
  const anoAtual = new Date().getFullYear();
  let y = 10;
  mesesArr.forEach(mes => {
    const datasAulas = getDatasAulas(mes, anoAtual);
    doc.text(`MÊS: ${mes}`, 14, y);
    y += 10;
    let headerRow = "Aluno (Nome, Faixa, Grau) | Telefone";
    datasAulas.forEach(data => {
      const dia = data.substr(8, 2);
      const mesStr = data.substr(5, 2);
      headerRow += ` | ${dia}/${mesStr}`;
    });
    doc.text(headerRow, 14, y);
    y += 10;
    alunos.forEach(aluno => {
      const infoAluno = `${aluno.nome} - ${aluno.faixa} - Grau ${aluno.grau}`;
      const telefone = aluno.telefone;
      let row = `${infoAluno} | ${telefone}`;
      let freqMes = (aluno.frequencia && aluno.frequencia[mes]) ? aluno.frequencia[mes] : {};
      datasAulas.forEach(data => {
        const status = freqMes[data] ? "P" : "F";
        row += ` | ${status}`;
      });
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
  doc.save(`frequencia_anual_${anoAtual}.pdf`);
}