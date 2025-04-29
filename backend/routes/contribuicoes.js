const express = require('express');
const router = express.Router();
const db = require('../db');

// Listar contribuições
router.get('/', (req, res) => {
    db.query('SELECT * FROM contribuicoes', (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(results);
    });
});

// Cadastrar contribuição
router.post('/', (req, res) => {
    const { aluno_id, valor, data_pagamento, forma_pagamento } = req.body;
    db.query(
        'INSERT INTO contribuicoes (aluno_id, valor, data_pagamento, forma_pagamento) VALUES (?, ?, ?, ?)',
        [aluno_id, valor, data_pagamento, forma_pagamento],
        (err, result) => {
            if (err) return res.status(500).json({ error: err.message });
            res.status(201).json({ id: result.insertId });
        }
    );
});

module.exports = router;
