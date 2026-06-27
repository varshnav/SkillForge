const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const db = require('../config/db');

const auth = (req) => jwt.verify(req.headers.authorization, process.env.JWT_SECRET);

router.post('/', (req, res) => {
    const user = auth(req);
    const { skill_name, proficiency } = req.body;
    db.query('INSERT INTO skills (student_id, skill_name, proficiency) VALUES (?, ?, ?)',
        [user.id, skill_name, proficiency],
        (err) => {
            if (err) return res.status(500).json({ message: 'Error' });
            res.json({ message: 'Skill added!' });
        });
});

router.get('/', (req, res) => {
    const user = auth(req);
    db.query('SELECT * FROM skills WHERE student_id = ?', [user.id],
        (err, results) => res.json(results));
});

router.delete('/:id', (req, res) => {
    db.query('DELETE FROM skills WHERE id = ?', [req.params.id],
        () => res.json({ message: 'Deleted!' }));
});

module.exports = router;