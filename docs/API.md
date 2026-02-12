# API Reference

Base URL: `https://sivee.pro` (production) or `http://localhost:8000` (development)

Interactive documentation (Swagger UI) is available at `/docs`.

## Authentication

Most endpoints require a JWT Bearer token. Include it in the `Authorization` header:

```
Authorization: Bearer <token>
```

Tokens are obtained via the login or register endpoints. Tokens expire after 30 minutes by default (configurable via `ACCESS_TOKEN_EXPIRE_MINUTES`).

## Endpoints

### Authentication

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/api/auth/register` | No | Register new user |
| POST | `/api/auth/login` | No | Login with email/password |
| POST | `/api/auth/guest` | No | Create guest account |
| GET | `/api/auth/google/login` | No | Redirect to Google OAuth |
| GET | `/api/auth/me` | Yes | Get current user info |
| GET | `/api/auth/me/export` | Yes | Export all user data (GDPR) |
| DELETE | `/api/auth/me` | Yes | Delete account and all data (GDPR) |

#### Register

```bash
curl -X POST /api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email": "user@example.com", "password": "securepassword"}'
```

Response:
```json
{"access_token": "eyJ...", "token_type": "bearer"}
```

#### Login

```bash
curl -X POST /api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email": "user@example.com", "password": "securepassword"}'
```

Response:
```json
{"access_token": "eyJ...", "token_type": "bearer"}
```

#### Guest account

```bash
curl -X POST /api/auth/guest
```

Returns a token for a temporary guest account (limited to 3 resumes). The guest can later be upgraded to a permanent account via the register endpoint with the guest token.

### Resume Management

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/api/resumes` | Yes | Create new resume |
| GET | `/api/resumes` | Yes | List user's resumes |
| GET | `/api/resumes/{id}` | Yes | Get specific resume |
| PUT | `/api/resumes/{id}` | Yes | Update resume |
| DELETE | `/api/resumes/{id}` | Yes | Delete resume |

### CV Generation

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/default-data` | No | Returns default CV data structure |
| POST | `/generate` | No | Generate PDF from JSON data |
| POST | `/import` | Yes | Import CV from uploaded PDF (AI extraction) |
| POST | `/import-stream` | Yes | Import CV with SSE streaming progress |
| POST | `/optimal-size` | No | Find optimal font size for single-page fit |

### Health

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/health` | Application health check |
| GET | `/health_db` | Database connectivity check |

## Limits and Quotas

| Resource | Guest | Registered |
|----------|-------|------------|
| Max resumes | 3 | 50 |
| Resume content size | 100 KB | 100 KB |

## Error Responses

The API returns standard HTTP status codes:

| Code | Meaning |
|------|---------|
| 400 | Bad request (validation error) |
| 401 | Unauthorized (missing or invalid token) |
| 403 | Forbidden (e.g. guest limit reached) |
| 404 | Resource not found |
| 422 | Unprocessable entity (invalid input) |
| 500 | Internal server error |

Error body format:
```json
{"detail": "Error description"}
```
