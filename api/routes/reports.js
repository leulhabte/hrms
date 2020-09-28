const express = require('express');
const route = express.Router();
const { Employee } = require('../model/employee');
const { User } = require('../model/user');
const { Leave } = require('../model/leave');
const {authAdmin, authManager} = require('../middleware/auth');
const { Report, validateReport, addReport } = require('../model/performance');

route.get('/getNewHire', async (req, res) => {
    const page = req.query.page;
    const perPage = req.query.perPage;
    const users = await Employee.find({ status: 'New Hire' }).skip((page - 1) * perPage).limit(perPage).sort({ name: 1 });
    // if (users.length > 0) {
    //     const changeStatus = await Employee.updateMany({}, { $set: { status: 'Hired' } });
    //     console.log(changeStatus);
        return res.status(200).json({ message: 'New hire report', users });
    // }
    // if (users.length === 0) return res.status(200).json({ error: 'No new Employee found' });
});

route.get('/genNewManager', async (req, res) => {
    const page = req.query.page;
    const perPage = req.query.perPage;
    const managers = await User.find({ status: 'New Manager' }).skip((page - 1) * perPage).limit(perPage).sort({ name: 1 });
    return res.status(200).json({ message: 'New manager Report',page, perPage, Managers: managers });
});

route.get('/genTermination', async (req, res) => {
    const page = req.query.page;
    const perPage = req.query.perPage;
    const managers = await User.find({ status: 'Fired' }).skip((page - 1) * perPage).limit(perPage).sort({ name: 1 });
    const emp = await Employee.find({ role: 'Fired' }).skip((page - 1) * perPage).limit(perPage).sort({ name: 1 })
    return res.status(200).json({ message: 'Termination Report',page, perPage, Managers: managers, Employee: emp });
});

route.get('/genLeave', async (req, res) => {
    const page = req.query.page;
    const perPage = req.query.perPage;
    const emp = await Leave.find().populate('user', 'name email').skip((page - 1) * perPage).limit(perPage).sort({ name: 1 });
    return res.status(200).json({ message: 'Leave Report', page, perPage, Report: emp });
});

route.post('/createReport', async (req, res) => {
    const { error } = await validateReport(req.body);
    if (error) return res.status(400).json({ error });

    const { value, ex } = await addReport(req.body);
    if (value) return res.status(201).json({ message: 'Report Created', Report: value });

    return res.status(500).json({ error: ex });
})

module.exports = route;