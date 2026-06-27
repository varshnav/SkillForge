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
const analyticsRoutes = require('./routes/analytics'); // <-- இங்க கொண்டு வந்தாச்சு
const hirehubRoutes = require('./routes/hirehub');   // <-- புதுசா HireHub ரூட் சேர்த்தாச்சு

app.use('/api/auth', authRoutes);
app.use('/api/skills', skillRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/achievements', achievementRoutes);
app.use('/api/profile', profileRoutes);
app.use('/api/search', searchRoutes);
app.use('/api/public-profile', publicProfileRoutes);
app.use('/api/endorsements', endorsementRoutes);
app.use('/api/resume', resumeRoutes);
app.use('/api/analytics', analyticsRoutes); // <-- இங்க மேப் பண்ணியாச்சு
app.use('/api/hirehub', hirehubRoutes);     // <-- HireHub API-ஐ எண்ட் பாயிண்ட்ல கனெக்ட் பண்ணியாச்சு

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`SkillForge server running on port ${PORT}`);
});