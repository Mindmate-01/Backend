const express = require('express');
const router = express.Router();
const {
    startSession,
    getSessions,
    getSessionMessages,
    sendMessage,
    unlockSession,
    deleteSession,
    updateSession
} = require('../controllers/chatController');
const { protect } = require('../middleware/authMiddleware');

router.use(protect); // All chat routes are protected

/**
 * @swagger
 * tags:
 *   name: Chat
 *   description: Conversation management and messaging
 */

/**
 * @swagger
 * /api/chat/start:
 *   post:
 *     summary: Start a new chat session
 *     tags: [Chat]
 *     responses:
 *       201:
 *         description: Session created
 */
router.post('/start', startSession);

/**
 * @swagger
 * /api/chat/sessions:
 *   get:
 *     summary: Get all sessions for the user
 *     tags: [Chat]
 *     responses:
 *       200:
 *         description: List of sessions
 */
router.get('/sessions', getSessions);

/**
 * @swagger
 * /api/chat/session/{id}:
 *   get:
 *     summary: Get messages for a session
 *     tags: [Chat]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: List of messages
 */
router.get('/session/:id', getSessionMessages);

/**
 * @swagger
 * /api/chat/session/{id}:
 *   put:
 *     summary: Update session title
 *     tags: [Chat]
 */
router.put('/session/:id', updateSession);

/**
 * @swagger
 * /api/chat/session/{id}:
 *   delete:
 *     summary: Delete a session and its messages
 *     tags: [Chat]
 */
router.delete('/session/:id', deleteSession);

/**
 * @swagger
 * /api/chat/session/{id}/message:
 *   post:
 *     summary: Send a message
 *     tags: [Chat]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - content
 *             properties:
 *               content:
 *                 type: string
 *     responses:
 *       201:
 *         description: Message sent with AI response
 */
router.post('/session/:id/message', sendMessage);

/**
 * @swagger
 * /api/chat/session/{id}/unlock:
 *   post:
 *     summary: Unlock a session (User confirms safety)
 *     tags: [Chat]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Session unlocked
 */
router.post('/session/:id/unlock', unlockSession);

module.exports = router;

