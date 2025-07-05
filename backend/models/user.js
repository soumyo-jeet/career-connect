const mongoose = require('mongoose')
const { Schema, SchemaType, model } = mongoose

const userSchema = new Schema({
    name: {
        type: String,
        required: true
    },

    email: {
        type: String,
        required: true
    },

    password: {
        type: String,
        required: true
    },

    skills: [{
        type: String,
        lowercase: true
    }],

    interests: [{
        type: String,
        lowercase: true
    }],

    prof: String,

    worksAt: String,

    experience: Number,

    jobsCreated: [{
        type: Schema.Types.ObjectId,
        ref: 'Job'
    }],

    jobsApplied: [{
        type: Schema.Types.ObjectId,
        ref: 'Job'
    }],

    jobsSelected: [{
        type: Schema.Types.ObjectId,
        ref: 'Application'
    }],

    jobsRejected: [{
        type: Schema.Types.ObjectId,
        ref: 'Application'
    }],

    inbox: [{
        msg: String,
        time: {
            type: Date,
            default: Date.now()
        },
        tone: String
    }]
})


module.exports = model('User' , userSchema)