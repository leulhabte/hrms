const express = require('express');
const route = express.Router();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { authManager } = require('../middleware/auth');
const { User } = require('../model/user');
const { Employee, validateUser, addUser } = require('../model/employee');
const { validateForm, addForm } = require('../model/cvForm');
const {validateTraning, addTraning, Traning} = require('../model/traning');
const {validatePerformance, addPerformanceRating, Performance} = require('../model/performance');

route.post('/register', authManager, async (req, res) => {
    const user = await Employee.findOne({ $and: [{ email: req.body.email }, { name: req.body.name }] });
    if (user) return res.status(400).json({ error: 'User already exists' });

    if (req.body.role === 'Admin' || req.body.role === 'Manager') return res.status(401).json({ error: 'Authorization error' });

    const { error } = validateUser(req.body);
    if (error) return res.status(400).json({ error: 'Invalid Input provided' });

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

route.post('/hireApplicants', authManager, async (req, res) => {
    const applicant = await User.findById(req.query.id).populate('formFilled', 'department');
    if (!applicant) return res.status(400).json({ error: "Applicant not found" });

    if (req.query.is === 'yes') {
        const newEmp = {
            name: applicant.name,
            email: applicant.email,
            sex: applicant.sex,
            password: applicant.password,
            address: {
                city: applicant.address.city,
                country: applicant.address.country,
            },
            phone: applicant.phone,
            emergencyContactName: applicant.emergencyContactName,
            emergencyContact: applicant.emergencyContact,
            department: applicant.formFilled.department
        }

        const { value, ex } = await addUser(newEmp);
        if (value) {
            const user = await User.remove({ _id: req.query.id });
            if (user.deletedCount > 0) {
                return res.status(200).json({ message: 'Applicant Hired', New_Emp: value });
            }
        }

        return res.status(500).json({ error: ex });
    }

    const user = await User.remove({ _id: req.query.id });
    if (user.deletedCount > 0) {
        return res.status(200).json({ message: 'Applicant Form Declined'});
    }

});

route.get('/getApplicants', authManager, async (req, res) => {
    const page = parseInt(req.query.page);
    const perPage = parseInt(req.query.perPage);
    const users = await User.find({ role: 'Applicant' }).populate('formFilled').skip((page - 1) * perPage).limit(perPage).sort({ name: 1 });
    if (users) return res.status(200).json({ page, perPage, users });

    return res.status(400).json({ error: 'No users found' });
});

route.get('/getEmployee', authManager, async (req, res) => {
    const page = parseInt(req.query.page);
    const perPage = parseInt(req.query.perPage);
    const users = await Employee.find({role: 'Employee'}).skip((page - 1) * perPage).limit(perPage).sort({ name: 1 });
    if (users) return res.status(200).json({ page, perPage, users });

    return res.status(400).json({ error: 'No users found' });
});

route.delete('/removeUser', authManager, async (req, res) => {
    const user = await Employee.findById(req.query.id);
    user.role = 'Fired';
    const removeEmp = await user.save();
    return res.status(200).json({ message: 'Employee removed', removed_Employee: removeEmp });
});

route.post('/fillForm', authManager, async (req, res) => {
    const { error } = await validateForm(req.body);
    if (error) return res.status(400).json({ error });

    const { value, ex } = await addForm(req.body);
    if (value) return res.status(200).json({ message: 'Form Added', form: value });

    return res.status(400).json({ error: ex });
});

route.post('/ratePerformance', authManager, async (req, res)=>{
    const user = await Performance.findOne({user: req.query.id});
    if(user){
        const {error} = await validatePerformance({...req.body, user: req.query.id});
        if(error) return res.status(400).json({error});

        user.rating = req.body.rating;
        if(req.comment){
            user.comment = req.comment;
        }
        const saveRating = await user.save();
        return res.status(200).json({message: 'Performance Rated', user: saveRating});
    }

    const {error} = validatePerformance({...req.body, user: req.query.id});
    if(error) return res.status(400).json({error});

    const {value, ex} = await addPerformanceRating({...req.body, user: req.query.id});
    if(value) return res.status(201).json({message: 'Performance Rated', user: value});

    return res.status(500).json({error: ex});
});

route.post('/createTraining',authManager, async (req, res)=>{
    const {error} = validateTraning(req.body);
    if(error) return res.status(400).json({error});

    const {value, ex} = await addTraning(req.body);
    if(value) return res.status(201).json({message: 'Traning Added', traning: value});

    return res.status(500).json({error: ex});
});

route.get('/getTranings',authManager , async (req, res)=>{
    const page = parseInt(req.query.page);
    const perPage = parseInt(req.query.perPage);
    const traning = await Traning.find().skip((page - 1) * perPage).limit(perPage);
    return res.status(200).json({page, perPage, traning});
});

module.exports = route;