import chalk from 'chalk';
import { createLogger, format, transports } from 'winston';
import Transport from 'winston-transport';

export const STYLES = {
  ERROR: chalk.red,
  WARN: chalk.hex('#FA9C1B'),
  INFO: chalk.dim,
  VERBOSE: chalk.hex('#6435c9'),
  DEBUG: chalk.hex('#2185d0'),
  SILLY: chalk.hex('#f011ce'),
};

export enum LABELS {
  ERROR = 'ERROR',
  WARN = 'WARN',
  INFO = 'INFO',
  VERBOSE = 'VERBOSE',
  DEBUG = 'DEBUG',
  SILLY = 'SILLY',
}

const levelStyleMap: { [key: string]: typeof chalk } = {
  error: STYLES.ERROR,
  warn: STYLES.WARN,
  info: STYLES.INFO,
  verbose: STYLES.VERBOSE,
  debug: STYLES.DEBUG,
  silly: STYLES.SILLY,
};

export class ConsoleLogTransport extends Transport {
  private logger = new ConsoleLogger();

  log(info: any, callback: { (): void }) {
    const style = levelStyleMap[info.level as string] || STYLES.DEBUG;
    const label = info.consoleLoggerOptions?.label || (info.level as string).toUpperCase();
    const messages = [info.message];
    if (info.error) {
      messages.push(info.error);
    }
    this.logger.log(style, label, ...messages);
    callback();
  }
}

const getTimeStampString = () => new Date(Date.now()).toISOString();

class ConsoleLogger {
  public log = (style: typeof chalk, label: LABELS | string, ...messages: any[]) => {
    const finalMessage = `[${getTimeStampString()}] [${label}]`;
    console.log(
      style(
        finalMessage,
        ...messages.map((item) => {
          if (item.stack) {
            return '\n' + item.stack;
          } else if (item.message) {
            return item.message;
          }
          return item;
        }),
      ),
    );
  };

  public error = (...messages: any[]) => this.log(STYLES.ERROR, LABELS.ERROR, ...messages);

  public warn = (...messages: any[]) => this.log(STYLES.WARN, LABELS.WARN, ...messages);

  public info = (...messages: any[]) => this.log(STYLES.INFO, LABELS.INFO, ...messages);

  public verbose = (...messages: any[]) => this.log(STYLES.VERBOSE, LABELS.VERBOSE, ...messages);

  public debug = (...messages: any[]) => this.log(STYLES.DEBUG, LABELS.DEBUG, ...messages);

  public silly = (...messages: any[]) => this.log(STYLES.SILLY, LABELS.SILLY, ...messages);
}

const logTransports = [
  new (transports as any).File({
    level: 'error',
    filename: './logs/error.log',
    format: format.json({
      replacer: (key: any, value: any) => {
        if (key === 'error') {
          return {
            message: (value as Error).message,
            stack: (value as Error).stack,
          };
        }
        return value;
      },
    }),
  }),
  new ConsoleLogTransport(),
];

export const logger = createLogger({
  format: format.combine(format.timestamp()),
  transports: logTransports,
  defaultMeta: { service: 'api' },
  level: process.env.NODE_ENV === 'development' ? 'silly' : 'info',
});
