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
 *     requestBody:
 *       required: false
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *                 description: Optional title for the session
 *                 example: "How I'm feeling today"
 *     responses:
 *       201:
 *         description: Session created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 _id:
 *                   type: string
 *                 pseudonymId:
 *                   type: string
 *                 title:
 *                   type: string
 *                 status:
 *                   type: string
 *                   enum: [active, locked, archived, completed]
 *                 startedAt:
 *                   type: string
 *                   format: date-time
 *       401:
 *         description: Not authorized
 *       500:
 *         description: Server error
 */
router.post('/start', startSession);

/**
 * @swagger
 * /api/chat/sessions:
 *   get:
 *     summary: Get all sessions for the authenticated user
 *     tags: [Chat]
 *     responses:
 *       200:
 *         description: List of chat sessions sorted by last message date
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   _id:
 *                     type: string
 *                   title:
 *                     type: string
 *                   status:
 *                     type: string
 *                     enum: [active, locked, archived, completed]
 *                   lastMessageAt:
 *                     type: string
 *                     format: date-time
 *                   startedAt:
 *                     type: string
 *                     format: date-time
 *       401:
 *         description: Not authorized
 */
router.get('/sessions', getSessions);

/**
 * @swagger
 * /api/chat/session/{id}:
 *   get:
 *     summary: Get all messages for a session
 *     tags: [Chat]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The session ID
 *     responses:
 *       200:
 *         description: List of messages in the session
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   _id:
 *                     type: string
 *                   sessionId:
 *                     type: string
 *                   sender:
 *                     type: string
 *                     enum: [user, ai, system]
 *                   content:
 *                     type: string
 *                   createdAt:
 *                     type: string
 *                     format: date-time
 *       404:
 *         description: Session not found
 *       401:
 *         description: Not authorized
 */
router.get('/session/:id', getSessionMessages);

/**
 * @swagger
 * /api/chat/session/{id}:
 *   put:
 *     summary: Update session title
 *     tags: [Chat]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The session ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *             properties:
 *               title:
 *                 type: string
 *                 description: New title for the session
 *                 example: "Conversation about stress"
 *     responses:
 *       200:
 *         description: Session updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 _id:
 *                   type: string
 *                 title:
 *                   type: string
 *                 status:
 *                   type: string
 *       404:
 *         description: Session not found
 *       401:
 *         description: Not authorized
 */
router.put('/session/:id', updateSession);

/**
 * @swagger
 * /api/chat/session/{id}:
 *   delete:
 *     summary: Delete a session and all its messages
 *     tags: [Chat]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The session ID to delete
 *     responses:
 *       200:
 *         description: Session deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Session deleted successfully"
 *       404:
 *         description: Session not found
 *       401:
 *         description: Not authorized
 */
router.delete('/session/:id', deleteSession);

/**
 * @swagger
 * /api/chat/session/{id}/message:
 *   post:
 *     summary: Send a message and receive AI response
 *     tags: [Chat]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The session ID
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
 *                 description: The user's message
 *                 example: "I've been feeling anxious lately"
 *     responses:
 *       201:
 *         description: Message sent and AI response received
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 userMessage:
 *                   type: object
 *                   properties:
 *                     _id:
 *                       type: string
 *                     sender:
 *                       type: string
 *                       example: "user"
 *                     content:
 *                       type: string
 *                 aiMessage:
 *                   type: object
 *                   properties:
 *                     _id:
 *                       type: string
 *                     sender:
 *                       type: string
 *                       example: "ai"
 *                     content:
 *                       type: string
 *       404:
 *         description: Session not found or locked
 *       401:
 *         description: Not authorized
 */
router.post('/session/:id/message', sendMessage);

/**
 * @swagger
 * /api/chat/session/{id}/unlock:
 *   post:
 *     summary: Unlock a crisis-locked session (user confirms safety)
 *     tags: [Chat]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The session ID to unlock
 *     responses:
 *       200:
 *         description: Session unlocked successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 _id:
 *                   type: string
 *                 status:
 *                   type: string
 *                   example: "active"
 *                 crisisDetected:
 *                   type: boolean
 *                   example: false
 *       404:
 *         description: Session not found
 *       401:
 *         description: Not authorized
 */
router.post('/session/:id/unlock', unlockSession);

module.exports = router;
