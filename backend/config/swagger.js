const swaggerJsdoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'WanderLog API',
      version: '1.0.0',
      description: 'Travel Journal & Trip Planner REST API',
    },
    servers: [{ url: '/api' }],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
      schemas: {
        User: {
          type: 'object',
          properties: {
            _id: { type: 'string' },
            name: { type: 'string' },
            email: { type: 'string' },
            role: { type: 'string', enum: ['guest', 'user', 'admin'] },
            createdAt: { type: 'string', format: 'date-time' },
          },
        },
        Trip: {
          type: 'object',
          properties: {
            _id: { type: 'string' },
            title: { type: 'string' },
            destination: { type: 'string' },
            startDate: { type: 'string', format: 'date' },
            endDate: { type: 'string', format: 'date' },
            description: { type: 'string' },
            status: { type: 'string', enum: ['planned', 'ongoing', 'completed'] },
            userId: { type: 'string' },
          },
        },
        Review: {
          type: 'object',
          properties: {
            _id: { type: 'string' },
            rating: { type: 'integer', minimum: 1, maximum: 5 },
            comment: { type: 'string' },
            userId: { type: 'string' },
            tripId: { type: 'string' },
          },
        },
      },
    },
  },
  apis: ['./routes/*.js'],
};

module.exports = swaggerJsdoc(options);
