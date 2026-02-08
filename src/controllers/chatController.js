const ChatSession = require('../models/ChatSession');
const Message = require('../models/Message');

// @desc    Start a new chat session
// @route   POST /api/chat/start
// @access  Private
exports.startSession = async (req, res) => {
    try {
        const session = await ChatSession.create({
            pseudonymId: req.user.pseudonymId, // Use pseudonym!
        });

        // Create an initial system greeting
        await Message.create({
            sessionId: session._id,
            sender: 'system',
            content: 'Welcome to MindMate. How are you feeling today_ (This is a safe space)',
        });

        res.status(201).json(session);
    } catch (error) {
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
                aiMessage: safetyMessage, // Return as 'aiMessage' for frontend compatibility
                isLocked: true
            });
        }

        // 1. Save User Message
        const userMessage = await Message.create({
            sessionId,
            sender: 'user',
            content,
        });

        // Update session timestamp
        session.lastMessageAt = Date.now();
        await session.save();

        // 2. Mock AI Response (Placeholder)
        // In future: Call AI service here
        const aiResponseContent = `(AI Stub) I hear you saying: "${content}". I am listening.`;

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
