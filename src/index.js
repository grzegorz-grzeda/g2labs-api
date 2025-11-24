// Load environment variables from .env file
require('dotenv').config();

const express = require('express');
const morgan = require('morgan');
const logger = require('./config/logger');
const { apiLimiter } = require('./config/rateLimiter');

const app = express();
const PORT = process.env.PORT || 3000;

// Morgan HTTP request logging
// In development, use 'dev' format for colorized output
// In production, use 'combined' format for detailed logs
const morganFormat = process.env.NODE_ENV === 'production' ? 'combined' : 'dev';
app.use(morgan(morganFormat, { stream: logger.stream }));

// Rate limiting middleware - apply to all requests
app.use(apiLimiter);

// Body parsing middleware
app.use(express.json());

// Routes
app.get('/', (req, res) => {
    logger.info('Root endpoint accessed');
    res.json({ message: 'API is running' });
});

// Error handling middleware
app.use((err, req, res, next) => {
    logger.error('Unhandled error', {
        error: err.message,
        stack: err.stack,
        url: req.url,
        method: req.method,
    });
    res.status(500).json({ error: 'Internal server error' });
});

// Start server
app.listen(PORT, () => {
    logger.info(`Server is running on port ${PORT}`);
    logger.info(`Environment: ${process.env.NODE_ENV || 'development'}`);
});