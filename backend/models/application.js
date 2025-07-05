const mongoose = require('mongoose')
const { Schema, model } = mongoose

const applicationSchema = new Schema({
    job: {
        type: Schema.Types.ObjectId,
        ref: 'Job'
    },

    applicant: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },

    applicantContact: {
        ph: String,
        email: {
            type: String,
            require: true
        },
        address: String,
    },

    resume: {
        type: String,
        required: true
    },

    rsnToApply: String,

    applicantSkills: [{
        type: String
    }],

    status: String,

    time: {
        type: Date,
        default: Date.now()
    }
})


module.exports = model('Application', applicationSchema)