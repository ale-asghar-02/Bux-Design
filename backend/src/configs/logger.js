const winston = require('winston');
require('winston-daily-rotate-file');
const config = require('./config');

const isProduction = config.NODE_ENV === 'production';

const logger = winston.createLogger({
    levels: winston.config.npm.levels,
    format: winston.format.combine(
        winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
        winston.format.errors({ stack: true }),
        winston.format.printf(({ timestamp, level, message, stack }) => {
            return `[${timestamp}] ${level.toUpperCase()}: ${stack || message}`;
        })
    ),
    transports: isProduction
        ? [
            new winston.transports.DailyRotateFile({
                filename: 'logs/error-%DATE%.log',
                datePattern: 'YYYY-MM-DD',
                level: 'error',
                maxSize: '10m',
                maxFiles: '14d'
            })
        ]
        : [
            new winston.transports.Console({
                format: winston.format.combine(
                    winston.format.colorize(),
                    winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
                    winston.format.printf(({ timestamp, level, message, stack }) => {
                        return `[${timestamp}] ${level}: ${stack || message}`;
                    })
                ),
                level: 'debug'
            })
        ]
});

module.exports = logger;