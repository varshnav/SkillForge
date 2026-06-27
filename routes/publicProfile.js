const express = require('express');
const router = express.Router();
const db = require('../config/db');

router.get('/:id', (req, res) => {
    const id = req.params.id;

    db.query('SELECT name, bio, github, linkedin FROM students WHERE id=?', [id], (err, studentResult) => {
        if (err || studentResult.length === 0) 
            return res.status(404).json({ message: 'Student not found' });

        db.query('SELECT skill_name, proficiency FROM skills WHERE student_id=?', [id], (err, skills) => {
            db.query('SELECT title, description, link FROM projects WHERE student_id=?', [id], (err, projects) => {
                db.query('SELECT title, description FROM achievements WHERE student_id=?', [id], (err, achievements) => {
                    res.json({
                        student: studentResult[0],
                        skills,
                        projects,
                        achievements
                    });
                });
            });
        });
    });
});

module.exports = router;