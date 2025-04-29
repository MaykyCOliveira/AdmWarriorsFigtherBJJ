const express = require('express');
const router = express.Router();
const db = require('../db');

// Listar frequência
router.get('/', (req, res) => {
    db.query('SELECT * FROM frequencia', (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(results);
    });
});

// Registrar/Atualizar presença
router.post('/', (req, res) => {
    const { aluno_id, data_presenca, presente } = req.body;
    const checkQuery = 'SELECT * FROM frequencia WHERE aluno_id = ? AND data_presenca = ?';

    db.query(checkQuery, [aluno_id, data_presenca], (err, result) => {
        if (err) return res.status(500).json({ message: 'Erro ao verificar frequência' });

        if (result.length > 0) {
            const updateQuery = 'UPDATE frequencia SET presente = ? WHERE aluno_id = ? AND data_presenca = ?';
            db.query(updateQuery, [presente, aluno_id, data_presenca], (err) => {
                if (err) return res.status(500).json({ message: 'Erro ao atualizar frequência' });
                res.status(200).json({ message: 'Frequência atualizada com sucesso' });
            });
        } else {
            const insertQuery = 'INSERT INTO frequencia (aluno_id, data_presenca, presente) VALUES (?, ?, ?)';
            db.query(insertQuery, [aluno_id, data_presenca, presente], (err) => {
                if (err) return res.status(500).json({ message: 'Erro ao registrar frequência' });
                res.status(201).json({ message: 'Frequência registrada com sucesso' });
            });
        }
    });
});

module.exports = router;
