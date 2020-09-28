const mongoose = require('mongoose');
const Joi = require('joi');

const leaveSchema = mongoose.Schema({
    typesOfLeave: {
        type: String,
        enum: ["maternity leave", "paternity leave", "sick leave", "personal leave", "bereavement leave"],
        required: true
    },
    dayOfLeave: {
        type: Number,
        required: true
    },
    additionalLeave:{
        type: String,
    },
    leaveStatus: {
        type: String,
        enum: ["Pending", "Accepted", "Rejected"],
        default: "Pending"
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'employee'
    },
    seen: {
        type: Number,
        default: 0
    },
    insertedAt: {
        type: Date,
        default: Date.now
    }
});

const Leave = mongoose.model('leave', leaveSchema);

function validateLeave(request) {
    const schema = Joi.object({
        typesOfLeave: Joi.string().valid("maternity leave", "paternity leave", "sick leave", "personal leave", "bereavement leave").required(),
        dayOfLeave: Joi.number().required(),
        additionalLeave: Joi.string(),
    });

    return schema.validate(request);
}

async function addLeaveRequest(request) {
    try {
        const addRequest = await Leave(request).save();
        return { value: addRequest, ex: null };
    } catch (ex) {
        return { value: null, ex: ex.messasge }
    }
}

exports.Leave = Leave;
exports.validateLeave = validateLeave;
exports.addLeaveRequest = addLeaveRequest;

