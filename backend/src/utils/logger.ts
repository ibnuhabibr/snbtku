/**
 * Logger utility for consistent logging across the application
 */

import { config } from '../config';

// Log levels
type LogLevel = 'debug' | 'info' | 'warn' | 'error';

// Colors for console output
const COLORS = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  dim: '\x1b[2m',
  underscore: '\x1b[4m',
  blink: '\x1b[5m',
  reverse: '\x1b[7m',
  hidden: '\x1b[8m',
  
  black: '\x1b[30m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m',
  white: '\x1b[37m',
  
  bgBlack: '\x1b[40m',
  bgRed: '\x1b[41m',
  bgGreen: '\x1b[42m',
  bgYellow: '\x1b[43m',
  bgBlue: '\x1b[44m',
  bgMagenta: '\x1b[45m',
  bgCyan: '\x1b[46m',
  bgWhite: '\x1b[47m'
};

// Log level configuration
const LOG_LEVELS: Record<LogLevel, number> = {
  debug: 0,
  info: 1,
  warn: 2,
  error: 3
};

// Current log level from config or environment
const currentLogLevel = LOG_LEVELS[config.logLevel as LogLevel] || LOG_LEVELS.info;

/**
 * Format timestamp for logs
 */
function getTimestamp(): string {
  return new Date().toISOString();
}

/**
 * Format log message
 */
function formatLogMessage(level: LogLevel, message: string, meta?: any): string {
  const timestamp = getTimestamp();
  let formattedMessage = `[${timestamp}] ${level.toUpperCase()}: ${message}`;
  
  if (meta) {
    if (typeof meta === 'object') {
      try {
        const metaString = JSON.stringify(meta, null, 2);
        formattedMessage += `\n${metaString}`;
      } catch (e) {
        formattedMessage += `\n[Object could not be stringified]`;
      }
    } else {
      formattedMessage += `\n${meta}`;
    }
  }
  
  return formattedMessage;
}

/**
 * Logger implementation
 */
export const logger = {
  debug(message: string, meta?: any): void {
    if (currentLogLevel <= LOG_LEVELS.debug) {
      const formattedMessage = formatLogMessage('debug', message, meta);
      console.debug(`${COLORS.cyan}${formattedMessage}${COLORS.reset}`);
    }
  },
  
  info(message: string, meta?: any): void {
    if (currentLogLevel <= LOG_LEVELS.info) {
      const formattedMessage = formatLogMessage('info', message, meta);
      console.info(`${COLORS.green}${formattedMessage}${COLORS.reset}`);
    }
  },
  
  warn(message: string, meta?: any): void {
    if (currentLogLevel <= LOG_LEVELS.warn) {
      const formattedMessage = formatLogMessage('warn', message, meta);
      console.warn(`${COLORS.yellow}${formattedMessage}${COLORS.reset}`);
    }
  },
  
  error(message: string, meta?: any): void {
    if (currentLogLevel <= LOG_LEVELS.error) {
      const formattedMessage = formatLogMessage('error', message, meta);
      console.error(`${COLORS.red}${formattedMessage}${COLORS.reset}`);
    }
  },
  
  /**
   * Log API request (specialized info log for HTTP requests)
   */
  request(method: string, url: string, status: number, duration: number): void {
    if (currentLogLevel <= LOG_LEVELS.info) {
      // Color status code based on range
      let statusColor = COLORS.green;
      if (status >= 400) statusColor = COLORS.red;
      else if (status >= 300) statusColor = COLORS.yellow;
      
      // Format duration with color based on response time
      let durationColor = COLORS.green;
      if (duration > 1000) durationColor = COLORS.red;
      else if (duration > 500) durationColor = COLORS.yellow;
      
      const timestamp = getTimestamp();
      console.info(
        `[${timestamp}] ${COLORS.cyan}${method}${COLORS.reset} ${url} ${statusColor}${status}${COLORS.reset} ${durationColor}${duration.toFixed(2)}ms${COLORS.reset}`
      );
    }
  }
};
