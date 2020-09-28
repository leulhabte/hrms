const mongoose = require('mongoose');
const Joi = require('joi');

const cvFormSchema = mongoose.Schema({
    areaOfKnowladge: {
        type: String,
        required: true
    },
    fieldOfStudy: {
        type: String,
        required: true
    },
    yearsOfExperiance: {
        type: String,
        required: true
    },
    institueOfEducation: {
        type: String,
        required: true
    },
    department: {
        type: String,
        required: true
    },
    typeOf:{
        type: String,
        enum: ['Req', 'Applicant'],
        default: 'Req'
    }
});

const Cv = mongoose.model('cvform', cvFormSchema);

function validateForm(form) {
    const schema = Joi.object({
        areaOfKnowladge: Joi.string().required(),
        fieldOfStudy: Joi.string().required(),
        yearsOfExperiance: Joi.string().required(),
        institueOfEducation: Joi.string().required(),
        department: Joi.string().required(),
    });

    return schema.validate(form);
}

async function addForm(form) {
    try {
        const insertForm = await Cv(form).save();
        return { value: insertForm, ex: null };
    } catch (ex) {
        return { value: null, ex: ex };
    }
}

async function getForm() {
    try {
        const getForms = await Cv.find();
        if (getForms.length === 0) return { value: null, ex: 'No Cv form avialable' };
        return { value: getForms, ex: null };
    } catch (ex) {
        return { value: null, ex: ex };
    }
}

async function getFormByDepartment(department) {
    try {
        const getForms = await Cv.find({$and:[{department: department}, {typeOf: 'Req'}]});
        if (getForms.length === 0) return { value: null, ex: 'No Cv form avialable for this department' };
        return { value: getForms, ex: null };
    } catch (ex) {
        return { value: null, ex: ex.message };
    }
}

exports.Cv = Cv;
exports.addForm = addForm;
exports.getForm = getForm;
exports.validateForm = validateForm;
exports.getFormByDepartment = getFormByDepartment;