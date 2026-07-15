const config = require('../configs/config');
const logger = require('../configs/logger');

const handleCastErrorDB = (err) => {
    return { statusCode: 400, message: `Invalid ${err.path}: ${err.value}` };
};

const handleDuplicateFieldsDB = (err) => {
    const field = Object.keys(err.keyValue)[0];
    return { statusCode: 400, message: `Duplicate value for field: ${field}. Please use another value` };
};

const handleValidationErrorDB = (err) => {
    const messages = Object.values(err.errors).map(el => el.message);
    return { statusCode: 400, message: `Invalid input data: ${messages.join('. ')}` };
};

const handleJWTError = () => {
    return { statusCode: 401, message: 'Invalid token. Please log in again' };
};

const handleJWTExpiredError = () => {
    return { statusCode: 401, message: 'Token expired. Please log in again' };
};

const sendErrorDev = (err, res) => {
    res.status(err.statusCode).json({
        status: err.status,
        message: err.message,
        stack: err.stack,
        error: err
    });
};

const sendErrorProd = (err, res) => {
    if (err.isOperational) {
        res.status(err.statusCode).json({
            status: err.status,
            message: err.message
        });
    } else {
        logger.error(err);
        res.status(500).json({
            status: 'error',
            message: 'Something went wrong'
        });
    }
};

module.exports = (err, req, res, next) => {
    err.statusCode = err.statusCode || 500;
    err.status = err.status || 'error';

    logger.error(`${req.method} ${req.originalUrl} - ${err.message}`);

    if (config.NODE_ENV === 'development') {
        sendErrorDev(err, res);
    } else {
        let error = { ...err, message: err.message };

        if (error.name === 'CastError') error = { ...error, ...handleCastErrorDB(error) };
        if (error.code === 11000) error = { ...error, ...handleDuplicateFieldsDB(error) };
        if (error.name === 'ValidationError') error = { ...error, ...handleValidationErrorDB(error) };
        if (error.name === 'JsonWebTokenError') error = { ...error, ...handleJWTError() };
        if (error.name === 'TokenExpiredError') error = { ...error, ...handleJWTExpiredError() };

        error.isOperational = error.isOperational || false;
        error.statusCode = error.statusCode || 500;
        error.status = error.status || 'error';

        sendErrorProd(error, res);
    }
};