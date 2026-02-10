const express = require('express');
const router = express.Router();
const { logMood, getMoodHistory } = require('../controllers/moodController');
const { protect } = require('../middleware/authMiddleware');

router.use(protect);

/**
 * @swagger
 * tags:
 *   name: Mood
 *   description: Wellness and mood tracking
 */

/**
 * @swagger
 * /api/mood:
 *   post:
 *     summary: Log a mood entry
 *     tags: [Mood]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - emotion
 *               - intensity
 *             properties:
 *               emotion:
 *                 type: string
 *                 description: The emotion being logged
 *                 example: "anxious"
 *               intensity:
 *                 type: number
 *                 minimum: 1
 *                 maximum: 10
 *                 description: Intensity of the emotion (1-10)
 *                 example: 7
 *               note:
 *                 type: string
 *                 description: Optional note about the mood
 *                 example: "Feeling stressed about exams"
 *     responses:
 *       201:
 *         description: Mood logged successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 _id:
 *                   type: string
 *                 pseudonymId:
 *                   type: string
 *                 emotion:
 *                   type: string
 *                 intensity:
 *                   type: number
 *                 note:
 *                   type: string
 *                 createdAt:
 *                   type: string
 *                   format: date-time
 *       400:
 *         description: Missing required fields
 *       401:
 *         description: Not authorized
 */
router.post('/', logMood);

/**
 * @swagger
 * /api/mood/history:
 *   get:
 *     summary: Get mood history for the authenticated user
 *     tags: [Mood]
 *     parameters:
 *       - in: query
 *         name: days
 *         schema:
 *           type: integer
 *           default: 30
 *         description: Number of days of history to retrieve
 *     responses:
 *       200:
 *         description: List of mood log entries
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   _id:
 *                     type: string
 *                   emotion:
 *                     type: string
 *                   intensity:
 *                     type: number
 *                   note:
 *                     type: string
 *                   createdAt:
 *                     type: string
 *                     format: date-time
 *       401:
 *         description: Not authorized
 */
router.get('/history', getMoodHistory);

module.exports = router;
