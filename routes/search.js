const express = require('express');
const router = express.Router();
const db = require('../config/db');

router.get('/', (req, res) => {
    const skill = req.query.skill || '';
    const query = skill
        ? `SELECT s.name, s.bio, s.github, s.linkedin, sk.skill_name, sk.proficiency 
           FROM students s 
           JOIN skills sk ON s.id = sk.student_id 
           WHERE sk.skill_name LIKE ?`
        : `SELECT s.name, s.bio, s.github, s.linkedin, sk.skill_name, sk.proficiency 
           FROM students s 
           JOIN skills sk ON s.id = sk.student_id`;

    const params = skill ? [`%${skill}%`] : [];
    db.query(query, params, (err, results) => {
        if (err) return res.status(500).json([]);
        res.json(results);
    });
});

module.exports = router;