const express = require('express');
const calendar = require('./calendar');

const app = express();

app.get('/:autologin/planning.ics', calendar.planningHandler);
app.get('/:autologin/projects.ics', calendar.projectsHandler);
app.get('/:autologin/projects-end.ics', calendar.projectsEndHandler);

app.use(express.static('public'));

app.use((req, res) => res.redirect('/'));

module.exports = app;