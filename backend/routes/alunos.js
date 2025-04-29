const express = require('express');
const router = express.Router();
const db = require('../db');

// Listar alunos
router.get('/', (req, res) => {
    db.query('SELECT * FROM alunos', (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(results);
    });
});

// Cadastrar aluno
router.post('/', (req, res) => {
    const { nome, faixa, grau, telefone, email, endereco, rg, cpf, dataNascimento, nomeResponsavel, cpfResponsavel } = req.body;

    const sql = `INSERT INTO alunos (nome, faixa, grau, telefone, email, endereco, rg, cpf, dataNascimento, nomeResponsavel, cpfResponsavel)
                 VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;

    db.query(sql, [nome, faixa, grau, telefone, email, endereco, rg, cpf, dataNascimento, nomeResponsavel, cpfResponsavel || null],
        (err, result) => {
            if (err) return res.status(500).json({ error: err.message });
            res.status(200).json({ message: 'Aluno adicionado com sucesso' });
        });
});

// Deletar aluno
router.delete('/:id', (req, res) => {
    const id = req.params.id;
    const sql = 'DELETE FROM alunos WHERE id = ?';
    db.query(sql, [id], (err) => {
        if (err) {
            console.error("Erro ao deletar aluno:", err);
            return res.status(500).send("Erro ao deletar aluno");
        }
        res.sendStatus(200);
    });
});

module.exports = router;
