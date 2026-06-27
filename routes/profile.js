const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const db = require('../config/db');

const auth = (req) => jwt.verify(req.headers.authorization, process.env.JWT_SECRET);

router.post('/', (req, res) => {
    const user = auth(req);
    const { bio, github, linkedin } = req.body;
    db.query(
        'UPDATE students SET bio=?, github=?, linkedin=? WHERE id=?',
        [bio, github, linkedin, user.id],
        (err) => {
            if (err) return res.status(500).json({ message: 'Error' });
            res.json({ message: 'Profile updated!' });
        }
    );
});

router.get('/', (req, res) => {
    const user = auth(req);
    db.query('SELECT bio, github, linkedin FROM students WHERE id=?',
        [user.id],
        (err, results) => res.json(results[0])
    );
});

module.exports = router;