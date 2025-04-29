const express = require('express');
const cors = require('cors');
const path = require('path');
const db = require('./db');

const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());

// Servir arquivos estáticos do frontend
app.use(express.static(path.join(__dirname, '../frontend')));

// Usar rotas modularizadas
app.use('/alunos', require('./routes/alunos'));
app.use('/contribuicoes', require('./routes/contribuicoes'));
app.use('/frequencia', require('./routes/frequencia'));

app.listen(port, () => {
    console.log(`Servidor rodando em http://localhost:${port}`);
});