const express = require('express');
const app = express();
const cookieParser = require('cookie-parser');
const cors = require('cors');
const config = require('./src/configs/config');
const connectDB = require('./src/configs/mongooseConnection');
const logger = require('./src/configs/logger');
const AppError = require('./src/utils/AppError');
const errorHandler = require('./src/middlewares/errorHandler');
connectDB();

//* Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(cors({
    origin: config.FRONTEND_URL,
    credentials: true
}))

//* Routes
app.use('/auth/user', require('./src/routes/authRoute'));
app.use('/user', require('./src/routes/userRoute'));
app.use('/portfolio', require('./src/routes/portfolioRoute'));
app.use('/quote', require('./src/routes/quoteRoute'));
app.use('/blog', require('./src/routes/blogRoute'));
app.use('/review', require('./src/routes/reviewRoute'));

//* Unhandled routes
app.use((req, res, next) => {
    next(new AppError(`Route not found: ${req.originalUrl}`, 404));
});

app.get("/api/health", (req, res) => {
  res.status(200).json({ 
    success: true,
    message: "server is running"
  });
});

//* Global error handler
app.use(errorHandler);

const server = app.listen(config.PORT, () => {
    logger.info(`server is running on port ${config.PORT}`);
});

//* Server crash na ho isliye process-level safety
process.on('unhandledRejection', (err) => {
    logger.error(`Unhandled Rejection: ${err.message}`);
    server.close(() => process.exit(1));
});

process.on('uncaughtException', (err) => {
    logger.error(`Uncaught Exception: ${err.message}`);
    process.exit(1);
});