import { config } from '../config/environment';

type LogLevel = 'info' | 'warn' | 'error' | 'debug';

interface LogEntry {
  timestamp: string;
  level: LogLevel;
  message: string;
  data?: any;
}

class Logger {
  private formatMessage(level: LogLevel, message: string, data?: any): LogEntry {
    return {
      timestamp: new Date().toISOString(),
      level,
      message,
      data,
    };
  }

  private log(entry: LogEntry): void {
    const { timestamp, level, message, data } = entry;
    const prefix = `[${timestamp}] [${level.toUpperCase()}]`;
    const dataStr = data ? ` ${JSON.stringify(data)}` : '';

    switch (level) {
      case 'info':
        console.log(`${prefix} ${message}${dataStr}`);
        break;
      case 'warn':
        console.warn(`${prefix} ${message}${dataStr}`);
        break;
      case 'error':
        console.error(`${prefix} ${message}${dataStr}`);
        break;
      case 'debug':
        if (config.logging.level === 'debug') {
          console.debug(`${prefix} ${message}${dataStr}`);
        }
        break;
    }
  }

  info(message: string, data?: any): void {
    this.log(this.formatMessage('info', message, data));
  }

  warn(message: string, data?: any): void {
    this.log(this.formatMessage('warn', message, data));
  }

  error(message: string, data?: any): void {
    this.log(this.formatMessage('error', message, data));
  }

  debug(message: string, data?: any): void {
    this.log(this.formatMessage('debug', message, data));
  }
}

export const logger = new Logger();
