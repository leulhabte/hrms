const mongoose = require('mongoose');
const Joi = require('joi');

const instructor = mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    sex: {
        type: String,
        enum: ['Male', 'Female', 'M', 'F'],
        required: true
    },
    email: {
        type: String,
        required: true
    },
    phone: {
        type: String,
        required: true
    }
})

const traningSchema = mongoose.Schema({
    courseName:{
        type: String,
        required: true
    },
    courseType:{
        type: String,
        required: true
    },
    courseCategory:{
        type: String,
        required: true
    },
    courseDescription:{
        type: String,
        required: true
    },
    courseInstructor:{
        type: instructor,
        required: true
    },
});

const Traning = mongoose.model('traning', traningSchema);

function validateTraning(form) {
    const schema = Joi.object({
        courseName: Joi.string().required(),  
        courseType: Joi.string().required(),  
        courseCategory: Joi.string().required(),  
        courseDescription: Joi.string().required(),  
        courseInstructor: {
            name: Joi.string().required(),
            sex: Joi.string().valid('Male', 'Female', 'M', 'F').required(),
            email: Joi.string().required(),
            phone: Joi.string().required(),
        }
    });

    return schema.validate(form);
}

async function addTraning(train) {
    try {
        const add = await Traning(train).save();
        return { value: add, ex: null };
    } catch (ex) {
        return { value: null, ex: ex.message };
    }
}

exports.Traning = Traning;
exports.addTraning = addTraning;
exports.validateTraning = validateTraning;