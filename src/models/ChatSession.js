const mongoose = require('mongoose');

const chatSessionSchema = new mongoose.Schema({
    pseudonymId: {
        type: String,
        required: true,
        index: true,
        // Not referencing User model directly to maintain logical separation
        // In a microservice architecture, this would just be a string ID
    },
    title: {
        type: String,
        default: 'New Conversation',
        maxlength: 100,
    },
    status: {
        type: String,
        enum: ['active', 'locked', 'archived', 'completed'],
        default: 'active',
    },
    crisisDetected: {
        type: Boolean,
        default: false,
    },
    // Summary or metadata about the session
    summary: {
        type: String,
    },
    startedAt: {
        type: Date,
        default: Date.now,
    },
    lastMessageAt: {
        type: Date,
        default: Date.now,
    },
});

module.exports = mongoose.model('ChatSession', chatSessionSchema);
