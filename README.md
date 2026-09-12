# OAuth Login Provider

Apni website ko **OAuth 2.0 Identity Provider** banao.

Dusri websites isse Google, GitHub (aur baad mein Firebase / Supabase / Phone) login le sakti hain.

## Features

- **Dashboard** – Client ID, Client Secret, Callback URL create & save
- **Test Login** button
- **Choose Account** style login page (Google + GitHub)
- OAuth 2.0 Authorization Code flow
- JWT + Bearer token generation
- `/api/userinfo` endpoint
- Hooks ready (Next.js App Router API routes)

## Quick Start

```bash
npm install
cp .env.example .env.local
# Fill Google & GitHub credentials + secrets
npm run dev
```

Open http://localhost:3000

## Environment Variables

| Variable | Description |
|----------|-------------|
| `NEXTAUTH_URL` | Your site URL |
| `NEXTAUTH_SECRET` | Random secret for NextAuth |
| `JWT_SECRET` | Secret for signing access tokens |
| `GOOGLE_CLIENT_ID` / `SECRET` | From Google Cloud Console |
| `GITHUB_CLIENT_ID` / `SECRET` | From GitHub Developer Settings |

## How other apps use this provider

1. Dashboard se naya client banao → Client ID + Secret + Callback URL mil jayega
2. User ko redirect karo:
   ```
   GET /api/oauth/authorize?client_id=xxx&redirect_uri=https://yourapp.com/callback&response_type=code&scope=openid%20profile%20email&state=xyz
   ```
3. User Google/GitHub se login karega (choose account page)
4. Callback pe `?code=...` milega
5. Code exchange:
   ```
   POST /api/oauth/token
   Content-Type: application/x-www-form-urlencoded

   grant_type=authorization_code
   &code=...
   &redirect_uri=...
   &client_id=...
   &client_secret=...
   ```
6. Response:
   ```json
   {
     "access_token": "eyJ...",
     "token_type": "Bearer",
     "expires_in": 3600,
     "bearer_token": "...",
     "id_token": "eyJ..."
   }
   ```
7. User info:
   ```
   GET /api/userinfo
   Authorization: Bearer <access_token>
   ```

## Production notes

- In-memory store is used for demo (clients/codes reset on cold start).
- Production me Postgres / Supabase / MongoDB use karo.
- Firebase Phone Auth & Supabase login placeholders already hain – easily add kar sakte ho.

## Deploy on Vercel

1. Push this repo
2. Import on Vercel
3. Add environment variables
4. Deploy

---

Made for easy multi-app login providing.
