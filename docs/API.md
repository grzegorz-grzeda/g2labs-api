# API Documentation

## Base URL

```
http://localhost:3000
```

## Rate Limiting

All endpoints are rate-limited to prevent abuse:

- **General API endpoints**: 100 requests per 15 minutes per IP address
- **Authentication endpoints**: 5 requests per 15 minutes per IP address (when implemented)

Rate limit information is included in response headers:
- `RateLimit-Limit`: Maximum number of requests allowed in the window
- `RateLimit-Remaining`: Number of requests remaining in the current window
- `RateLimit-Reset`: Time when the rate limit window resets (Unix timestamp)

### Rate Limit Exceeded Response

When rate limit is exceeded:

**Status Code**: `429 Too Many Requests`

```json
{
  "error": "Too many requests from this IP, please try again later.",
  "retryAfter": "15 minutes"
}
```

## Common Response Codes

| Code | Description |
|------|-------------|
| `200` | Success |
| `400` | Bad Request - Invalid input |
| `404` | Not Found - Resource doesn't exist |
| `429` | Too Many Requests - Rate limit exceeded |
| `500` | Internal Server Error |

## Endpoints

### Health Check

Check if the API is running.

**Endpoint**: `GET /`

**Request**:
```bash
curl http://localhost:3000/
```

**Response**:

Status: `200 OK`

```json
{
  "message": "API is running"
}
```

**Example with curl**:
```bash
curl -X GET http://localhost:3000/ \
  -H "Content-Type: application/json"
```

**Example with JavaScript (fetch)**:
```javascript
fetch('http://localhost:3000/')
  .then(response => response.json())
  .then(data => console.log(data))
  .catch(error => console.error('Error:', error));
```

**Example with Node.js (axios)**:
```javascript
const axios = require('axios');

axios.get('http://localhost:3000/')
  .then(response => {
    console.log(response.data);
  })
  .catch(error => {
    console.error('Error:', error.message);
  });
```

---

## Error Handling

All errors follow a consistent format:

### Error Response Format

```json
{
  "error": "Error message description"
}
```

### Example Error Responses

**Internal Server Error (500)**:
```json
{
  "error": "Internal server error"
}
```

**Rate Limit Exceeded (429)**:
```json
{
  "error": "Too many requests from this IP, please try again later.",
  "retryAfter": "15 minutes"
}
```

---

## Request Headers

### Recommended Headers

```
Content-Type: application/json
Accept: application/json
```

---

## Testing the API

### Using curl

**Basic GET request**:
```bash
curl -v http://localhost:3000/
```

**Check rate limit headers**:
```bash
curl -v http://localhost:3000/ 2>&1 | grep -i ratelimit
```

### Using HTTPie

```bash
http GET http://localhost:3000/
```

### Using Postman

1. Create a new request
2. Set method to `GET`
3. Set URL to `http://localhost:3000/`
4. Click "Send"
5. Check headers tab to see rate limit information

---

## Future Endpoints (Placeholder)

This section will be updated as new endpoints are added to the API.

### Authentication (Coming Soon)

- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login and receive token
- `POST /api/auth/logout` - Logout and invalidate token

### User Management (Coming Soon)

- `GET /api/users/:id` - Get user details
- `PUT /api/users/:id` - Update user information
- `DELETE /api/users/:id` - Delete user account

---

## Versioning

Currently, the API is in version `0.0.1` and does not use URL-based versioning. Future versions may introduce versioned endpoints like `/v1/`, `/v2/`, etc.

---

## Support

For issues, questions, or contributions, please refer to the main [README.md](../README.md) and [CONTRIBUTING.md](./CONTRIBUTING.md).
