const express = require('express');
const route = express.Router();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { authAdmin } = require('../middleware/auth');
const { User, validateUser, addUser } = require('../model/user');
const { Employee } = require('../model/employee');

route.post('/register',authAdmin, async (req, res) => {
    const user = await User.findOne({ $and: [{ email: req.body.email }, { name: req.body.name }] });
    if (user) return res.status(400).json({ error: 'User already exists' });

    const { error } = validateUser(req.body);
    if (error) return res.status(400).json({ error: 'Invalid Input provided' });

    if(req.body.role === 'Admin') return res.status(400).json({error: 'Authorization error'})

    const generateSalt = await bcrypt.genSalt(10);
    const genHash = await bcrypt.hash(req.body.password, generateSalt);

    if (genHash) {
        const newUser = { ...req.body, password: genHash }
        const { value, ex } = await addUser(newUser);
        if (value) {
            const token = jwt.sign({ id: value._id, role: value.role, name: value.name }, process.env.Secrete);
            return res.status(200).json({ message: 'Registered', token, user: value });
        }

        return res.status(500).json({ error: ex });
    }
});

route.get('/getUsers', authAdmin, async (req, res) => {
    const page = parseInt(req.query.page);
    const perPage = parseInt(req.query.perPage);
    if (req.query.role === 'Employee') {
        const users = await Employee.find({ role: req.query.role }).skip((page - 1) * perPage).limit(perPage).sort({ name: 1 });
        if (users) return res.status(200).json({ page, perPage, users });
    }
    const users = await User.find({ $and: [{ role: 'Manager' }, { status: { $ne: 'Fired' } }] })
        .skip((page - 1) * perPage).limit(perPage).sort({ name: 1 });
    if (users) return res.status(200).json({ page, perPage, users });

    return res.status(400).json({ error: 'No users found' });
});

route.post('/promoteToManager', authAdmin, async (req, res) => { // Need Modification
    const user = await Employee.findById(req.query.id);
    if (user) {
        const newManager = {
            name: user.name,
            email: user.email,
            sex: user.sex,
            password: user.password,
            address: {
                city: user.address.city,
                country: user.address.country,
            },
            phone: user.phone,
            emergencyContactName: user.emergencyContactName,
            emergencyContact: user.emergencyContact,
            role: 'Manager',
            status: 'New Manager'
        }
        const { value, ex } = await addUser(newManager);
        if (value){
            const remove = await Employee.deleteOne({_id: req.query.id},{new: true})
            return res.status(200).json({ message: 'Promoted to Manager', New_user: value, Prev_User: remove });
        }

        return res.status(500).json({ error: ex });
    }
    return res.status(400).json({ error: 'User not found' });
});

route.delete('/removeUser', authAdmin, async (req, res) => { //Need Modification
    const user = await User.findById(req.query.id);
    user.status = 'Fired';
    const removeMan = await user.save();
    return res.status(200).json({ message: 'Manager removed', removed_Manager: removeMan });
});

module.exports = route;