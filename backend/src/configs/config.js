const dotenv = require('dotenv').config();

if (!process.env.NODE_ENV) throw new Error('NODE_ENV environment variable is not set');
if (!process.env.PORT) throw new Error('PORT environment variable is not set');
if (!process.env.MONGO_URI) throw new Error('MONGO_URI environment variable is not set');
if (!process.env.JWT_SECRET) throw new Error('JWT_SECRET environment variable is not set');
if (!process.env.FRONTEND_URL) throw new Error('FRONTEND_URL environment variable is not set');
if (!process.env.EMAIL_USER) throw new Error('EMAIL_USER environment variable is not set');
if (!process.env.EMAIL_PASS) throw new Error('EMAIL_PASS environment variable is not set');
if (!process.env.ADMIN_EMAIL) throw new Error('ADMIN_EMAIL environment variable is not set');
if (!process.env.CLOUDINARY_CLOUD_NAME) throw new Error('CLOUDINARY_CLOUD_NAME environment variable is not set');
if (!process.env.CLOUDINARY_API_KEY) throw new Error('CLOUDINARY_API_KEY environment variable is not set');
if (!process.env.CLOUDINARY_API_SECRET) throw new Error('CLOUDINARY_API_SECRET environment variable is not set');

const config = {
    NODE_ENV: process.env.NODE_ENV,
    PORT: process.env.PORT,
    MONGO_URI: process.env.MONGO_URI,
    JWT_SECRET: process.env.JWT_SECRET,
    FRONTEND_URL: process.env.FRONTEND_URL,
    EMAIL_USER: process.env.EMAIL_USER,
    EMAIL_PASS: process.env.EMAIL_PASS,
    ADMIN_EMAIL: process.env.ADMIN_EMAIL,
    CLOUDINARY_CLOUD_NAME: process.env.CLOUDINARY_CLOUD_NAME,
    CLOUDINARY_API_KEY: process.env.CLOUDINARY_API_KEY,
    CLOUDINARY_API_SECRET: process.env.CLOUDINARY_API_SECRET,
};

module.exports = config;