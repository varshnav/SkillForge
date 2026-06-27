const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const db = require('../config/db');

const auth = (req) => jwt.verify(req.headers.authorization, process.env.JWT_SECRET);

router.post('/', (req, res) => {
    const user = auth(req);
    const { title, description, link } = req.body;
    db.query('INSERT INTO projects (student_id, title, description, link) VALUES (?, ?, ?, ?)',
        [user.id, title, description, link],
        (err) => {
            if (err) return res.status(500).json({ message: 'Error' });
            res.json({ message: 'Project added!' });
        });
});

router.get('/', (req, res) => {
    const user = auth(req);
    db.query('SELECT * FROM projects WHERE student_id = ?', [user.id],
        (err, results) => res.json(results));
});

router.delete('/:id', (req, res) => {
    db.query('DELETE FROM projects WHERE id = ?', [req.params.id],
        () => res.json({ message: 'Deleted!' }));
});

module.exports = router;