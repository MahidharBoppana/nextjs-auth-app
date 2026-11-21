# Next.js Auth App

A full-stack authentication starter built with **Next.js 16 (App Router)**, **TypeScript**, **Tailwind CSS**, **MongoDB + Mongoose**, and **JWT**. It includes user signup, login, logout, email verification, forgot/reset password, protected routes, and a user profile page.

---

## Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Environment Setup](#environment-setup)
- [Getting Started](#getting-started)
- [Available Scripts](#available-scripts)
- [API Routes](#api-routes)
- [Authentication Flows](#authentication-flows)
- [Route Protection (Middleware)](#route-protection-middleware)
- [User Model](#user-model)
- [Deployment](#deployment)
- [License](#license)

---

## Features

- ✅ User registration with bcrypt-hashed passwords (salt rounds: 10)
- ✅ Login / logout with JWT stored in an **HttpOnly** cookie
- ✅ Email verification flow (account created `isVerified: false`, verification email sent)
- ✅ Forgot password / reset password via email (time-limited, single-use tokens)
- ✅ Protected routes with Next.js middleware (redirects based on auth state)
- ✅ User profile page (view account info, logout)
- ✅ MongoDB with Mongoose
- ✅ Email sending with Nodemailer (Mailtrap sandbox ready)
- ✅ TypeScript + Tailwind CSS
- ✅ Client-side toasts via `react-hot-toast`
- ✅ Icons via `lucide-react`

---

## Tech Stack

| Layer | Technology |
|-------|------------|
| Framework | Next.js 16 (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS |
| Database | MongoDB + Mongoose |
| Auth | JSON Web Tokens (JWT) + bcryptjs |
| HTTP client | Axios |
| Email | Nodemailer (Mailtrap sandbox) |
| UI Toast | react-hot-toast |
| Icons | lucide-react |

---

## Project Structure

```
nextjs-auth-app/
├── .example.env          # Template env file (copy to .env)
├── .env                  # Local secrets (gitignored — do not commit)
├── .gitignore
├── next.config.ts        # Next.js config (Turbopack + Tailwind)
├── tsconfig.json         # TypeScript config with path alias "@/": "./src/*"
├── package.json
├── README.md
├── src/
│   ├── app/
│   │   ├── (myApp)/
│   │   │   ├── components/
│   │   │   │   └── ToasterProvider.jsx   # react-hot-toast provider
│   │   │   ├── forgot-password/page.tsx  # Forgot password page
│   │   │   ├── login/page.tsx            # Login page
│   │   │   ├── profile/
│   │   │   │   ├── page.tsx              # Protected profile page
│   │   │   │   └── [id]/page.tsx         # Dynamic profile page (placeholder)
│   │   │   ├── resetpassword/page.tsx    # Reset password page
│   │   │   ├── signup/page.tsx           # Signup page
│   │   │   └── verifyemail/page.tsx      # Email verification page
│   │   ├── api/users/
│   │   │   ├── forgotPassword/route.ts   # POST — send reset password email
│   │   │   ├── login/route.ts            # POST — login & set JWT cookie
│   │   │   ├── logout/route.ts           # GET — clear JWT cookie
│   │   │   ├── me/route.ts               # GET — current authenticated user
│   │   │   ├── signup/route.ts           # POST — register & send verify email
│   │   │   ├── verifyEmail/route.ts      # POST — verify email token
│   │   │   └── verifyPassword/route.ts   # POST — reset password with token
│   │   ├── layout.tsx                    # Root layout + ToasterProvider
│   │   ├── page.tsx                      # Root — redirects to /login
│   │   └── globals.css                   # Tailwind + Geist fonts
│   ├── dbConfig/dbConfig.ts   # MongoDB connection helper (mongoose)
│   ├── helpers/mailer.ts      # Nodemailer email helper (Mailtrap)
│   ├── models/user.model.js   # Mongoose User schema
│   └── middleware.ts          # Route protection middleware
├── public/
│   ├── file.svg
│   ├── globe.svg
│   ├── next.svg
│   ├── vercel.svg
│   └── window.svg
└── next-env.d.ts
```

---

## Environment Setup

### 1. Copy the example env file

```bash
# macOS / Linux
cp .example.env .env

# Windows (Command Prompt)
copy .example.env .env

# Windows (PowerShell)
copy .example.env .env
```

### 2. Open `.env` and fill in your values

| Variable | Description | Example |
|----------|-------------|---------|
| `MONGODB_URI` | MongoDB connection string (Atlas or local) | `mongodb+srv://<user>:<pass>@cluster.mongodb.net/db` |
| `JWT_SECRET` | Secret for signing access tokens | `a-long-random-secret` |
| `TOKEN_SECRET` | Secret for email verification / reset tokens *(reserved; tokens are generated with `crypto`)* | `your_token_secret_here` |
| `DOMAIN` | Base URL of your app (used in email links) | `http://localhost:3000` |
| `MAILTRAP_USER` | Mailtrap sandbox username | `560988584d0b31` |
| `MAILTRAP_PASS` | Mailtrap sandbox password | `49259b146ff608` |

> ⚠️ `.env` is gitignored and must never be committed. `.example.env` is committed as a template.

### 3. Mailer note

Email sending is wired through Nodemailer using a **Mailtrap sandbox** (`sandbox.smtp.mailtrap.io:2525`) in `src/helpers/mailer.ts`. Replace the hardcoded host/credentials with your own SMTP provider for production. Verification and reset links point to `${DOMAIN}/verifyemail?token=...` and `${DOMAIN}/resetpassword?token=...`.

---

## Getting Started

### Install dependencies

```bash
npm install
```

Other package managers:

```bash
yarn install
# or
pnpm install
# or
bun install
```

### Run the development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser. The root path redirects to `/login`.

---

## Available Scripts

| Script | Description |
|--------|-------------|
| `npm run dev` | Start dev server with Turbopack |
| `npm run build` | Build for production |
| `npm run start` | Start production server |
| `npm run lint` | Run ESLint |

---

## API Routes

All routes live under `/api/users/` and connect to MongoDB on every request via `connect()`.

| Method | Route | Description | Auth required |
|--------|-------|-------------|---------------|
| `POST` | `/api/users/signup` | Register a new user (hashes password, sends verification email) | No |
| `POST` | `/api/users/login` | Log in; validates credentials & `isVerified`, sets JWT cookie | No |
| `GET` | `/api/users/logout` | Clears the JWT cookie | No |
| `GET` | `/api/users/me` | Returns the current authenticated user (excludes sensitive fields) | Yes (JWT cookie) |
| `POST` | `/api/users/verifyEmail` | Verifies email via token link (sets `isVerified: true`) | No |
| `POST` | `/api/users/forgotPassword` | Sends a password-reset email to a registered email | No |
| `POST` | `/api/users/verifyPassword` | Resets password using a valid reset token | No |

### Request / Response examples

**Signup** `POST /api/users/signup`
```json
// Request
{ "username": "alice", "email": "alice@example.com", "password": "secure123" }

// Response (201)
{ "message": "User created successfully", "success": true, "user": { ... } }
```

**Login** `POST /api/users/login`
```json
// Request
{ "email": "alice@example.com", "password": "secure123" }

// Response (200) — sets HttpOnly cookie "token"
{ "message": "User logged in successfully", "success": true }
```

**Me** `GET /api/users/me`
```json
// Response (200)
{ "message": "User retrieved successfully", "success": true, "user": { "_id": "...", "username": "alice", "email": "alice@example.com", "isVerified": true, "isAdmin": false, "createdAt": "..." } }
```

**Verify Email** `POST /api/users/verifyEmail`
```json
// Request
{ "token": "<plain verification token>" }

// Response (200)
{ "success": true, "message": "Email verified successfully" }
```

**Forgot Password** `POST /api/users/forgotPassword`
```json
// Request
{ "email": "alice@example.com" }

// Response (200)
{ "secure": true, "message": "Check your email to change the password" }
```

**Reset Password** `POST /api/users/verifyPassword`
```json
// Request
{ "token": "<plain reset token>", "newPassword": "newsecure123" }

// Response (200)
{ "success": true, "message": "Password reset successfull" }
```

---

## Authentication Flows

### 1. Signup → Email Verification
1. Client posts `{ username, email, password }` to `/api/users/signup`.
2. Server checks for an existing user with the same email; if found, returns `400`.
3. Password is hashed with `bcrypt` (salt 10) and the user is created with `isVerified: false`.
4. `sendEmail` generates a 32-byte random token, hashes it with SHA-256, stores `verifyToken` + `verifyTokenExpiry` (1 hour) on the user, and emails a link to `${DOMAIN}/verifyemail?token=<plainToken>`.
5. Client opens the link → `verifyemail` page posts the token to `/api/users/verifyEmail`.
6. Server hashes the token, finds a matching unexpired `verifyToken`, sets `isVerified: true`, clears the token fields.

### 2. Login → Session
1. Client posts `{ email, password }` to `/api/users/login`.
2. Server finds the user, compares the password with `bcrypt.compare`, and rejects unverified users (`401`).
3. A JWT (`{ id, email }`, signed with `JWT_SECRET`, expires in `1d`) is set as an **HttpOnly**, `SameSite=Strict` cookie named `token` (max age 1 day).
4. Client is redirected to `/profile`.

### 3. Forgot / Reset Password
1. Client posts `{ email }` to `/api/users/forgotPassword`; server emails a link to `${DOMAIN}/resetpassword?token=<plainToken>` after storing `forgotPasswordToken` + 1-hour expiry.
2. Client opens the link → `resetpassword` page captures the token from URL search params.
3. Client posts `{ token, newPassword }` to `/api/users/verifyPassword`.
4. Server hashes the token, finds a matching unexpired `forgotPasswordToken`, hashes the new password with bcrypt, saves it, and clears the token fields.

### 4. Logout
1. Client calls `GET /api/users/logout`.
2. Server clears the `token` cookie (`expires: new Date(0)`).

---

## Route Protection (Middleware)

`src/middleware.ts` runs on these paths: `/`, `/profile/:path*`, `/login`, `/signup`.

| Condition | Action |
|-----------|--------|
| Has valid `token` cookie AND visiting `/login` or `/signup` | Redirect to `/profile` |
| No `token` cookie AND visiting a protected path (`/` or `/profile/*`) | Redirect to `/login` |
| Otherwise | Allow request |

The root page (`/`) immediately redirects to `/login`, so unauthenticated users always land on the login screen.

---

## User Model

`src/models/user.model.js` — Mongoose schema:

| Field | Type | Required | Default | Notes |
|-------|------|----------|---------|-------|
| `username` | String | yes | — | unique, trimmed |
| `email` | String | yes | — | unique, trimmed |
| `password` | String | yes | — | stored bcrypt-hashed |
| `isVerified` | Boolean | — | `false` | set `true` after email verification |
| `isAdmin` | Boolean | — | `false` | account role flag |
| `forgotPasswordToken` | String | — | — | reset token hash |
| `forgotPasswordTokenExpiry` | Date | — | — | 1-hour expiry |
| `verifyToken` | String | — | — | email verification token hash |
| `verifyTokenExpiry` | Date | — | — | 1-hour expiry |
| `createdAt`, `updatedAt` | Date | — | auto | `timestamps: true` |

The `/api/users/me` endpoint returns the user with `password`, `forgotPasswordToken`, and `verifyToken` excluded.

---

## Deployment

The easiest way to deploy is [Vercel](https://vercel.com):

1. Push this repo to GitHub.
2. Import the project in Vercel.
3. Add all environment variables from `.env` to the Vercel project settings.
4. Deploy.

See the [Next.js deployment docs](https://nextjs.org/docs/app/building-your-application/deploying) for more.

> ⚠️ For production, replace the Mailtrap sandbox SMTP settings in `src/helpers/mailer.ts` with your own SMTP provider, and use strong, randomly generated `JWT_SECRET` / `TOKEN_SECRET` values.

---

## License

MIT