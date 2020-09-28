const express = require('express');
const route = express.Router();
const { authEmployee } = require('../middleware/auth');
const { Traning } = require('../model/traning');
const { Attendance, addWorkAttendance } = require('../model/attendance');
const { validateLeave, addLeaveRequest, Leave } = require('../model/leave');

route.post('/leavereq', authEmployee, async (req, res) => {
    const user = await Leave.findOne({user: req.user.id});
    if(user) return res.status(400).json({message: 'Leave request already sent and is in Pending state'})
    const { error } = validateLeave(req.body);
    if (error) return res.status(400).json({ error });

    const { value, ex } = await addLeaveRequest({ ...req.body, user: req.user.id });
    if (value) return res.status(201).json({ message: 'Request Send', request: value });

    return res.status(500).json({ error: ex });

});

route.get('/getTranings', authEmployee, async (req, res) => {
    const page = parseInt(req.query.page);
    const perPage = parseInt(req.query.perPage);
    const traning = await Traning.find().skip((page - 1) * perPage).limit(perPage);
    return res.status(200).json({ page, perPage, traning });
});

route.post('/attendance', authEmployee, async (req, res) => {
    if (req.query.is === 'checkIn') {
        const user = await Attendance.findOne({user: req.user.id});
        if(user) return res.status(400).json({message: 'already checked in'})
        const { value, ex } = await addWorkAttendance({ user: req.user.id });
        if (value) return res.status(200).json({ message: 'Checked In', at: value.checkIn });

        return res.status(500).json({ error: ex.message });
    }

    if (req.query.is === 'checkOut') {
        const user = await Attendance.findOne({user: req.user.id});
        if (user) {
            user.checkOut = Date.now();
            const saveTime = await user.save();
            return res.status(200).json({ message: 'Checked Out', at: saveTime.checkOut });
        }

        return res.status(400).json({ error: 'You must check in first' });
    }

    return res.status(400).json({ error: 'Invalid Parameter' });

});

module.exports = route;