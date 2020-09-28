const express = require('express');
require('express-async-errors');
const admin = require('./api/routes/admin');
const users = require('./api/routes/users');
const managers = require('./api/routes/manager');
const applicant = require('./api/routes/applicant');
const employee = require('./api/routes/employee');
const reports = require('./api/routes/reports');
const helmet = require('helmet');
const compression = require('compression');

const app = express();

app.use(helmet());
app.use(compression());

app.use(express.json());
app.use(express.urlencoded({extended: true}));

app.use('/api/admin', admin);
app.use('/api/users', users);
app.use('/api/managers', managers);
app.use('/api/applicants', applicant);
app.use('/api/emploee', employee);
app.use('/api/reports', reports);

app.use((error, req, res, next)=>{
    res.status(500).json({error: error.message});
})

module.exports = app;