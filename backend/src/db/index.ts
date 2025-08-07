import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import { config } from 'dotenv';
import * as schema from './schema';

// Load environment variables
config();

// Database connection configuration
const connectionString = process.env.DATABASE_URL || 'postgresql://snbtku_user:snbtku_password@localhost:5432/snbtku_dev';

// Create postgres client
const client = postgres(connectionString, {
  max: 20, // Maximum number of connections
  idle_timeout: 20, // Close idle connections after 20 seconds
  connect_timeout: 10, // Connection timeout in seconds
  prepare: false, // Disable prepared statements for better compatibility
});

// Create Drizzle database instance
export const db = drizzle(client, { 
  schema,
  logger: process.env.NODE_ENV === 'development' ? true : false,
});

// Export the client for manual queries if needed
export { client };

// Export all schema for convenience
export * from './schema';

// Database connection health check
export async function checkDatabaseConnection(): Promise<boolean> {
  try {
    await client`SELECT 1`;
    return true;
  } catch (error) {
    console.error('Database connection failed:', error);
    return false;
  }
}

// Graceful shutdown
export async function closeDatabaseConnection(): Promise<void> {
  try {
    await client.end();
    console.log('Database connection closed gracefully');
  } catch (error) {
    console.error('Error closing database connection:', error);
  }
}

// Database transaction helper
export async function withTransaction<T>(
  callback: (tx: typeof db) => Promise<T>
): Promise<T> {
  return await db.transaction(callback);
}