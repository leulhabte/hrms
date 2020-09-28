const mongoose = require('mongoose');
const Joi = require('joi');

const performanceSchema = mongoose.Schema({
    rating: {
        type: String,
        required: true
    },
    comment: {
        type: String
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'employee'
    }
});

const reportSchema = mongoose.Schema({
    subject: {
        type: String,
        required: true
    },
    report:{
        type: String,
        required: true
    },
});

const Performance = mongoose.model('performance', performanceSchema);
const Report = mongoose.model('report', reportSchema);

function validatePerformance(info) {
    const schema = Joi.object({
        rating: Joi.string().required(),
        comment: Joi.string(),
        user: Joi.string().required(),
    });

    return schema.validate(info);
}

function validateReport(reports) {
    const schema = Joi.object({
        subject: Joi.string().required(),
        report: Joi.string().required(),
    });

    return schema.validate(reports);
}

async function addReport(repo) {
    try {
        const insertReport = await Report(repo).save();
        return { value: insertReport, ex: null };
    } catch (ex) {
        return { value: null, ex: ex.message }
    }
}

async function addPerformanceRating(performance) {
    try {
        const insertPerformance = await Performance(performance).save();
        return { value: insertPerformance, ex: null };
    } catch (ex) {
        return { value: null, ex: ex.message }
    }
}

exports.Performance = Performance;
exports.Report = Report;
exports.validatePerformance = validatePerformance;
exports.addPerformanceRating = addPerformanceRating;
exports.addReport = addReport;
exports.validateReport = validateReport;