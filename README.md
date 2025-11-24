# g2labs-api

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Node.js Version](https://img.shields.io/badge/node-%3E%3D14.0.0-brightgreen)](https://nodejs.org/)

Edge API server for private use - A lightweight, production-ready Express.js API with built-in logging, rate limiting, and error handling.

## 🚀 Features

- **Express.js 5.x** - Fast, minimalist web framework
- **Environment Variables** - dotenv for configuration management
- **Winston Logging** - Comprehensive application logging with file rotation
- **Morgan HTTP Logging** - HTTP request logging middleware
- **Rate Limiting** - Built-in protection against abuse and DDoS attacks
- **Error Handling** - Centralized error handling with logging
- **Environment-Aware** - Different configurations for development and production
- **Hot Reload** - Development mode with nodemon for automatic restarts

## 📋 Prerequisites

- Node.js >= 14.0.0
- npm or yarn

## 🔧 Installation

1. Clone the repository:
```bash
git clone https://github.com/grzegorz-grzeda/g2labs-api.git
cd g2labs-api
```

2. Install dependencies:
```bash
npm install
```

3. Create environment configuration:
```bash
cp .env.example .env
# Edit .env with your settings
```

The application uses `dotenv` to load environment variables from the `.env` file. Create your own `.env` file based on `.env.example` and customize the values for your environment.

## 🏃 Running the Application

### Development Mode
```bash
npm start
```
This runs the server with nodemon for automatic reloading on file changes.

### Production Mode
```bash
NODE_ENV=production node src/index.js
```

The server will start on port 3000 by default (configurable via `PORT` environment variable).

## 📚 Documentation

- [API Documentation](./docs/API.md) - Detailed API endpoints and usage
- [Configuration Guide](./docs/CONFIGURATION.md) - Environment variables and settings
- [Contributing Guide](./docs/CONTRIBUTING.md) - Development guidelines

## 🛡️ Security Features

### Rate Limiting
- **General API**: 100 requests per 15 minutes per IP
- **Auth endpoints**: 5 requests per 15 minutes per IP (when implemented)
- Automatic rate limit headers in responses
- Rate limit violations are logged

### Logging
- **Winston**: Application-level logging with file rotation
- **Morgan**: HTTP request/response logging
- Separate log files for errors, exceptions, and combined logs
- Logs stored in `logs/` directory

## 📁 Project Structure

```
g2labs-api/
├── src/
│   ├── config/
│   │   ├── logger.js        # Winston logger configuration
│   │   └── rateLimiter.js   # Rate limiting configuration
│   └── index.js             # Main application entry point
├── logs/                    # Log files (not committed to git)
├── docs/                    # Documentation
├── package.json
└── README.md
```

## 🔐 Environment Variables

| Variable | Default | Description |
|----------|---------|-------------|
| `PORT` | `3000` | Server port |
| `NODE_ENV` | `development` | Environment (development/production) |
| `LOG_LEVEL` | `info` | Logging level (error/warn/info/debug) |

See [CONFIGURATION.md](./docs/CONFIGURATION.md) for detailed configuration options.

## 📊 Logging

Logs are written to the `logs/` directory:
- `combined.log` - All application logs
- `error.log` - Error-level logs only
- `exceptions.log` - Uncaught exceptions
- `rejections.log` - Unhandled promise rejections

In development mode, logs are also output to the console with color formatting.

## 🤝 Contributing

Contributions are welcome! Please read [CONTRIBUTING.md](./docs/CONTRIBUTING.md) for details on the development process and how to submit pull requests.

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👤 Author

**Grzegorz Grzęda**

## 🙏 Acknowledgments

- [Express.js](https://expressjs.com/) - Web framework
- [Winston](https://github.com/winstonjs/winston) - Logging library
- [Morgan](https://github.com/expressjs/morgan) - HTTP request logger
- [express-rate-limit](https://github.com/express-rate-limit/express-rate-limit) - Rate limiting middleware

---

**Note**: This is a private API server. Ensure proper security measures are in place before exposing to the internet.
