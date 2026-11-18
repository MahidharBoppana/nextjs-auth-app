# Next.js Auth App

A full-stack authentication starter built with **Next.js 16 (App Router)**, **MongoDB**, and **JWT**. It includes user signup, login, logout, email verification, password reset, protected routes, and a user profile page.

## Features

- ✅ User registration with hashed passwords (bcrypt)
- ✅ Login / logout with JWT stored in HttpOnly cookies
- ✅ Email verification flow (verify email before activating account)
- ✅ Forgot password / reset password via email
- ✅ Protected routes with Next.js middleware (redirects based on auth state)
- ✅ User profile page
- ✅ MongoDB with Mongoose
- ✅ Email sending with Nodemailer (Mailtrap sandbox ready)
- ✅ TypeScript + Tailwind CSS

## Tech Stack

| Layer | Technology |
|-------|------------|
| Framework | Next.js 16 (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS |
| Database | MongoDB + Mongoose |
| Auth | JSON Web Tokens (JWT) + bcryptjs |
| Email | Nodemailer |
| UI Toast | react-hot-toast |
| Icons | lucide-react |

## Project Structure

```
nextjs-auth-app/
├── .example.env          # Template env file (copy to .env)
├── .env                  # Local secrets (gitignored — do not commit)
├── .gitignore
├── next.config.ts
├── tsconfig.json
├── package.json
├── README.md
├── src/
│   ├── app/
│   │   ├── api/users/
│   │   │   ├── login/route.ts
│   │   │   ├── logout/route.ts
│   │   │   ├── me/route.ts
│   │   │   ├── signup/route.ts
│   │   │   └── verifyEmail/route.ts
│   │   ├── login/          # Login page
│   │   ├── signup/         # Signup page
│   │   ├── profile/        # Protected profile page
│   │   ├── verifyemail/    # Email verification page
│   │   ├── layout.tsx
│   │   ├── page.tsx
│   │   └── globals.css
│   ├── dbConfig/dbConfig.ts   # MongoDB connection helper
│   ├── helpers/mailer.ts      # Nodemailer email helper
│   ├── models/user.model.js   # Mongoose User schema
│   └── middleware.ts          # Route protection middleware
└── public/
```

## Environment Setup

1. Copy the example env file:
   ```bash
   cp .example.env .env
   # or on Windows:
   copy .example.env .env
   ```

2. Open `.env` and fill in your values:

   | Variable | Description |
   |----------|-------------|
   | `MONGODB_URI` | Your MongoDB connection string (Atlas or local) |
   | `TOKEN_SECRET` | Secret for email verification / reset tokens |
   | `JWT_SECRET` | Secret for signing access tokens |
   | `DOMAIN` | Base URL of your app (e.g. `http://localhost:3000`) |

   > ⚠️ `.env` is gitignored and must never be committed. `.example.env` is committed as a template.

3. (Mailer) Email sending is wired through Nodemailer using a Mailtrap sandbox in `src/helpers/mailer.ts`. Replace the hardcoded credentials with your own SMTP settings for production.

## Getting Started

### Install dependencies

```bash
npm install
```

### Run the development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

Other package managers:

```bash
yarn dev
# or
pnpm dev
# or
bun dev
```

### Available scripts

| Script | Description |
|--------|-------------|
| `npm run dev` | Start dev server with Turbopack |
| `npm run build` | Build for production |
| `npm run start` | Start production server |
| `npm run lint` | Run ESLint |

## API Routes

All routes live under `/api/users/`:

| Method | Route | Description |
|--------|-------|-------------|
| `POST` | `/api/users/signup` | Register a new user |
| `POST` | `/api/users/login` | Log in and set JWT cookie |
| `POST` | `/api/users/logout` | Clear the JWT cookie |
| `GET` | `/api/users/me` | Get the current authenticated user |
| `GET` | `/api/users/verifyEmail` | Verify email via token link |

## Authentication Flow

1. User signs up → account created with `isVerified: false`, verification email sent.
2. User clicks the verify link → email verified, redirected to login.
3. User logs in → JWT set in an HttpOnly cookie.
4. Middleware (`src/middleware.ts`) protects `/` and `/profile/*`:
   - Authenticated users visiting `/login` or `/signup` are redirected to `/profile`.
   - Unauthenticated users visiting protected routes are redirected to `/login`.

## Deployment

The easiest way to deploy is [Vercel](https://vercel.com):

1. Push this repo to GitHub.
2. Import the project in Vercel.
3. Add all environment variables from `.env` (except secrets you keep local).
4. Deploy.

See the [Next.js deployment docs](https://nextjs.org/docs/app/building-your-application/deploying) for more.

## License

MIT
