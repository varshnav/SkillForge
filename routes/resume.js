const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const db = require('../config/db');
const puppeteer = require('puppeteer');

const auth = (req) => jwt.verify(req.headers.authorization, process.env.JWT_SECRET);

router.get('/', async (req, res) => {
    try {
        const user = auth(req);

        const [student] = await db.promise().query(
            'SELECT name, bio, github, linkedin FROM students WHERE id=?', [user.id]);
        const [skills] = await db.promise().query(
            'SELECT skill_name, proficiency FROM skills WHERE student_id=?', [user.id]);
        const [projects] = await db.promise().query(
            'SELECT title, description, link FROM projects WHERE student_id=?', [user.id]);
        const [achievements] = await db.promise().query(
            'SELECT title, description FROM achievements WHERE student_id=?', [user.id]);

        const s = student[0];

        const html = `
        <!DOCTYPE html>
        <html>
        <head>
            <style>
                * { margin: 0; padding: 0; box-sizing: border-box; }
                body { 
                    font-family: 'Arial', sans-serif; 
                    color: #111;
                    background: #fff;
                    font-size: 13px;
                }

                .page {
                    display: grid;
                    grid-template-columns: 200px 1fr;
                    min-height: 100vh;
                }

                /* LEFT SIDEBAR */
                .sidebar {
                    background: #1c1c1c;
                    padding: 36px 20px;
                    color: #fff;
                }

                .avatar {
                    width: 72px;
                    height: 72px;
                    background: #333;
                    border-radius: 50%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-size: 28px;
                    font-weight: 800;
                    color: white;
                    margin: 0 auto 14px;
                    border: 2px solid #555;
                }

                .sidebar-name {
                    font-size: 15px;
                    font-weight: 800;
                    text-align: center;
                    margin-bottom: 6px;
                    color: #fff;
                }

                .sidebar-bio {
                    font-size: 11px;
                    color: #aaa;
                    text-align: center;
                    line-height: 1.5;
                    margin-bottom: 28px;
                }

                .sidebar-section {
                    margin-bottom: 24px;
                }

                .sidebar-section-title {
                    font-size: 10px;
                    font-weight: 800;
                    color: #fff;
                    text-transform: uppercase;
                    letter-spacing: 2px;
                    border-bottom: 1px solid #333;
                    padding-bottom: 6px;
                    margin-bottom: 12px;
                }

                .contact-item {
                    font-size: 10px;
                    color: #bbb;
                    margin-bottom: 8px;
                    word-break: break-all;
                    line-height: 1.4;
                }

                .skill-row {
                    margin-bottom: 10px;
                }

                .skill-name {
                    font-size: 11px;
                    color: #fff;
                    margin-bottom: 4px;
                    font-weight: 600;
                }

                .skill-bar-bg {
                    background: #333;
                    border-radius: 10px;
                    height: 4px;
                    width: 100%;
                }

                .skill-bar-fill {
                    background: #fff;
                    height: 4px;
                    border-radius: 10px;
                }

                .skill-level-text {
                    font-size: 10px;
                    color: #888;
                    margin-top: 2px;
                }

                /* RIGHT MAIN */
                .main {
                    padding: 36px 32px;
                    background: #fff;
                }

                .main-header {
                    border-bottom: 2px solid #111;
                    padding-bottom: 14px;
                    margin-bottom: 24px;
                }

                .main-header h1 {
                    font-size: 26px;
                    font-weight: 800;
                    color: #111;
                    margin-bottom: 4px;
                    letter-spacing: 1px;
                }

                .main-header p {
                    font-size: 12px;
                    color: #555;
                    font-weight: 600;
                    text-transform: uppercase;
                    letter-spacing: 1px;
                }

                .main-section {
                    margin-bottom: 24px;
                }

                .main-section-title {
                    font-size: 11px;
                    font-weight: 800;
                    color: #111;
                    text-transform: uppercase;
                    letter-spacing: 2px;
                    margin-bottom: 12px;
                    display: flex;
                    align-items: center;
                    gap: 8px;
                }

                .main-section-title::after {
                    content: '';
                    flex: 1;
                    height: 1px;
                    background: #ddd;
                }

                .project-card {
                    border-left: 3px solid #111;
                    padding: 10px 14px;
                    margin-bottom: 10px;
                    background: #f7f7f7;
                    border-radius: 0 6px 6px 0;
                }

                .project-card h3 {
                    font-size: 13px;
                    font-weight: 700;
                    color: #111;
                    margin-bottom: 4px;
                }

                .project-card p {
                    font-size: 11px;
                    color: #555;
                    margin-bottom: 4px;
                    line-height: 1.5;
                }

                .project-card a {
                    font-size: 10px;
                    color: #333;
                    text-decoration: underline;
                }

                .achievement-card {
                    border-left: 3px solid #555;
                    padding: 10px 14px;
                    margin-bottom: 10px;
                    background: #f7f7f7;
                    border-radius: 0 6px 6px 0;
                }

                .achievement-card h3 {
                    font-size: 13px;
                    font-weight: 700;
                    color: #111;
                    margin-bottom: 4px;
                }

                .achievement-card p {
                    font-size: 11px;
                    color: #555;
                    line-height: 1.5;
                }

                .footer {
                    background: #1c1c1c;
                    color: #aaa;
                    text-align: center;
                    padding: 10px;
                    font-size: 9px;
                    font-weight: 700;
                    letter-spacing: 2px;
                    grid-column: 1 / -1;
                }
            </style>
        </head>
        <body>
            <div class="page">
                <div class="sidebar">
                    <div class="avatar">${s.name.charAt(0).toUpperCase()}</div>
                    <div class="sidebar-name">${s.name}</div>
                    <div class="sidebar-bio">${s.bio || 'Passionate Student Developer'}</div>

                    <div class="sidebar-section">
                        <div class="sidebar-section-title">Contact</div>
                        ${s.github ? `<div class="contact-item">GitHub<br/>${s.github}</div>` : ''}
                        ${s.linkedin ? `<div class="contact-item">LinkedIn<br/>${s.linkedin}</div>` : ''}
                    </div>

                    <div class="sidebar-section">
                        <div class="sidebar-section-title">Skills</div>
                        ${skills.map(sk => {
                            const barWidth = sk.proficiency === 'Beginner' ? '33%' :
                                           sk.proficiency === 'Intermediate' ? '66%' : '100%';
                            return `
                            <div class="skill-row">
                                <div class="skill-name">${sk.skill_name}</div>
                                <div class="skill-bar-bg">
                                    <div class="skill-bar-fill" style="width:${barWidth}"></div>
                                </div>
                                <div class="skill-level-text">${sk.proficiency}</div>
                            </div>`;
                        }).join('')}
                    </div>
                </div>

                <div class="main">
                    <div class="main-header">
                        <h1>${s.name}</h1>
                        <p>Student Developer · SkillForge</p>
                    </div>

                    <div class="main-section">
                        <div class="main-section-title">Projects</div>
                        ${projects.map(p => `
                            <div class="project-card">
                                <h3>${p.title}</h3>
                                <p>${p.description}</p>
                                <a href="${p.link}">${p.link}</a>
                            </div>
                        `).join('')}
                    </div>

                    <div class="main-section">
                        <div class="main-section-title">Achievements</div>
                        ${achievements.map(a => `
                            <div class="achievement-card">
                                <h3>${a.title}</h3>
                                <p>${a.description}</p>
                            </div>
                        `).join('')}
                    </div>
                </div>
            </div>

            <div class="footer">
                SKILLFORGE · FORGE YOUR SKILLS. OWN YOUR STORY.
            </div>
        </body>
        </html>`;

        const browser = await puppeteer.launch({ args: ['--no-sandbox'] });
        const page = await browser.newPage();
        await page.setContent(html, { waitUntil: 'networkidle0' });
        const pdf = await page.pdf({
            format: 'A4',
            margin: { top: '0px', bottom: '0px', left: '0px', right: '0px' },
            printBackground: true
        });
        await browser.close();

        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', 'attachment; filename=SkillForge_Resume.pdf');
        res.send(pdf);

    } catch (err) {
        console.log(err);
        res.status(500).json({ message: 'Error generating resume' });
    }
});

module.exports = router;