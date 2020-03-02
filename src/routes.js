const express = require('express');
const calendar = require('./calendar');

const app = express();

app.use(express.static('public'));

app.get('/',            (req, res) => {res.sendFile('index.html')});
app.get('/index.css',   (req, res) => {res.sendFile('index.css')});
//app.get('/index.js',    (req, res) => {res.sendFile('index.js')});
//app.get('/favicon.ico', (req, res) => {res.sendFile('favicon.ico')});

app.get('/:autologin/planning.ics', calendar.planningHandler);
app.get('/:autologin/projects.ics', calendar.projectsHandler);
app.get('/:autologin/projects-end.ics', calendar.projectsEndHandler);

module.exports = app;