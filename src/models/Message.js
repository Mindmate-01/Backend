const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
    sessionId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'ChatSession',
        required: true,
        index: true,
    },
    sender: {
        type: String,
        enum: ['user', 'ai', 'system'],
        required: true,
    },
    content: {
        type: String,
        required: true,
    },
    // For future use: Context retrieved by RAG for this specific message
    contextUsed: {
        type: String, // Stringified JSON or separate structure
    },
    // Risk assessment for this specific message
    riskScore: {
        type: Number,
        default: 0,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

module.exports = mongoose.model('Message', messageSchema);
