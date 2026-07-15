const nodemailer = require('nodemailer');
const config = require('../configs/config');

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: config.EMAIL_USER,
        pass: config.EMAIL_PASS,
    },
});

module.exports = transporter;