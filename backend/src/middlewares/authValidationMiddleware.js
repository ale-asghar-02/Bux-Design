const { body, validationResult } = require('express-validator');

const registerValidation = [
    body('username')
        .notEmpty().withMessage('Username cannot be empty')
        .isLength({ min: 3 }).withMessage('Username must be at least 3 characters'),

    body('email')
        .notEmpty().withMessage('Email cannot be empty')
        .isEmail().withMessage('Invalid email format'),

    body('password')
        .notEmpty().withMessage('Password cannot be empty')
        .isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),

    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ message: errors.array()[0].msg });
        }
        next();
    }
];

const loginValidation = [
    body('email')
        .notEmpty().withMessage('Email cannot be empty')
        .isEmail().withMessage('Invalid email format'),

    body('password')
        .notEmpty().withMessage('Password cannot be empty')
        .isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),

    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ message: errors.array()[0].msg });
        }
        next();
    }
];

const forgotPasswordValidation = [
    body('email')
        .notEmpty().withMessage('Email cannot be empty')
        .isEmail().withMessage('Invalid email format'),

    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ message: errors.array()[0].msg });
        }
        next();
    }
];

const resetPasswordValidation = [
    body('newPassword')
        .notEmpty().withMessage('New password cannot be empty')
        .isLength({ min: 6 }).withMessage('New password must be at least 6 characters'),
    body('confirmPassword')
        .notEmpty().withMessage('Confirm password cannot be empty')
        .isLength({ min: 6 }).withMessage('Confirm password must be at least 6 characters')
        .custom((value, { req }) => value === req.body.newPassword)
        .withMessage('Passwords do not match'),

    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ message: errors.array()[0].msg });
        }
        next();
    }
];

const gateCodeValidation = [
    body('code')
        .notEmpty().withMessage('Code cannot be empty')
        .isLength({ min: 6 }).withMessage('Code must be exactly 6 digits')
        .isNumeric().withMessage('Code must contain only digits'),

    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ message: errors.array()[0].msg });
        }
        next();
    }
];

const resetGateCodeValidation = [
    body('newCode')
        .notEmpty().withMessage('New code cannot be empty')
        .isLength({ min: 6 }).withMessage('Code must be exactly 6 digits')
        .isNumeric().withMessage('Code must contain only digits'),

    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ message: errors.array()[0].msg });
        }
        next();
    }
];

module.exports = { registerValidation, loginValidation, forgotPasswordValidation, resetPasswordValidation, gateCodeValidation, resetGateCodeValidation };