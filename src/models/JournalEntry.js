const mongoose = require('mongoose');

const journalEntrySchema = new mongoose.Schema({
    pseudonymId: {
        type: String,
        required: true,
        index: true,
    },
    title: {
        type: String,
        default: 'Untitled Entry',
        maxlength: 200,
    },
    content: {
        type: String,
        required: [true, 'Journal content is required'],
        maxlength: 10000,
    },
    mood: {
        type: String,
        enum: ['happy', 'grateful', 'calm', 'anxious', 'sad', 'angry', 'hopeful', 'reflective', null],
        default: null,
    },
    tags: [{
        type: String,
        maxlength: 50,
    }],
}, {
    timestamps: true, // Adds createdAt and updatedAt
});

// Index for efficient querying by user and date
journalEntrySchema.index({ pseudonymId: 1, createdAt: -1 });

module.exports = mongoose.model('JournalEntry', journalEntrySchema);
