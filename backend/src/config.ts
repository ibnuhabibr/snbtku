import 'dotenv/config';

// Default configuration values
const defaultConfig = {
  server: {
    port: 3001,
    host: '0.0.0.0',
    apiPrefix: '/api/v1',
    corsOrigin: '*',
    rateLimitWindow: 60000, // 1 minute
    rateLimitMax: 100, // 100 requests per minute
    trustProxy: true,
  },
  database: {
    host: 'localhost',
    port: 5432,
    user: 'snbtku_user',
    password: 'snbtku_password',
    database: 'snbtku_dev',
    ssl: false,
  },
  redis: {
    url: 'redis://localhost:6379',
    cachePrefix: 'snbtku:',
  },
  auth: {
    jwtSecret: 'super-secret-key-should-be-long-and-secure',
    jwtExpiresIn: '7d',
    sessionSecret: 'another-secret-key-for-sessions',
    bcryptSaltRounds: 10,
  },
  upload: {
    maxFileSize: 10 * 1024 * 1024, // 10MB
    allowedMimeTypes: ['image/jpeg', 'image/png', 'image/webp', 'application/pdf'],
    storagePath: './uploads',
  },
  logLevel: 'info',
  env: 'development',
};

// Environment-specific configuration
const environments: Record<string, any> = {
  development: {
    ...defaultConfig,
    logLevel: 'debug',
  },
  test: {
    ...defaultConfig,
    logLevel: 'info',
    database: {
      ...defaultConfig.database,
      database: 'snbtku_test',
    },
  },
  production: {
    ...defaultConfig,
    server: {
      ...defaultConfig.server,
      corsOrigin: process.env.CORS_ORIGIN || 'https://snbtku.com',
      port: parseInt(process.env.PORT || '3001'),
    },
    database: {
      host: process.env.DB_HOST || defaultConfig.database.host,
      port: parseInt(process.env.DB_PORT || String(defaultConfig.database.port)),
      user: process.env.DB_USER || defaultConfig.database.user,
      password: process.env.DB_PASSWORD || defaultConfig.database.password,
      database: process.env.DB_NAME || defaultConfig.database.database,
      ssl: process.env.DB_SSL === 'true',
    },
    redis: {
      url: process.env.REDIS_URL || defaultConfig.redis.url,
      cachePrefix: process.env.REDIS_PREFIX || defaultConfig.redis.cachePrefix,
    },
    auth: {
      ...defaultConfig.auth,
      jwtSecret: process.env.JWT_SECRET || defaultConfig.auth.jwtSecret,
      jwtExpiresIn: process.env.JWT_EXPIRES_IN || defaultConfig.auth.jwtExpiresIn,
      sessionSecret: process.env.SESSION_SECRET || defaultConfig.auth.sessionSecret,
    },
    logLevel: process.env.LOG_LEVEL || 'info',
  },
};

// Determine environment
const nodeEnv = process.env.NODE_ENV || 'development';
const env = Object.prototype.hasOwnProperty.call(environments, nodeEnv)
  ? nodeEnv
  : 'development';

// Load configuration for current environment
export const config = {
  ...environments[env],
  env,
};

export default config;
