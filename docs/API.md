# API Documentation

## Main Endpoints

### CV Generation

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/default-data` | Returns default CV data |
| POST | `/generate` | Generates PDF from JSON |
| POST | `/import` | Import CV from PDF (AI) |
| POST | `/import-stream` | Import CV with SSE streaming |
| POST | `/optimal-size` | Find optimal template size |
| GET | `/api/health` | Health check |

### Authentication

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Register new user |
| POST | `/api/auth/login` | Login with email/password |
| POST | `/api/auth/guest` | Create guest account |
| GET | `/api/auth/google/login` | Redirect to Google OAuth |
| GET | `/api/auth/me` | Get current user info |
| GET | `/api/auth/me/export` | Export user data (GDPR) |
| DELETE | `/api/auth/me` | Delete account (GDPR) |

### Resume Management

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/resumes` | Create new resume |
| GET | `/api/resumes` | List user resumes |
| GET | `/api/resumes/{id}` | Get specific resume |
| PUT | `/api/resumes/{id}` | Update resume |
| DELETE | `/api/resumes/{id}` | Delete resume |

## Limits and Quotas

- **Guest users**: Max 3 resumes
- **Registered users**: Max 50 resumes
- **Resume content**: Max 100 KB per resume
