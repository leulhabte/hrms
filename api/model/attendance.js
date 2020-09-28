const mongoose = require('mongoose');
const Joi = require('joi');

const attendanceSchema = mongoose.Schema({
    workDay: {
        type: Date,
        default: Date.now
    },
    checkIn: {
        type: Date,
        required: true,
        default: Date.now
    },
    checkOut: {
        type: Date
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'employee',
        required: true
    }
});

const Attendance = mongoose.model('attendance', attendanceSchema);

async function addWorkAttendance(attend) {
    try {
        const addAttendance = await Attendance(attend).save();
        return { value: addAttendance, ex: null };
    } catch (ex) {
        return { value: null, ex: ex }
    }
}

exports.Attendance = Attendance;
exports.addWorkAttendance = addWorkAttendance;