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
 *               intensity:
 *                 type: number
 *               note:
 *                 type: string
 *     responses:
 *       201:
 *         description: Mood logged
 */
router.post('/', logMood);

/**
 * @swagger
 * /api/mood/history:
 *   get:
 *     summary: Get mood history
 *     tags: [Mood]
 *     responses:
 *       200:
 *         description: List of mood logs
 */
router.get('/history', getMoodHistory);

module.exports = router;
