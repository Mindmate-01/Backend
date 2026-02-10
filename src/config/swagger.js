const swaggerJsdoc = require('swagger-jsdoc');

const options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'MindMate API',
            version: '1.0.0',
            description: 'Safety-critical AI mental health companion API. Provides anonymous chat sessions with AI, mood tracking, and journal management for university students.',
            contact: {
                name: 'MindMate Team',
            },
        },
        servers: [
            {
                url: process.env.NODE_ENV === 'production'
                    ? (process.env.RENDER_EXTERNAL_URL || 'https://mindmate-backend.onrender.com')
                    : 'http://localhost:5000',
                description: process.env.NODE_ENV === 'production' ? 'Production server' : 'Development server',
            },
        ],
        components: {
            securitySchemes: {
                bearerAuth: {
                    type: 'http',
                    scheme: 'bearer',
                    bearerFormat: 'JWT',
                    description: 'Enter your JWT token obtained from /api/auth/login or /api/auth/register',
                },
            },
            schemas: {
                JournalEntry: {
                    type: 'object',
                    properties: {
                        _id: {
                            type: 'string',
                            description: 'Entry ID',
                        },
                        pseudonymId: {
                            type: 'string',
                            description: 'Anonymous user identifier',
                        },
                        title: {
                            type: 'string',
                            description: 'Entry title',
                            example: 'Reflecting on my week',
                        },
                        content: {
                            type: 'string',
                            description: 'Entry content',
                            example: 'Today was a good day...',
                        },
                        mood: {
                            type: 'string',
                            enum: ['happy', 'grateful', 'calm', 'anxious', 'sad', 'angry', 'hopeful', 'reflective'],
                            description: 'Mood associated with entry',
                        },
                        tags: {
                            type: 'array',
                            items: { type: 'string' },
                            description: 'Tags for categorization',
                        },
                        createdAt: {
                            type: 'string',
                            format: 'date-time',
                        },
                        updatedAt: {
                            type: 'string',
                            format: 'date-time',
                        },
                    },
                },
                ChatSession: {
                    type: 'object',
                    properties: {
                        _id: {
                            type: 'string',
                        },
                        pseudonymId: {
                            type: 'string',
                        },
                        title: {
                            type: 'string',
                            example: 'New Conversation',
                        },
                        status: {
                            type: 'string',
                            enum: ['active', 'locked', 'archived', 'completed'],
                        },
                        crisisDetected: {
                            type: 'boolean',
                        },
                        lastMessageAt: {
                            type: 'string',
                            format: 'date-time',
                        },
                        startedAt: {
                            type: 'string',
                            format: 'date-time',
                        },
                    },
                },
                Message: {
                    type: 'object',
                    properties: {
                        _id: {
                            type: 'string',
                        },
                        sessionId: {
                            type: 'string',
                        },
                        sender: {
                            type: 'string',
                            enum: ['user', 'ai', 'system'],
                        },
                        content: {
                            type: 'string',
                        },
                        createdAt: {
                            type: 'string',
                            format: 'date-time',
                        },
                    },
                },
            },
        },
        security: [
            {
                bearerAuth: [],
            },
        ],
    },
    apis: ['./src/routes/*.js'],
};

const specs = swaggerJsdoc(options);

module.exports = specs;
