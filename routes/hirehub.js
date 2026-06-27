const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const db = require('../config/db');

// Middleware to verify if the user is a Recruiter
const verifyRecruiter = (req, res, next) => {
    try {
        const token = req.headers.authorization?.split(" ")[1] || req.headers.authorization;
        if (!token) return res.status(401).json({ error: 'No token provided' });
        
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        
        // Strict check: Only recruiters are allowed
        if (decoded.role !== 'recruiter') {
            return res.status(403).json({ error: 'Access denied. Recruiters only.' });
        }
        
        req.user = decoded;
        next();
    } catch (err) {
        return res.status(401).json({ error: 'Invalid or expired token' });
    }
};

// 1. Get all students with their total skills and verified badge counts (For Recruiter Dashboard)
router.get('/students', verifyRecruiter, (req, res) => {
    const query = `
        SELECT id, name, email, role,
        (SELECT COUNT(*) FROM skills WHERE student_id = students.id) as total_skills,
        (SELECT COUNT(*) FROM skills WHERE student_id = students.id AND verified = TRUE) as verified_badges
        FROM students 
        WHERE role = 'student'
    `;
    db.query(query, (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(results);
    });
});

// 2. Shortlist a student (Bookmark feature for recruiters)
router.post('/shortlist', verifyRecruiter, (req, res) => {
    const { student_id } = req.body;
    const recruiter_id = req.user.id;

    // Create shortlists table dynamically if it doesn't exist
    const createTableQuery = `
        CREATE TABLE IF NOT EXISTS shortlists (
            id INT AUTO_INCREMENT PRIMARY KEY,
            recruiter_id INT,
            student_id INT,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (recruiter_id) REFERENCES students(id) ON DELETE CASCADE,
            FOREIGN KEY (student_id) REFERENCES students(id) ON DELETE CASCADE
        )
    `;
    
    db.query(createTableQuery, (err) => {
        if (err) return res.status(500).json({ error: 'Error creating shortlists table' });

        db.query('INSERT INTO shortlists (recruiter_id, student_id) VALUES (?, ?)', 
        [recruiter_id, student_id], (err2) => {
            if (err2) return res.status(500).json({ error: err2.message });
            res.json({ message: 'Student shortlisted successfully!' });
        });
    });
});

module.exports = router;