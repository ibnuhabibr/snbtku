import Fastify from 'fastify';
import cors from '@fastify/cors';
import helmet from '@fastify/helmet';
import rateLimit from '@fastify/rate-limit';
import jwt from '@fastify/jwt';
import swagger from '@fastify/swagger';
import swaggerUi from '@fastify/swagger-ui';
import { config } from 'dotenv';
import { checkDatabaseConnection } from './db/index';
import { authRoutes, userRoutes } from './routes/authRoutes';
import { tryoutRoutes } from './routes/tryoutRoutes';
import { adminRoutes } from './routes/adminRoutes';
import { rewardRoutes } from './routes/rewardRoutes';
import { questRoutes } from './routes/questRoutes';
import { shopRoutes } from './routes/shopRoutes';
import { socketService } from './services/socketService';

// Load environment variables
config();

const fastify = Fastify({
  logger: {
    level: process.env.LOG_LEVEL || 'info',
    transport: process.env.NODE_ENV === 'development' ? {
      target: 'pino-pretty',
      options: {
        translateTime: 'HH:MM:ss Z',
        ignore: 'pid,hostname',
      },
    } : undefined,
  },
});

// Register plugins
await fastify.register(helmet, {
  contentSecurityPolicy: false,
});

await fastify.register(cors, {
  origin: process.env.CORS_ORIGIN?.split(',') || ['http://localhost:8080'],
  credentials: true,
});

await fastify.register(rateLimit, {
  max: parseInt(process.env.RATE_LIMIT_MAX || '100'),
  timeWindow: parseInt(process.env.RATE_LIMIT_WINDOW || '60000'),
});

await fastify.register(jwt, {
  secret: process.env.JWT_SECRET || 'your-super-secret-jwt-key',
});

// Swagger documentation
await fastify.register(swagger, {
  swagger: {
    info: {
      title: 'SNBTKU API',
      description: 'SNBTKU Backend API - Tryout Engine & Analytics',
      version: '1.0.0',
    },
    host: `localhost:${process.env.PORT || 3001}`,
    schemes: ['http', 'https'],
    consumes: ['application/json'],
    produces: ['application/json'],
    securityDefinitions: {
      bearerAuth: {
        type: 'apiKey',
        name: 'Authorization',
        in: 'header',
        description: 'Enter JWT token in format: Bearer <token>'
      }
    },
    tags: [
      { name: 'Authentication', description: 'Authentication endpoints' },
      { name: 'Users', description: 'User management endpoints' },
      { name: 'Admin', description: 'Admin management endpoints' },
      { name: 'Tryouts', description: 'Tryout management endpoints' },
      { name: 'Questions', description: 'Question management endpoints' },
      { name: 'Analytics', description: 'Analytics endpoints' },
      { name: 'Rewards', description: 'Reward and gamification endpoints' },
      { name: 'Quests', description: 'Quest and achievement endpoints' },
    ],
  },
});

await fastify.register(swaggerUi, {
  routePrefix: '/docs',
  uiConfig: {
    docExpansion: 'full',
    deepLinking: false,
  },
  uiHooks: {
    onRequest: function (request, reply, next) {
      next();
    },
    preHandler: function (request, reply, next) {
      next();
    },
  },
  staticCSP: true,
  transformStaticCSP: (header) => header,
  transformSpecification: (swaggerObject, request, reply) => {
    return swaggerObject;
  },
  transformSpecificationClone: true,
});

// Health check endpoint
fastify.get('/health', async (request, reply) => {
  const dbHealthy = await checkDatabaseConnection();
  
  const health = {
    status: 'ok',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    database: dbHealthy ? 'connected' : 'disconnected',
    version: process.env.npm_package_version || '1.0.0',
  };

  if (!dbHealthy) {
    reply.code(503);
    health.status = 'error';
  }

  return health;
});

// Root endpoint
fastify.get('/', async (request, reply) => {
  return {
    message: 'SNBTKU Backend API',
    version: '1.0.0',
    documentation: '/docs',
    health: '/health',
  };
});

// Register routes
await fastify.register(authRoutes);
await fastify.register(userRoutes);
await fastify.register(adminRoutes);
await fastify.register(tryoutRoutes);
await fastify.register(rewardRoutes, { prefix: '/api/rewards' });
await fastify.register(questRoutes, { prefix: '/api/quests' });
await fastify.register(shopRoutes);
// await fastify.register(questionRoutes, { prefix: '/api/questions' });
// await fastify.register(analyticsRoutes, { prefix: '/api/analytics' });

// Error handler
fastify.setErrorHandler((error, request, reply) => {
  fastify.log.error(error);
  
  if (error.validation) {
    reply.status(400).send({
      error: 'Validation Error',
      message: error.message,
      details: error.validation,
    });
    return;
  }

  if (error.statusCode) {
    reply.status(error.statusCode).send({
      error: error.name,
      message: error.message,
    });
    return;
  }

  reply.status(500).send({
    error: 'Internal Server Error',
    message: process.env.NODE_ENV === 'development' ? error.message : 'Something went wrong',
  });
});

// Start server
const start = async () => {
  try {
    const port = parseInt(process.env.PORT || '3001');
    const host = process.env.HOST || '0.0.0.0';
    
    // Check database connection before starting
    const dbHealthy = await checkDatabaseConnection();
    if (!dbHealthy) {
      fastify.log.warn('Database connection failed, but starting server anyway');
    }
    
    // Make socket service available globally
    fastify.decorate('socketService', socketService);
    
    const server = await fastify.listen({ port, host });
    
    // Initialize Socket.IO service
    socketService.initialize(fastify.server);
    
    fastify.log.info(`🚀 Server running at http://${host}:${port}`);
    fastify.log.info(`📚 API Documentation available at http://${host}:${port}/docs`);
    fastify.log.info(`🔌 Socket.IO server initialized`);
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};

// Graceful shutdown
process.on('SIGINT', async () => {
  fastify.log.info('Received SIGINT, shutting down gracefully');
  await fastify.close();
  process.exit(0);
});

process.on('SIGTERM', async () => {
  fastify.log.info('Received SIGTERM, shutting down gracefully');
  await fastify.close();
  process.exit(0);
});

start();