# Skillify — Auth API Reference

Base URL: `http://localhost:3000/api/auth`

---

## 1. Register

| Field | Value |
|-------|-------|
| **Method** | `POST` |
| **URL** | `/api/auth/register` |
| **Auth** | None |

### Request Body (`application/json`)
```json
{
  "username": "john_doe",
  "email": "john@example.com",
  "password": "yourPassword123"
}
```

| Field | Type | Required | Notes |
|-------|------|----------|-------|
| `username` | string | ✅ | Must be unique |
| `email` | string | ✅ | Must be unique |
| `password` | string | ✅ | Will be bcrypt hashed |

### Response — `201 Created`
```json
{
  "message": "User registered successfully",
  "user": {
    "id": "<mongoId>",
    "username": "john_doe",
    "email": "john@example.com",
    "isVerified": false
  }
}
```

### Error Responses
| Status | Message |
|--------|---------|
| `400` | `"User already exists"` |
| `500` | `"Internal server error"` |

> [!NOTE]
> On success an OTP is emailed to the registered address. The user **must** verify their email before they can log in.

---

## 2. Verify Email (OTP)

| Field | Value |
|-------|-------|
| **Method** | `POST` |
| **URL** | `/api/auth/verify-email` |
| **Auth** | None |

### Request Body (`application/json`)
```json
{
  "email": "john@example.com",
  "otp": "123456"
}
```

| Field | Type | Required | Notes |
|-------|------|----------|-------|
| `email` | string | ✅ | Same email used during registration |
| `otp` | string | ✅ | 6-digit code received via email |

### Response — `200 OK`
```json
{
  "message": "Email verified successfully",
  "user": {
    "id": "<mongoId>",
    "username": "john_doe",
    "email": "john@example.com",
    "isVerified": true
  }
}
```

### Error Responses
| Status | Message |
|--------|---------|
| `400` | `"Invalid OTP"` |

---

## 3. Login

| Field | Value |
|-------|-------|
| **Method** | `POST` |
| **URL** | `/api/auth/login` |
| **Auth** | None |

### Request Body (`application/json`)
```json
{
  "email": "john@example.com",
  "password": "yourPassword123"
}
```

| Field | Type | Required |
|-------|------|----------|
| `email` | string | ✅ |
| `password` | string | ✅ |

### Response — `200 OK`
```json
{
  "message": "Logged in successfully",
  "user": {
    "username": "john_doe",
    "email": "john@example.com"
  },
  "accessToken": "<jwt_access_token>"
}
```

> [!IMPORTANT]
> The **Refresh Token** is set as an `httpOnly` cookie (`refreshToken`) automatically — you do **not** receive it in the JSON body.
> Store the `accessToken` in memory (not localStorage) and pass it as `Authorization: Bearer <accessToken>` on protected requests.

### Error Responses
| Status | Message |
|--------|---------|
| `401` | `"Invalid email"` |
| `401` | `"Email not verified"` |
| `401` | `"Invalid password"` |

---

## 4. Refresh Tokens

| Field | Value |
|-------|-------|
| **Method** | `GET` |
| **URL** | `/api/auth/refreshTokens` |
| **Auth** | Cookie: `refreshToken` (sent automatically by browser) |

### Request
No body required. The `refreshToken` cookie is read automatically.

### Response — `200 OK`
```json
{
  "message": "Tokens refreshed successfully",
  "accessToken": "<new_jwt_access_token>"
}
```

> [!NOTE]
> A new `refreshToken` cookie is also set (rotating refresh token). The old one is invalidated in the session store.

### Error Responses
| Status | Message |
|--------|---------|
| `401` | `"No refresh token provided"` |
| `403` | `"Invalid refresh token"` (expired, tampered, or session revoked) |

---

## 5. Logout

| Field | Value |
|-------|-------|
| **Method** | `GET` |
| **URL** | `/api/auth/logout` |
| **Auth** | Cookie: `refreshToken` + (optional) `Authorization: Bearer <accessToken>` |

### Request Headers
```
Authorization: Bearer <accessToken>   ← optional but recommended
```

No body required.

### Response — `200 OK`
```json
{
  "message": "Logged out successfully"
}
```

> [!IMPORTANT]
> - The session's refresh token is **revoked** in the DB.
> - If the `Authorization` header is sent, the access token is added to the **blacklist** and immediately invalidated (expires automatically after 15 min via MongoDB TTL).
> - The `refreshToken` cookie is cleared.

### Error Responses
| Status | Message |
|--------|---------|
| `400` | `"No refresh token provided"` |
| `400` | `"Session not found or already revoked"` |
| `500` | `"Internal server error"` |

---

## 6. Logout All Sessions

| Field | Value |
|-------|-------|
| **Method** | `GET` |
| **URL** | `/api/auth/logoutAll` |
| **Auth** | Cookie: `refreshToken` + (optional) `Authorization: Bearer <accessToken>` |

### Request Headers
```
Authorization: Bearer <accessToken>   ← optional but recommended
```

No body required.

### Response — `200 OK`
```json
{
  "message": "Logged out from all sessions successfully"
}
```

> [!IMPORTANT]
> - **All** active sessions for the user are revoked (useful for "sign out everywhere").
> - The current access token is blacklisted if provided in the header.
> - The `refreshToken` cookie is cleared.

### Error Responses
| Status | Message |
|--------|---------|
| `400` | `"No refresh token provided"` |
| `500` | `"Internal server error"` |

---

## Token Strategy Summary

```
┌─────────────────┬────────────────────┬────────────────────────────────┐
│ Token           │ Storage            │ Lifetime                       │
├─────────────────┼────────────────────┼────────────────────────────────┤
│ Access Token    │ JS memory (state)  │ 15 minutes                     │
│ Refresh Token   │ httpOnly cookie    │ 7 days (rotated on each use)   │
└─────────────────┴────────────────────┴────────────────────────────────┘
```

### Frontend Flow
1. **Login** → store `accessToken` in React state / context.
2. **Every protected API call** → send `Authorization: Bearer <accessToken>`.
3. **On 401 "Token expired"** → call `GET /api/auth/refreshTokens` to silently get a new access token.
4. **Logout** → call `GET /api/auth/logout` with the `Authorization` header, then clear the access token from state.
