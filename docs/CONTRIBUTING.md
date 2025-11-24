# Contributing to g2labs-api

Thank you for considering contributing to g2labs-api! This document provides guidelines and instructions for contributing to the project.

## Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
- [Development Setup](#development-setup)
- [Project Structure](#project-structure)
- [Coding Standards](#coding-standards)
- [Making Changes](#making-changes)
- [Testing](#testing)
- [Submitting Changes](#submitting-changes)
- [Reporting Issues](#reporting-issues)

---

## Code of Conduct

This project follows a simple code of conduct:

- Be respectful and considerate
- Welcome newcomers and help them learn
- Focus on what is best for the community
- Show empathy towards other community members

---

## Getting Started

### Prerequisites

- Node.js >= 14.0.0
- npm or yarn
- Git
- A code editor (VS Code recommended)

### Fork and Clone

1. Fork the repository on GitHub
2. Clone your fork locally:
   ```bash
   git clone https://github.com/YOUR_USERNAME/g2labs-api.git
   cd g2labs-api
   ```

3. Add the upstream repository:
   ```bash
   git remote add upstream https://github.com/grzegorz-grzeda/g2labs-api.git
   ```

---

## Development Setup

1. Install dependencies:
   ```bash
   npm install
   ```

2. Create a `.env` file (optional):
   ```bash
   PORT=3000
   NODE_ENV=development
   LOG_LEVEL=debug
   ```

3. Start the development server:
   ```bash
   npm start
   ```

4. The server should now be running at `http://localhost:3000`

---

## Project Structure

```
g2labs-api/
├── src/
│   ├── config/           # Configuration files
│   │   ├── logger.js     # Winston logger setup
│   │   └── rateLimiter.js # Rate limiting config
│   ├── routes/           # Route handlers (future)
│   ├── middleware/       # Custom middleware (future)
│   ├── controllers/      # Business logic (future)
│   ├── models/           # Data models (future)
│   └── index.js          # Application entry point
├── logs/                 # Log files (gitignored)
├── docs/                 # Documentation
│   ├── API.md
│   ├── CONFIGURATION.md
│   └── CONTRIBUTING.md
├── tests/                # Test files (future)
├── .gitignore
├── package.json
├── LICENSE
└── README.md
```

---

## Coding Standards

### JavaScript Style Guide

This project follows standard JavaScript conventions:

#### Formatting

- **Indentation**: 4 spaces (no tabs)
- **Quotes**: Single quotes for strings
- **Semicolons**: Required at the end of statements
- **Line Length**: Max 100 characters (soft limit)

#### Naming Conventions

```javascript
// Variables and functions: camelCase
const userName = 'John';
function getUserData() { }

// Constants: UPPER_SNAKE_CASE
const MAX_RETRY_ATTEMPTS = 3;

// Classes: PascalCase
class UserController { }

// Private/internal: prefix with underscore
const _privateHelper = () => { };
```

#### File Naming

- Route files: `users.routes.js`
- Controller files: `users.controller.js`
- Middleware files: `auth.middleware.js`
- Config files: `database.config.js`
- Utility files: `validation.utils.js`

### Code Quality

- **No unused variables**: Remove or comment unused code
- **Meaningful names**: Use descriptive variable and function names
- **DRY principle**: Don't repeat yourself - extract reusable code
- **Single responsibility**: Each function should do one thing well
- **Error handling**: Always handle errors appropriately

#### Good Example

```javascript
const logger = require('./config/logger');

async function getUserById(userId) {
    try {
        if (!userId) {
            throw new Error('User ID is required');
        }
        
        const user = await database.findUser(userId);
        
        if (!user) {
            logger.warn(`User not found: ${userId}`);
            return null;
        }
        
        logger.info(`User retrieved: ${userId}`);
        return user;
    } catch (error) {
        logger.error('Error retrieving user', { 
            userId, 
            error: error.message 
        });
        throw error;
    }
}
```

### Logging Guidelines

```javascript
const logger = require('./config/logger');

// Use appropriate log levels
logger.error('Database connection failed', { error: err });
logger.warn('API rate limit approaching', { remaining: 10 });
logger.info('User successfully logged in', { userId: 123 });
logger.debug('Processing request', { requestData });

// Include context in logs
logger.info('Action performed', {
    userId: req.user.id,
    action: 'update_profile',
    timestamp: new Date(),
    ip: req.ip
});
```

### Route Handlers

```javascript
// Use async/await with proper error handling
app.get('/api/users/:id', async (req, res, next) => {
    try {
        const user = await getUserById(req.params.id);
        
        if (!user) {
            return res.status(404).json({ 
                error: 'User not found' 
            });
        }
        
        res.json(user);
    } catch (error) {
        next(error); // Pass to error handler
    }
});
```

### Middleware

```javascript
// Middleware should be in separate files
const validateUser = (req, res, next) => {
    const { email, password } = req.body;
    
    if (!email || !password) {
        return res.status(400).json({ 
            error: 'Email and password are required' 
        });
    }
    
    next();
};

module.exports = validateUser;
```

---

## Making Changes

### Branch Naming

Create a feature branch from `main`:

```bash
git checkout -b feature/add-user-authentication
git checkout -b bugfix/fix-rate-limiting
git checkout -b docs/update-api-documentation
git checkout -b refactor/improve-error-handling
```

Prefixes:
- `feature/` - New features
- `bugfix/` - Bug fixes
- `docs/` - Documentation changes
- `refactor/` - Code refactoring
- `test/` - Adding tests
- `chore/` - Maintenance tasks

### Commit Messages

Write clear, descriptive commit messages:

```bash
# Good commits
git commit -m "Add user authentication endpoint"
git commit -m "Fix rate limiting for auth routes"
git commit -m "Update API documentation with new endpoints"
git commit -m "Refactor logger configuration"

# Bad commits (avoid these)
git commit -m "fix"
git commit -m "update"
git commit -m "changes"
```

#### Commit Message Format

```
<type>: <subject>

<body (optional)>

<footer (optional)>
```

**Types**:
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes (formatting)
- `refactor`: Code refactoring
- `test`: Adding tests
- `chore`: Maintenance tasks

**Example**:
```
feat: Add JWT authentication middleware

- Implement token generation and validation
- Add authentication middleware for protected routes
- Update documentation with authentication flow

Closes #42
```

### Keep Your Fork Updated

Regularly sync with the upstream repository:

```bash
git fetch upstream
git checkout main
git merge upstream/main
git push origin main
```

---

## Testing

### Manual Testing

Before submitting changes:

1. Start the server:
   ```bash
   npm start
   ```

2. Test your endpoints:
   ```bash
   curl http://localhost:3000/your-endpoint
   ```

3. Check the logs:
   ```bash
   tail -f logs/combined.log
   ```

4. Test rate limiting:
   ```bash
   # Send multiple requests quickly
   for i in {1..10}; do curl http://localhost:3000/; done
   ```

### Automated Tests (Future)

When test infrastructure is added:

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage
```

### Testing Checklist

Before submitting a pull request:

- [ ] Server starts without errors
- [ ] All endpoints return expected responses
- [ ] Rate limiting works correctly
- [ ] Logs are being written properly
- [ ] Error handling works as expected
- [ ] No console errors or warnings
- [ ] Documentation is updated

---

## Submitting Changes

### Pull Request Process

1. **Ensure your code follows the style guidelines**

2. **Update documentation** if needed:
   - README.md
   - API.md
   - CONFIGURATION.md

3. **Push your branch** to your fork:
   ```bash
   git push origin feature/your-feature-name
   ```

4. **Create a Pull Request** on GitHub:
   - Use a clear, descriptive title
   - Describe what changes you made and why
   - Reference any related issues
   - Add screenshots if applicable

5. **Pull Request Template**:
   ```markdown
   ## Description
   Brief description of the changes
   
   ## Type of Change
   - [ ] Bug fix
   - [ ] New feature
   - [ ] Documentation update
   - [ ] Refactoring
   
   ## Changes Made
   - List of specific changes
   - Another change
   
   ## Testing
   How you tested the changes
   
   ## Related Issues
   Closes #issue_number
   
   ## Screenshots (if applicable)
   ```

6. **Respond to feedback**:
   - Address review comments
   - Push additional commits if needed
   - Be open to suggestions

### Pull Request Checklist

- [ ] Code follows the project's style guidelines
- [ ] Self-review completed
- [ ] Comments added for complex code
- [ ] Documentation updated
- [ ] No new warnings or errors
- [ ] Manual testing completed
- [ ] Commit messages are clear
- [ ] Branch is up to date with main

---

## Reporting Issues

### Bug Reports

When reporting bugs, include:

1. **Description**: Clear description of the issue
2. **Steps to Reproduce**: Detailed steps to reproduce the bug
3. **Expected Behavior**: What you expected to happen
4. **Actual Behavior**: What actually happened
5. **Environment**:
   - Node.js version
   - OS and version
   - Any relevant configuration
6. **Logs**: Relevant log output
7. **Screenshots**: If applicable

**Example Issue**:

```markdown
**Bug Description**
Rate limiting not working correctly for /api/users endpoint

**Steps to Reproduce**
1. Start server with `npm start`
2. Send 150 requests to /api/users within 1 minute
3. All requests succeed (should be blocked after 100)

**Expected Behavior**
Requests 101+ should return 429 Too Many Requests

**Actual Behavior**
All 150 requests return 200 OK

**Environment**
- Node.js: v18.17.0
- OS: Ubuntu 22.04
- Branch: main

**Logs**
[Paste relevant log output]
```

### Feature Requests

When requesting features:

1. **Use Case**: Explain why the feature is needed
2. **Description**: Detailed description of the feature
3. **Examples**: Examples of how it would work
4. **Alternatives**: Any alternative solutions considered

---

## Questions?

If you have questions:

1. Check existing documentation
2. Search existing issues
3. Create a new issue with the `question` label
4. Reach out to project maintainers

---

## License

By contributing to g2labs-api, you agree that your contributions will be licensed under the MIT License.

---

Thank you for contributing! 🎉
