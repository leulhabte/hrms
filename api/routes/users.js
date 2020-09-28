const express = require('express');
const route = express.Router();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { User, validateLogin } = require('../model/user');
const {Employee} = require('../model/employee');

route.post('/login', async (req, res) => {
    const { error } = validateLogin(req.body);
    if (error) return res.status(400).json({ error: 'Invalid Input' });

    const users = await User.findOne({ name: req.body.name });
    if (users) {
        const isMatched = await bcrypt.compare(req.body.password, users.password);
        if (isMatched) {
            const token = jwt.sign({ id: users._id, role: users.role, name: users.name }, process.env.Secrete);
            return res.status(200).json({ message: 'Logged In', token, user: users });
        }
        return res.status(400).json({ error: 'Invalid User name or password' });
    }

    const emp = await Employee.findOne({ name: req.body.name });
    if (emp) {
        const isMatched = await bcrypt.compare(req.body.password, emp.password);
        if (isMatched) {
            const token = jwt.sign({ id: emp._id, role: emp.role, name: emp.name }, 'myTokenSecreteKey');
            return res.status(200).json({ message: 'Logged In', token, user: emp });
        }
        return res.status(400).json({ error: 'Invalid User name or password' });
    }

    return res.status(400).json({ error: 'Invalid User name or password'});
});

module.exports = route;