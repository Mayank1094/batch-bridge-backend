const mongoose = require('mongoose');

const noteSchema = new mongoose.Schema({
    subject: {
        type: String,
        required: true,
        enum: ['Data Communication', 'DBMS', 'Computer Graphics', 'Kannada', 'English', 'Hindi']
    },
    unit: {
        type: Number,
        required: true,
        min: 1,
        max: 4
    },
    fileUrl: {
        type: String,
        required: true
    },
    publicId: {
        type: String,
        required: true
    },
    isApproved: {
        type: Boolean,
        default: false
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Note', noteSchema);
