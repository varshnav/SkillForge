const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../config/db');

// Register Endpoint
router.post('/register', (req, res) => {
  const { name, email, password, role } = req.body;
  const userRole = role || 'student'; // Defaults to student if not provided
  
  const hashedPassword = bcrypt.hashSync(password, 10);
  
  db.query(
    'INSERT INTO students (name, email, password, role) VALUES (?, ?, ?, ?)',
    [name, email, hashedPassword, userRole],
    (err, result) => {
      if (err) return res.status(500).json({ message: 'Email already exists or Database error!' });
      res.json({ message: 'Registered successfully!' });
    }
  );
});

// Login Endpoint
router.post('/login', (req, res) => {
  const { email, password } = req.body;
  
  db.query('SELECT * FROM students WHERE email = ?', [email], (err, results) => {
    if (err || results.length === 0) 
      return res.status(401).json({ message: 'Invalid credentials!' });
    
    const student = results[0];
    const isMatch = bcrypt.compareSync(password, student.password);
    
    if (!isMatch) 
      return res.status(401).json({ message: 'Invalid credentials!' });
    
    // Injecting role into JWT payload for route protection
    const token = jwt.sign(
      { id: student.id, role: student.role }, 
      process.env.JWT_SECRET, 
      { expiresIn: '1d' }
    );
    
    // Sending role to frontend for dashboard toggling
    res.json({ token, name: student.name, id: student.id, role: student.role });
  });
});

module.exports = router;