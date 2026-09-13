# Own Login System + OAuth Login Provider

**Khud ka complete login system** + **dusri websites ke liye OAuth 2.0 Login Provider**.

## Features

### Own Login System
- Email + Password **Sign Up** & **Login**
- Google Login
- GitHub Login
- Choose Account style page
- JWT session (NextAuth)

### Login Provider (for other websites)
- Dashboard – Client ID, Client Secret, Callback URL create & save
- **Test Login** button
- OAuth 2.0 Authorization Code flow
- JWT + Bearer token generation
- `/api/userinfo` endpoint

## Quick Start

```bash
npm install
cp .env.example .env.local
# Fill secrets (Google/GitHub optional for email login)
npm run dev
```

Open http://localhost:3000

- `/signup` – Naya account banao
- `/login` – Login (Email / Google / GitHub)
- `/dashboard` – OAuth clients manage karo

## Environment Variables

| Variable | Description |
|----------|-------------|
| `NEXTAUTH_URL` | Your site URL |
| `NEXTAUTH_SECRET` | Random secret for NextAuth |
| `JWT_SECRET` | Secret for signing access tokens |
| `GOOGLE_CLIENT_ID` / `SECRET` | Optional – Google login |
| `GITHUB_CLIENT_ID` / `SECRET` | Optional – GitHub login |

> Email/Password login ke liye Google/GitHub credentials zaroori nahi.

## How other apps use this as Login Provider

1. Dashboard se naya client banao → Client ID + Secret + Callback URL mil jayega
2. User ko redirect karo:
   ```
   GET /api/oauth/authorize?client_id=xxx&redirect_uri=https://yourapp.com/callback&response_type=code&scope=openid%20profile%20email&state=xyz
   ```
3. User Email / Google / GitHub se login karega
4. Callback pe `?code=...` milega
5. Code exchange:
   ```
   POST /api/oauth/token
   grant_type=authorization_code&code=...&redirect_uri=...&client_id=...&client_secret=...
   ```
6. Response me `access_token` (JWT) + `bearer_token` milta hai
7. User info: `GET /api/userinfo` with `Authorization: Bearer <token>`

## API Endpoints

| Method | Path | Description |
|--------|------|-------------|
| POST | `/api/register` | Signup (name, email, password) |
| GET | `/api/oauth/authorize` | Start OAuth flow |
| POST | `/api/oauth/token` | Exchange code for tokens |
| GET | `/api/userinfo` | Get user from token |
| GET/POST | `/api/clients` | List / create OAuth clients |

## Production notes

- Abhi in-memory store hai (demo). Cold start pe data reset ho sakta hai.
- Production me **Postgres / Supabase / MongoDB** lagao.
- Phone OTP / Firebase / Supabase login placeholders ready hain.

## Deploy

Repo already Vercel se linked hai. Env vars add karke redeploy karo.

Repo: https://github.com/kumarsumit68439-code/oauth-login-provider
