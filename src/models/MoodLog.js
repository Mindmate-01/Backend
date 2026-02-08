const mongoose = require('mongoose');

const moodLogSchema = new mongoose.Schema({
    pseudonymId: {
        type: String,
        required: true,
        index: true,
    },
    emotion: {
        type: String,
        enum: ['happy', 'sad', 'anxious', 'angry', 'neutral', 'stressed', 'excited'],
        required: true,
    },
    intensity: {
        type: Number,
        min: 1,
        max: 10,
        required: true,
    },
    note: {
        type: String,
        maxlength: 500,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

module.exports = mongoose.model('MoodLog', moodLogSchema);
