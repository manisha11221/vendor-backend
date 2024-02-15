const mongoose = require('mongoose');

const jobSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    experience: {
        type: String,
        required: true
    },
    type: {
        type: String,
        enum: ['full time', 'part time', 'remote'],
        required: true
    },
    salary: {
        type: Number,
        required: true
    },
    compensationType: {
        type: String,
        required: true
    },
    city: {
        type: String,
        required: true
    },
    country: {
        type: String,
        required: true
    },
    workPeriod: {
        type: String,
        required: true
    },
    noticePeriod: {
        type: String,
        required: true
    },
    skills: [{
        type: String
    }]
});

const Job = mongoose.model('Job', jobSchema);

module.exports = Job;
