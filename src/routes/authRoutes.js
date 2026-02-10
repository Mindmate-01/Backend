const express = require('express');
const router = express.Router();
const {
    registerUser,
    loginUser,
    getMe,
} = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');

/**
 * @swagger
 * tags:
 *   name: Auth
 *   description: User authentication and identity
 */

/**
 * @swagger
 * /api/auth/register:
 *   post:
 *     summary: Register a new user
 *     tags: [Auth]
 *     security: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 description: User's email address
 *                 example: "student@example.edu.ng"
 *               password:
 *                 type: string
 *                 format: password
 *                 minLength: 6
 *                 description: Password (min 6 characters)
 *                 example: "securePassword123"
 *     responses:
 *       201:
 *         description: User registered successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 _id:
 *                   type: string
 *                 email:
 *                   type: string
 *                 pseudonymId:
 *                   type: string
 *                   description: Anonymous identifier used in chats
 *                 token:
 *                   type: string
 *                   description: JWT authentication token
 *       400:
 *         description: Invalid input or user already exists
 */
router.post('/register', registerUser);

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: Login user
 *     tags: [Auth]
 *     security: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 description: User's email address
 *                 example: "student@example.edu.ng"
 *               password:
 *                 type: string
 *                 format: password
 *                 description: User's password
 *                 example: "securePassword123"
 *     responses:
 *       200:
 *         description: Login successful
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 _id:
 *                   type: string
 *                 email:
 *                   type: string
 *                 pseudonymId:
 *                   type: string
 *                 token:
 *                   type: string
 *                   description: JWT authentication token
 *       401:
 *         description: Invalid credentials
 */
router.post('/login', loginUser);

/**
 * @swagger
 * /api/auth/me:
 *   get:
 *     summary: Get current logged in user's profile
 *     tags: [Auth]
 *     responses:
 *       200:
 *         description: User profile data
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 _id:
 *                   type: string
 *                 email:
 *                   type: string
 *                 pseudonymId:
 *                   type: string
 *                 createdAt:
 *                   type: string
 *                   format: date-time
 *       401:
 *         description: Not authorized
 */
router.get('/me', protect, getMe);

module.exports = router;
