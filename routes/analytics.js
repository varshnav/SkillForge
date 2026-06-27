const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const db = require('../config/db');

const auth = (req) => jwt.verify(req.headers.authorization, process.env.JWT_SECRET);

router.post('/view/:studentId', (req, res) => {
    db.query('INSERT INTO profile_views (student_id) VALUES (?)',
        [req.params.studentId],
        (err) => res.json({ message: 'View tracked!' }));
});

router.get('/', (req, res) => {
    try {
        const user = auth(req);

        db.query('SELECT COUNT(*) as total_views FROM profile_views WHERE student_id=?',
            [user.id], (err1, views) => {
                if (err1) return res.json({ total_views: 0, total_endorsements: 0, verified_skills: 0 });

                db.query('SELECT COUNT(*) as total_endorsements FROM endorsements e JOIN skills s ON e.skill_id=s.id WHERE s.student_id=?',
                    [user.id], (err2, endorsements) => {
                        if (err2) return res.json({ total_views: views[0].total_views, total_endorsements: 0, verified_skills: 0 });

                        db.query('SELECT COUNT(*) as verified_skills FROM skills WHERE student_id=? AND verified=TRUE',
                            [user.id], (err3, verified) => {
                                if (err3) return res.json({ total_views: views[0].total_views, total_endorsements: endorsements[0].total_endorsements, verified_skills: 0 });

                                res.json({
                                    total_views: views[0].total_views,
                                    total_endorsements: endorsements[0].total_endorsements,
                                    verified_skills: verified[0].verified_skills
                                });
                            });
                    });
            });
    } catch (err) {
        res.json({ total_views: 0, total_endorsements: 0, verified_skills: 0 });
    }
});

module.exports = router;