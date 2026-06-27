const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.static('public'));

// Routes
const authRoutes = require('./routes/auth');
const skillRoutes = require('./routes/skills');
const projectRoutes = require('./routes/projects');
const achievementRoutes = require('./routes/achievements');
const profileRoutes = require('./routes/profile');
const searchRoutes = require('./routes/search');
const publicProfileRoutes = require('./routes/publicProfile');
const endorsementRoutes = require('./routes/endorsements');
const resumeRoutes = require('./routes/resume');
const analyticsRoutes = require('./routes/analytics'); 
const hirehubRoutes = require('./routes/hirehub');   

app.use('/api/auth', authRoutes);
app.use('/api/skills', skillRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/achievements', achievementRoutes);
app.use('/api/profile', profileRoutes);
app.use('/api/search', searchRoutes);
app.use('/api/public-profile', publicProfileRoutes);
app.use('/api/endorsements', endorsementRoutes);
app.use('/api/resume', resumeRoutes);
app.use('/api/analytics', analyticsRoutes); 
app.use('/api/hirehub', hirehubRoutes);     

// Serve login page by default when accessing the root URL
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/public/login.html'); 
});

const PORT = process.env.PORT || 3000;

// Start the server
app.listen(PORT, () => {
  console.log(`SkillForge server running on port ${PORT}`);
});