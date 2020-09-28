const mongoose = require('mongoose');
const Joi = require('joi');


const userSchema = mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true
    },
    sex:{
        type: String,
        enum: ['Male', 'Female', 'M', 'F'],
        required: true
    },
    password: {
        type: String,
        required: true
    },
    address: {
        type: {
            city: {type: String, required: true},
            country: {type: String, required: true}
        },
        required: true
    },
    phone: {
        type: String,
        required: true
    },
    emergencyContactName: {
        type: String,
        required: true
    },
    emergencyContact: {
        type: String,
        required: true
    },
    role:{
        type: String,
        enum: ['Admin', 'Manager', 'Applicant']
    },
    formFilled: {
        type: mongoose.Schema.Types.ObjectId,
        validate: {
            validator: function (v) {
                return this.role === 'Applicant';
            },
            message: 'You are not an applicant'
        },
        ref: 'cvform'
    },
    status:{
        type: String,
        validate: {
            validator: function (v) {
                return this.role === 'Manager'
            },
            message: 'You are not a manager'
        }
    }
});

const User = mongoose.model('users', userSchema);

function validateUser(user){
    console.log(user);
    const schema = Joi.object({
        name: Joi.string().min(4).required(),
        email: Joi.string().required(),
        sex: Joi.string().valid('Male', 'Female', 'M', 'F').required(),
        password: Joi.string().min(4).required(),
        repeatPassword: Joi.ref('password'),
        address: {
            city: Joi.string().required(),
            country: Joi.string().required()
        },
        phone: Joi.string().required(),
        emergencyContactName: Joi.string().required(),
        emergencyContact: Joi.string().required(),
        role: Joi.string().valid('Admin', 'Manager', 'Applicant').required(),
    });
    return schema.validate(user);
}

function validateLogin(user){
    console.log(user);
    const schema = Joi.object({
        name: Joi.string().min(4).required(),
        password: Joi.string().min(4).required()
    });
    console.log('validated..')
    return schema.validate(user);
}

async function addUser(newUser) {
    try {
        const insertUser = await User(newUser).save();
        return {value: insertUser, ex: null};
    } catch (ex) {
        return {value: null, ex: ex}
    }
}

exports.User = User;
exports.addUser = addUser;
exports.validateLogin = validateLogin;
exports.validateUser = validateUser;