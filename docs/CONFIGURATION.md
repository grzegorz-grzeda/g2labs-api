# Configuration Guide

This guide covers all configuration options available for the g2labs-api server.

## Table of Contents

- [Environment Variables](#environment-variables)
- [Logging Configuration](#logging-configuration)
- [Rate Limiting Configuration](#rate-limiting-configuration)
- [Express Configuration](#express-configuration)

---

## Environment Variables

The application uses **dotenv** to load environment variables from a `.env` file at the root of the project. This provides a secure and convenient way to manage configuration.

### Setting Up Environment Variables

1. **Create a `.env` file** in the project root:
   ```bash
   cp .env.example .env
   ```

2. **Edit the `.env` file** with your configuration:
   ```bash
   PORT=3000
   NODE_ENV=development
   LOG_LEVEL=info
   ```

3. **The application automatically loads** these variables at startup using `dotenv.config()` in `src/index.js`.

**Important**: Never commit your `.env` file to version control. It's already included in `.gitignore`.

Alternatively, environment variables can also be set directly in your shell or through your deployment platform (e.g., Heroku, AWS, Docker).

### Core Settings

#### `PORT`
- **Type**: Number
- **Default**: `3000`
- **Description**: The port on which the server will listen
- **Example**:
  ```bash
  PORT=8080 npm start
  ```

#### `NODE_ENV`
- **Type**: String
- **Default**: `development`
- **Options**: `development`, `production`, `test`
- **Description**: Determines the environment mode
  - `development`: Console logging enabled, verbose error messages, 'dev' format for Morgan
  - `production`: File logging only, minimal error info, 'combined' format for Morgan
  - `test`: Rate limiting disabled, minimal output
- **Example**:
  ```bash
  NODE_ENV=production node src/index.js
  ```

### Logging Settings

#### `LOG_LEVEL`
- **Type**: String
- **Default**: `info`
- **Options**: `error`, `warn`, `info`, `http`, `verbose`, `debug`, `silly`
- **Description**: Minimum log level to record
  - `error`: Only errors
  - `warn`: Warnings and errors
  - `info`: General information, warnings, and errors (recommended)
  - `debug`: Detailed debugging information
- **Example**:
  ```bash
  LOG_LEVEL=debug npm start
  ```

### Example .env File

The project includes a `.env.example` file that you can copy:

```bash
cp .env.example .env
```

Example `.env` file contents:

```bash
# Server Configuration
PORT=3000
NODE_ENV=development

# Logging Configuration
LOG_LEVEL=info
```

**Note**: The `.env` file is automatically loaded by dotenv at application startup. Make sure it's in the project root directory.

---

## Logging Configuration

The application uses **Winston** for application logging and **Morgan** for HTTP request logging.

### Winston Logger (`src/config/logger.js`)

#### Log Files Location

All logs are stored in the `logs/` directory:

```
logs/
├── combined.log      # All logs (info, warn, error)
├── error.log         # Error-level logs only
├── exceptions.log    # Uncaught exceptions
└── rejections.log    # Unhandled promise rejections
```

#### Log File Rotation

- **Max File Size**: 5 MB per file
- **Max Files**: 5 files per log type
- Old logs are automatically rotated when size limit is reached

#### Log Format

**File logs** (JSON format):
```json
{
  "timestamp": "2025-11-24 10:30:45",
  "level": "info",
  "message": "Server is running on port 3000"
}
```

**Console logs** (Development mode):
```
2025-11-24 10:30:45 [info]: Server is running on port 3000
```

#### Log Levels

From highest to lowest priority:

1. **error**: Application errors, exceptions
2. **warn**: Warning messages, rate limit violations
3. **info**: General information, startup messages
4. **http**: HTTP request logs (via Morgan)
5. **debug**: Detailed debugging information
6. **verbose**: Very detailed information
7. **silly**: Everything including trivial information

#### Using the Logger in Your Code

```javascript
const logger = require('./config/logger');

// Log at different levels
logger.error('Error message', { error: err });
logger.warn('Warning message');
logger.info('Information message');
logger.debug('Debug message', { data: someData });

// Log with metadata
logger.info('User logged in', {
  userId: 123,
  ip: req.ip,
  timestamp: new Date()
});
```

#### Customizing Log Transports

Edit `src/config/logger.js` to modify:

```javascript
// Change file size limit
maxsize: 10485760, // 10MB

// Change number of rotated files
maxFiles: 10,

// Change log directory
filename: path.join('custom-logs', 'error.log'),
```

### Morgan HTTP Logger

#### Log Formats

**Development mode** (`dev` format):
```
GET / 200 15.123 ms - 27
```

**Production mode** (`combined` format - Apache style):
```
::1 - - [24/Nov/2025:10:30:45 +0000] "GET / HTTP/1.1" 200 27 "-" "curl/7.68.0"
```

#### Customizing Morgan

Edit `src/index.js` to change the format:

```javascript
// Use a different format
const morganFormat = 'tiny'; // short, tiny, common, combined, dev

// Create custom format
app.use(morgan(':method :url :status :response-time ms'));

// Add custom tokens
morgan.token('custom-id', (req) => req.id);
app.use(morgan(':method :url :custom-id'));
```

---

## Rate Limiting Configuration

Rate limiting is configured in `src/config/rateLimiter.js`.

### API Limiter (General Endpoints)

**Current Settings**:
- **Window**: 15 minutes
- **Max Requests**: 100 per window per IP
- **Headers**: Standard `RateLimit-*` headers included

**Customizing**:

```javascript
const apiLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // Change time window
    max: 100,                 // Change max requests
    message: {                // Customize error message
        error: 'Custom error message',
        retryAfter: '15 minutes'
    },
});
```

### Auth Limiter (Authentication Endpoints)

**Current Settings**:
- **Window**: 15 minutes
- **Max Requests**: 5 per window per IP
- **Purpose**: Protect against brute-force attacks

**Usage Example**:

```javascript
const { authLimiter } = require('./config/rateLimiter');

app.post('/api/auth/login', authLimiter, (req, res) => {
    // Login logic
});
```

### Rate Limit Bypass

Rate limiting is automatically disabled when `NODE_ENV=test`.

To skip rate limiting for specific IPs, modify `rateLimiter.js`:

```javascript
skip: (req) => {
    // Skip for test environment
    if (process.env.NODE_ENV === 'test') return true;
    
    // Skip for specific IPs
    const trustedIPs = ['127.0.0.1', '::1'];
    return trustedIPs.includes(req.ip);
},
```

### Custom Rate Limiters

Create additional rate limiters for specific use cases:

```javascript
// Very strict limiter for sensitive operations
const strictLimiter = rateLimit({
    windowMs: 60 * 60 * 1000, // 1 hour
    max: 3,                   // 3 requests per hour
    message: {
        error: 'Too many attempts. Please try again in 1 hour.',
        retryAfter: '1 hour'
    },
});

module.exports = {
    apiLimiter,
    authLimiter,
    strictLimiter, // Export the new limiter
};
```

---

## Express Configuration

### JSON Body Parser

**Current Settings**:
```javascript
app.use(express.json());
```

**Customize Limits**:
```javascript
app.use(express.json({
    limit: '10mb',           // Max request body size
    strict: true,            // Only accept arrays and objects
    type: 'application/json' // Content-Type to parse
}));
```

### URL-Encoded Parser

To accept form data:

```javascript
app.use(express.urlencoded({
    extended: true,
    limit: '10mb'
}));
```

### CORS Configuration

To enable CORS (Cross-Origin Resource Sharing):

1. Install cors:
   ```bash
   npm install cors
   ```

2. Add to `src/index.js`:
   ```javascript
   const cors = require('cors');
   
   // Allow all origins
   app.use(cors());
   
   // Or configure specific origins
   app.use(cors({
       origin: 'https://yourdomain.com',
       methods: ['GET', 'POST', 'PUT', 'DELETE'],
       credentials: true
   }));
   ```

### Trust Proxy

If running behind a reverse proxy (nginx, Apache):

```javascript
// In src/index.js, after creating app
app.set('trust proxy', 1); // Trust first proxy
// or
app.set('trust proxy', true); // Trust all proxies
```

This ensures correct IP addresses are logged and rate limiting works correctly.

---

## Production Recommendations

### Environment Variables

```bash
NODE_ENV=production
PORT=3000
LOG_LEVEL=warn
```

### Process Management

Use a process manager like **PM2**:

```bash
# Install PM2
npm install -g pm2

# Start the application
pm2 start src/index.js --name g2labs-api

# Set to start on system boot
pm2 startup
pm2 save
```

### Reverse Proxy

Run behind nginx for better performance:

```nginx
server {
    listen 80;
    server_name api.yourdomain.com;
    
    location / {
        proxy_pass http://localhost:3000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    }
}
```

### Log Monitoring

Monitor logs in production:

```bash
# Watch all logs
tail -f logs/combined.log

# Watch errors only
tail -f logs/error.log

# Search for specific patterns
grep "ERROR" logs/combined.log
```

---

## Troubleshooting

### Logs not being written

1. Check that `logs/` directory exists and is writable
2. Verify `LOG_LEVEL` is set correctly
3. Check file permissions

### Rate limiting not working

1. Ensure `NODE_ENV` is not set to `test`
2. Check if behind a proxy - set `trust proxy`
3. Verify client IP is being detected correctly

### High memory usage

1. Reduce log file rotation limits
2. Lower `maxFiles` in logger configuration
3. Consider external log management (e.g., syslog)

---

For more information, see the [README](../README.md) and [API Documentation](./API.md).
