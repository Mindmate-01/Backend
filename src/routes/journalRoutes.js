const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const {
    createEntry,
    getEntries,
    getEntry,
    updateEntry,
    deleteEntry,
} = require('../controllers/journalController');

/**
 * @swagger
 * tags:
 *   name: Journal
 *   description: Personal journal entry management
 */

/**
 * @swagger
 * /api/journal:
 *   post:
 *     summary: Create a new journal entry
 *     tags: [Journal]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - content
 *             properties:
 *               title:
 *                 type: string
 *                 description: Title of the journal entry
 *                 example: "Reflecting on my week"
 *               content:
 *                 type: string
 *                 description: The journal entry content (required)
 *                 example: "Today was a good day. I managed to complete all my tasks..."
 *               mood:
 *                 type: string
 *                 enum: [happy, grateful, calm, anxious, sad, angry, hopeful, reflective]
 *                 description: Current mood associated with the entry
 *                 example: "grateful"
 *               tags:
 *                 type: array
 *                 items:
 *                   type: string
 *                 description: Tags for categorizing the entry
 *                 example: ["self-care", "gratitude"]
 *     responses:
 *       201:
 *         description: Journal entry created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/JournalEntry'
 *       400:
 *         description: Content is required
 *       401:
 *         description: Not authorized
 *       500:
 *         description: Server error
 */
router.post('/', protect, createEntry);

/**
 * @swagger
 * /api/journal:
 *   get:
 *     summary: Get all journal entries (paginated)
 *     tags: [Journal]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Page number
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 20
 *         description: Number of entries per page
 *     responses:
 *       200:
 *         description: Paginated list of journal entries
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 entries:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/JournalEntry'
 *                 pagination:
 *                   type: object
 *                   properties:
 *                     page:
 *                       type: integer
 *                     limit:
 *                       type: integer
 *                     total:
 *                       type: integer
 *                     pages:
 *                       type: integer
 *       401:
 *         description: Not authorized
 */
router.get('/', protect, getEntries);

/**
 * @swagger
 * /api/journal/{id}:
 *   get:
 *     summary: Get a single journal entry by ID
 *     tags: [Journal]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The journal entry ID
 *     responses:
 *       200:
 *         description: The journal entry
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/JournalEntry'
 *       404:
 *         description: Entry not found
 *       401:
 *         description: Not authorized
 */
router.get('/:id', protect, getEntry);

/**
 * @swagger
 * /api/journal/{id}:
 *   put:
 *     summary: Update a journal entry
 *     tags: [Journal]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The journal entry ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *                 example: "Updated title"
 *               content:
 *                 type: string
 *                 example: "Updated journal content..."
 *               mood:
 *                 type: string
 *                 enum: [happy, grateful, calm, anxious, sad, angry, hopeful, reflective]
 *               tags:
 *                 type: array
 *                 items:
 *                   type: string
 *     responses:
 *       200:
 *         description: Entry updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/JournalEntry'
 *       404:
 *         description: Entry not found
 *       401:
 *         description: Not authorized
 */
router.put('/:id', protect, updateEntry);

/**
 * @swagger
 * /api/journal/{id}:
 *   delete:
 *     summary: Delete a journal entry
 *     tags: [Journal]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The journal entry ID to delete
 *     responses:
 *       200:
 *         description: Entry deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Entry deleted successfully"
 *       404:
 *         description: Entry not found
 *       401:
 *         description: Not authorized
 */
router.delete('/:id', protect, deleteEntry);

module.exports = router;
