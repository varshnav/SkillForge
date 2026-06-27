const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const db = require('../config/db');

const auth = (req) => jwt.verify(req.headers.authorization, process.env.JWT_SECRET);

router.post('/:skillId', (req, res) => {
    const user = auth(req);
    const skillId = req.params.skillId;

    db.query('SELECT * FROM endorsements WHERE skill_id=? AND endorsed_by=?',
        [skillId, user.id], (err, results) => {
            if (results.length > 0)
                return res.status(400).json({ message: 'Already endorsed!' });

            db.query('INSERT INTO endorsements (skill_id, endorsed_by) VALUES (?, ?)',
                [skillId, user.id], (err) => {
                    db.query('SELECT COUNT(*) as count FROM endorsements WHERE skill_id=?',
                        [skillId], (err, countResult) => {
                            if (countResult[0].count >= 5) {
                                db.query('UPDATE skills SET verified=TRUE WHERE id=?', [skillId]);
                            }
                            res.json({ message: 'Endorsed!' });
                        });
                });
        });
});

router.get('/:skillId', (req, res) => {
    db.query('SELECT COUNT(*) as count FROM endorsements WHERE skill_id=?',
        [req.params.skillId],
        (err, results) => res.json(results[0]));
});

module.exports = router;