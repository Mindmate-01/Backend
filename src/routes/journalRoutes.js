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
 * /api/journal:
 *   post:
 *     summary: Create a new journal entry
 *     tags: [Journal]
 *     security:
 *       - bearerAuth: []
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
 */
router.get('/', protect, getEntries);

/**
 * @swagger
 * /api/journal/:id:
 *   get:
 *     summary: Get a single journal entry
 *     tags: [Journal]
 *     security:
 *       - bearerAuth: []
 */
router.get('/:id', protect, getEntry);

/**
 * @swagger
 * /api/journal/:id:
 *   put:
 *     summary: Update a journal entry
 *     tags: [Journal]
 *     security:
 *       - bearerAuth: []
 */
router.put('/:id', protect, updateEntry);

/**
 * @swagger
 * /api/journal/:id:
 *   delete:
 *     summary: Delete a journal entry
 *     tags: [Journal]
 *     security:
 *       - bearerAuth: []
 */
router.delete('/:id', protect, deleteEntry);

module.exports = router;
