const mongoose = require('mongoose')
const { Schema, SchemaType, model } = mongoose

const jobSchema = new Schema({
    title: {
        type: String,
        required: true
    },

    tag: [{
        type: String,
        required: true,
        lowercase: true
    }],

    contact: {
        ph: Number,
        email: String
    },

    mode: {
        type: String,
        required: true
    },

    company: {
        name: {
            type: String,
            required: true
        },
        logo: {
            type: String,
        },
        address: {
            type: String,
            required: true
        }
    },

    profile: {
        type: String,
        required: true,
        lowercase: true
    },

    jobDtls: {
        type: String,
        required: true
    },

    package: {
        type: String,
        required: true
    },

    owner: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },

    skillRequirements: [{
        type: String,
        lowercase: true
    }],

    requireApplicants: Number,

    clicks: [{
        type: Schema.Types.ObjectId,
        ref: 'User'
    }],

    likes: [{
        type: Schema.Types.ObjectId,
        ref: 'User'
    }],

    applications: [{
        type: Schema.Types.ObjectId,
        ref: 'Application'
    }],

    applyStarts: {
        type: String,
        required: true
    },

    applyEnds: {
        type: String,
        required: true
    },

    time: {
        type: Date,
        default: Date.now()
    }

})


module.exports = model('Job', jobSchema)