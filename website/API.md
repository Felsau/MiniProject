# 📚 API Documentation

## Overview

This document describes all API endpoints available in the Job Recruitment System.

## Base URL

```
http://localhost:3000
```

## Authentication

All authenticated endpoints require a valid session. Authentication is handled through NextAuth.js with credentials provider.

### Login
```
POST /api/auth/callback/credentials
Content-Type: application/json

{
  "username": "admin",
  "password": "123456"
}
```

### Logout
```
POST /api/auth/signout
```

---

## API Endpoints

### 1. Jobs

#### Get All Jobs
```
GET /api/job

Response: 200 OK
[
  {
    "id": 1,
    "title": "Senior React Developer",
    "department": "IT - Development",
    "location": "Bangkok (Hybrid)",
    "salary": "60,000 - 80,000 THB",
    "description": "...",
    "createdAt": "2026-01-30T12:00:00Z",
    "updatedAt": "2026-01-30T12:00:00Z",
    "authorId": 1
  },
  ...
]
```

#### Create Job (Authenticated)
```
POST /api/job
Content-Type: application/json
Authorization: Required (session)

{
  "title": "Frontend Developer",
  "department": "IT",
  "location": "Bangkok",
  "salary": "50,000 - 70,000 THB",
  "description": "Looking for experienced frontend developer..."
}

Response: 201 Created
{
  "id": 9,
  "title": "Frontend Developer",
  "department": "IT",
  "location": "Bangkok",
  "salary": "50,000 - 70,000 THB",
  "description": "...",
  "createdAt": "2026-01-30T12:30:00Z",
  "updatedAt": "2026-01-30T12:30:00Z",
  "authorId": 1
}
```

#### Update Job (Authenticated, Author Only)
```
PUT /api/job/:id
Content-Type: application/json
Authorization: Required (session)

{
  "title": "Senior Frontend Developer",
  "department": "IT",
  "location": "Bangkok",
  "salary": "60,000 - 80,000 THB",
  "description": "Updated description..."
}

Response: 200 OK
{
  "id": 9,
  "title": "Senior Frontend Developer",
  ...
}
```

#### Delete Job (Authenticated, Author Only)
```
DELETE /api/job/:id
Authorization: Required (session)

Response: 200 OK
{
  "message": "Job deleted successfully"
}
```

#### Get Single Job
```
GET /api/job/:id

Response: 200 OK
{
  "id": 1,
  "title": "Senior React Developer",
  ...
}
```

---

### 2. Authentication

#### Register User
```
POST /api/register
Content-Type: application/json

{
  "username": "newuser",
  "password": "password123",
  "fullName": "New User",
  "email": "newuser@example.com"
}

Response: 201 Created
{
  "id": 5,
  "username": "newuser",
  "fullName": "New User",
  "email": "newuser@example.com",
  "role": "USER",
  "createdAt": "2026-01-30T13:00:00Z"
}
```

#### Get Authentication Providers
```
GET /api/auth/providers

Response: 200 OK
{
  "Credentials": {
    "id": "credentials",
    "name": "Credentials",
    "type": "credentials",
    "signinUrl": "http://localhost:3000/api/auth/signin/credentials",
    "callbackUrl": "http://localhost:3000/api/auth/callback/credentials"
  }
}
```

#### Get CSRF Token
```
GET /api/auth/csrf

Response: 200 OK
{
  "csrfToken": "abc123..."
}
```

#### Get Session
```
GET /api/auth/session

Response: 200 OK (if authenticated)
{
  "user": {
    "id": 1,
    "username": "admin",
    "fullName": "Somchai Administrator",
    "email": "admin@company.com",
    "role": "ADMIN"
  },
  "expires": "2026-02-02T12:00:00Z"
}

Response: 200 OK (if not authenticated)
null
```

---

## Response Format

### Success Response
```json
{
  "data": {...},
  "message": "Success message",
  "status": 200
}
```

### Error Response
```json
{
  "error": "Error message",
  "status": 400,
  "code": "ERROR_CODE"
}
```

---

## Common Error Codes

| Status | Code | Description |
|--------|------|-------------|
| 400 | BAD_REQUEST | Invalid request data |
| 401 | UNAUTHORIZED | Authentication required |
| 403 | FORBIDDEN | Insufficient permissions |
| 404 | NOT_FOUND | Resource not found |
| 409 | CONFLICT | Resource already exists (e.g., duplicate username) |
| 500 | SERVER_ERROR | Internal server error |

---

## Request/Response Examples

### Example: Create Job and Get All Jobs

```bash
# 1. Login
curl -X POST http://localhost:3000/api/auth/callback/credentials \
  -H "Content-Type: application/json" \
  -d '{
    "username": "admin",
    "password": "123456"
  }'

# 2. Get session (to verify login)
curl http://localhost:3000/api/auth/session

# 3. Create job
curl -X POST http://localhost:3000/api/job \
  -H "Content-Type: application/json" \
  -d '{
    "title": "DevOps Engineer",
    "department": "Infrastructure",
    "location": "Remote",
    "salary": "70,000 - 90,000 THB",
    "description": "We are looking for a DevOps engineer..."
  }'

# 4. Get all jobs
curl http://localhost:3000/api/job

# 5. Get specific job
curl http://localhost:3000/api/job/1

# 6. Logout
curl -X POST http://localhost:3000/api/auth/signout
```

---

## Rate Limiting

Currently, no rate limiting is implemented. It's recommended to add rate limiting for production.

---

## Pagination

Pagination is not yet implemented for job listings. All jobs are returned in a single response. Future versions will include:

```
GET /api/job?page=1&limit=10&sort=createdAt&order=desc
```

---

## Filtering & Searching

Filtering and searching are not yet implemented. Future versions will support:

```
GET /api/job?search=developer&department=IT&location=Bangkok
```

---

## WebSocket (Real-time Updates)

Real-time updates are not yet implemented. Planned for future versions.

---

## API Versioning

The API currently uses no version prefix. Version 1 endpoints will be available at:
- `/api/v1/...` (planned for future)

---

## CORS

CORS is currently configured to allow requests from the same domain. For production, configure appropriate CORS headers based on your deployment environment.

---

## Deprecation Policy

- Endpoints will be deprecated with at least 2 weeks notice
- Deprecated endpoints will continue to function for the deprecation period
- Clients will receive a `Deprecation` header: `Deprecation: true`
- Alternative endpoints will be provided in the `Sunset` header

---

## Support

For API issues or questions, please:
1. Check this documentation
2. Review the code in `src/app/api/`
3. Open an issue on GitHub
4. Contact the development team

---

## Changelog

### v1.0.0 (2026-01-30)
- Initial API release
- Basic CRUD for jobs
- User registration and authentication
- Session management

---

**Note**: This API documentation is continuously updated. Please check back regularly for updates and new endpoints.
