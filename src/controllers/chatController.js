const ChatSession = require('../models/ChatSession');
const Message = require('../models/Message');

// ML Chatbot API URL
const ML_CHATBOT_URL = 'https://rayppp.onrender.com/';
const MAX_RETRIES = 3;
const RETRY_DELAY_MS = 2000;

// Helper function to delay
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// Helper function to call ML chatbot with retry
async function getAIResponse(userMessage, sessionHistory = []) {
    let lastError;

    for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
        try {
            console.log(`ML Chatbot attempt ${attempt}/${MAX_RETRIES}...`);

            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 30000); // 30s timeout

            const response = await fetch(ML_CHATBOT_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    message: userMessage,
                    history: sessionHistory,
                }),
                signal: controller.signal,
            });

            clearTimeout(timeoutId);

            if (!response.ok) {
                throw new Error(`ML service returned ${response.status}`);
            }

            const data = await response.json();
            console.log('ML Chatbot response received successfully');
            return data.response || data.message || data.reply || "I'm here to listen. Could you tell me more?";
        } catch (error) {
            lastError = error;
            console.error(`ML Chatbot attempt ${attempt} failed:`, error.message);

            if (attempt < MAX_RETRIES) {
                console.log(`Retrying in ${RETRY_DELAY_MS * attempt}ms...`);
                await delay(RETRY_DELAY_MS * attempt); // Exponential backoff
            }
        }
    }

    console.error('ML Chatbot all retries failed:', lastError);
    // Fallback response if ML service fails after all retries
    return "I hear you. Sometimes it helps to just express what we're feeling. I'm here to listen whenever you're ready to share more.";
}

// @desc    Start a new chat session
// @route   POST /api/chat/start
// @access  Private
exports.startSession = async (req, res) => {
    try {
        const title = req.body?.title || 'New Conversation';

        if (!req.user || !req.user.pseudonymId) {
            console.error('startSession: User not authenticated properly', req.user);
            return res.status(401).json({ message: 'User not authenticated' });
        }

        const session = await ChatSession.create({
            pseudonymId: req.user.pseudonymId,
            title: title || 'New Conversation',
        });

        // Create an initial system greeting
        await Message.create({
            sessionId: session._id,
            sender: 'system',
            content: 'Welcome to MindMate. How are you feeling today? (This is a safe space)',
        });

        res.status(201).json(session);
    } catch (error) {
        console.error('startSession error:', error);
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get all sessions for a user
// @route   GET /api/chat/sessions
// @access  Private
exports.getSessions = async (req, res) => {
    try {
        const sessions = await ChatSession.find({
            pseudonymId: req.user.pseudonymId,
        }).sort({ lastMessageAt: -1 });

        res.status(200).json(sessions);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get specifics session messages
// @route   GET /api/chat/session/:id
// @access  Private
exports.getSessionMessages = async (req, res) => {
    try {
        const session = await ChatSession.findById(req.params.id);

        if (!session) {
            return res.status(404).json({ message: 'Session not found' });
        }

        // Verify ownership via pseudonym
        if (session.pseudonymId !== req.user.pseudonymId) {
            return res.status(401).json({ message: 'Not authorized to access this session' });
        }

        const messages = await Message.find({ sessionId: req.params.id }).sort({ createdAt: 1 });

        res.status(200).json(messages);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Send a message
// @route   POST /api/chat/session/:id/message
// @access  Private
exports.sendMessage = async (req, res) => {
    const { content } = req.body;
    const sessionId = req.params.id;
    const { detectCrisis } = require('../services/crisisService');

    try {
        const session = await ChatSession.findById(sessionId);

        if (!session) {
            return res.status(404).json({ message: 'Session not found' });
        }

        // Verify ownership
        if (session.pseudonymId !== req.user.pseudonymId) {
            return res.status(401).json({ message: 'Not authorized' });
        }

        if (session.status === 'locked') {
            return res.status(403).json({ message: 'This session is locked due to safety concerns. Please contact emergency services.' });
        }

        // 0. Safety Check (Circuit Breaker)
        const safetyCheck = detectCrisis(content);

        if (safetyCheck.isCrisis) {
            // LOCK SESSION
            session.status = 'locked';
            session.crisisDetected = true;
            session.lastMessageAt = Date.now();
            await session.save();

            // Save User Message (flagged high risk)
            const userMessage = await Message.create({
                sessionId,
                sender: 'user',
                content,
                riskScore: 100, // Max risk
            });

            // Save System Safety Message
            const safetyMessage = await Message.create({
                sessionId,
                sender: 'system',
                content: safetyCheck.safetyMessage,
            });

            return res.status(200).json({
                userMessage,
                aiMessage: safetyMessage,
                isLocked: true
            });
        }

        // 1. Save User Message
        const userMessage = await Message.create({
            sessionId,
            sender: 'user',
            content,
        });

        // Update session timestamp and title (from first message)
        session.lastMessageAt = Date.now();
        if (session.title === 'New Conversation') {
            // Auto-generate title from first user message
            session.title = content.slice(0, 50) + (content.length > 50 ? '...' : '');
        }
        await session.save();

        // 2. Get AI Response from ML Chatbot
        // Build session history for context
        const recentMessages = await Message.find({ sessionId })
            .sort({ createdAt: -1 })
            .limit(10);

        const history = recentMessages.reverse().map(m => ({
            role: m.sender === 'user' ? 'user' : 'assistant',
            content: m.content
        }));

        const aiResponseContent = await getAIResponse(content, history);

        const aiMessage = await Message.create({
            sessionId,
            sender: 'ai',
            content: aiResponseContent,
        });

        res.status(201).json({ userMessage, aiMessage });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Unlock a session
// @route   POST /api/chat/session/:id/unlock
// @access  Private
exports.unlockSession = async (req, res) => {
    try {
        const { id } = req.params;
        const session = await ChatSession.findOne({ _id: id, pseudonymId: req.user.pseudonymId });

        if (!session) {
            return res.status(404).json({ message: 'Session not found' });
        }

        session.status = 'active';
        session.crisisDetected = false;
        await session.save();

        res.json(session);
    } catch (error) {
        console.error("Error unlocking session:", error);
        res.status(500).json({ message: 'Server error' });
    }
};

// @desc    Delete a session
// @route   DELETE /api/chat/session/:id
// @access  Private
exports.deleteSession = async (req, res) => {
    try {
        const { id } = req.params;
        const session = await ChatSession.findOne({ _id: id, pseudonymId: req.user.pseudonymId });

        if (!session) {
            return res.status(404).json({ message: 'Session not found' });
        }

        // Delete all messages in the session
        await Message.deleteMany({ sessionId: id });

        // Delete the session
        await session.deleteOne();

        res.json({ message: 'Session deleted successfully' });
    } catch (error) {
        console.error("Error deleting session:", error);
        res.status(500).json({ message: 'Server error' });
    }
};

// @desc    Update session title
// @route   PUT /api/chat/session/:id
// @access  Private
exports.updateSession = async (req, res) => {
    try {
        const { id } = req.params;
        const { title } = req.body;

        const session = await ChatSession.findOne({ _id: id, pseudonymId: req.user.pseudonymId });

        if (!session) {
            return res.status(404).json({ message: 'Session not found' });
        }

        if (title) {
            session.title = title;
            await session.save();
        }

        res.json(session);
    } catch (error) {
        console.error("Error updating session:", error);
        res.status(500).json({ message: 'Server error' });
    }
};

