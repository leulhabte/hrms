const express = require('express');
const route = express.Router();
const {authApplicant} = require('../middleware/auth');
const { validateForm, addForm, getFormByDepartment } = require('../model/cvForm');
const {User} = require('../model/user');

route.get('/getFormsbyDep',authApplicant, async (req, res)=>{
    const {value, ex} = await getFormByDepartment(req.query.dep);
    if(value) return res.status(200).json({cv_requirements: value});

    return res.status(200).json({error: ex})
});

route.post('/fillForm', authApplicant, async (req, res) => {
    const { error } = await validateForm(req.body);
    if (error) return res.status(400).json({ error });

    const { value, ex } = await addForm({...req.body, typeOf: req.user.role});
    if (value){
        const user = await User.findById(req.user.id);
        user.formFilled = value._id;
        const saveUser = await user.save();
        return res.status(201).json({message: 'Cv form submitted', cv: value, user, saveUser});
    }

    return res.status(400).json({ error: ex });
});

module.exports = route;