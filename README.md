# user-auth

A minimal, secure authentication example built with Next.js (App Router), NextAuth (Google + Credentials), and Prisma. This project implements Sign In, Sign Up, and a Dashboard with editable user profile details — plus validation and unit tests.

**Status**: Implementation includes NextAuth providers (Google + Credentials), Prisma schema, API routes under `src/app/api`, Zod validation schemas, and a responsive frontend with sign-in, register, and dashboard screens.

## 🎥 Demo


https://github.com/user-attachments/assets/4bd72b95-8f2d-4858-8a9f-5a9a90ffbbab



**Key Requirements (assignment)**

- **Sign In screen**: Email/password & Google sign-in via NextAuth.
- **Sign Up screen**: Register new users (credentials) and store them via Prisma.
- **Dashboard**: Displays user information and allows editing profile data.
- **Responsive frontend**: Mobile-first, accessible UI.
- **Validation**: Request & form validation using Zod.
- **Testing**: Unit tests for frontend components and backend validation/routes.

**Tech Stack**

- **Framework**: Next.js (App Router)
- **Auth**: NextAuth (Google provider + Credentials provider)
- **ORM**: Prisma
- **Database**: Any database supported by Prisma (configure `DATABASE_URL`)
- **Language**: TypeScript
- **Styling**: TailwindCss
- **Testing**: Jest / React Testing Library or Vitest (project includes test scripts)

**Quick Links (paths in this repo)**

- **NextAuth route**: `src/app/api/auth/[...nextauth]/route.ts`
- **Register API**: `src/app/api/register/route.ts`
- **User API**: `src/app/api/user/route.ts`
- **Frontend pages/components**: `src/app/(auth)/register/page.tsx`, `src/app/page.tsx`, `src/components/*`
- **Prisma schema**: `prisma/schema.prisma`
- **Validation schemas**: `src/schema/signInSchema.ts`, `src/schema/signUpSchema.ts`, `src/schema/updateSchema.ts`

**Getting Started (local development)**

1. Clone the repository

   ```bash
   git clone <repository-url>
   cd user-auth
   ```

2. Install dependencies

   ```bash
   npm install
   ```

3. Create a `.env` file at the project root. Example values below.

4. Setup Prisma (generate client and run migrations)

   ```bash
   npx prisma generate
   npx prisma migrate dev --name init
   ```

5. Run the development server

   ```bash
   npm run dev
   ```

**Environment Variables**
Create a `.env` file with the following variables. Adjust values per your provider and environment.

```
DATABASE_URL="postgresql://USER:PASSWORD@HOST:PORT/DATABASE?schema=public"
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=<a-long-random-string>
GOOGLE_CLIENT_ID=<your-google-client-id>
GOOGLE_CLIENT_SECRET=<your-google-client-secret>
```

Notes:

- `DATABASE_URL`: Prisma-compatible connection string (Postgres, MySQL, SQLite, etc.).
- `NEXTAUTH_SECRET`: Secure random string used by NextAuth.
- Google OAuth credentials: configure the redirect URI to `http://localhost:3000/api/auth/callback/google`.

**Authentication**

- This project uses NextAuth with two providers:
  - **Google Provider**: OAuth sign-in.
  - **Credentials Provider**: Email + password sign-in for register/sign-in flows.
- The Credentials provider uses Prisma to look up and verify users. Passwords should be hashed (bcrypt) before saving.
- The Auth route lives at `src/app/api/auth/[...nextauth]/route.ts` and issues JWT/session cookies according to NextAuth configuration.

**API Endpoints (examples)**

- `POST /api/register` - Create a new user (used by Sign Up flow). Validates input with `signUpSchema`.
- `POST /api/auth/callback/credentials` - NextAuth credentials callback (sign in with email/password).
- `GET /api/user` - Get current authenticated user (dashboard data).
- `PUT /api/user` - Update user profile (uses `updateSchema` for validation).

**Validation**

- Form and API validation uses Zod schemas located in `src/schema/*`:
  - `signInSchema.ts` — credentials sign-in validation.
  - `signUpSchema.ts` — register input validation.
  - `updateSchema.ts` — profile update validation.
- API routes validate incoming JSON and return `400` with a structured message if validation fails.

**Testing**

This project uses Jest and React Testing Library for comprehensive testing. Test files are located in `__tests__/` directories alongside the code they test.

**Test Coverage:**

- **API Routes**:

  - `src/app/api/register/__tests__/route.test.ts` - User registration endpoint tests
  - `src/app/api/user/__tests__/route.test.ts` - User profile management endpoint tests

- **Frontend Components**:
  - `src/components/__tests__/SignIn.test.tsx` - Sign-in component tests
  - `src/components/__tests__/Edit.test.tsx` - Profile edit component tests

**Running Tests:**

```bash
npm test         # Run all tests
npm run test:watch   # Run tests in watch mode
```

**Test Setup:**

- Jest configuration: `jest.config.js`
- Test setup file: `jest.setup.js` (includes mocks for Next.js router, Link, and Web APIs)
- Test environment: jsdom (for DOM testing)

**Responsive Frontend**

- The app uses responsive/layout-aware components; ensure the dashboard and auth pages adapt to small screens.
- Use Tailwind CSS or a component library for rapid responsiveness.

**Project Structure**

```
user-auth/
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── api/               # API routes
│   │   │   ├── register/
│   │   │   │   ├── __tests__/  # API tests
│   │   │   │   └── route.ts
│   │   │   └── user/
│   │   │       ├── __tests__/  # API tests
│   │   │       └── route.ts
│   │   ├── (auth)/            # Auth pages
│   │   ├── dashboard/         # Dashboard page
│   │   └── edit/              # Edit profile page
│   ├── components/            # React components
│   │   ├── __tests__/         # Component tests
│   │   ├── Dashboard.tsx
│   │   ├── Edit.tsx
│   │   ├── Navbar.tsx
│   │   └── SignIn.tsx
│   ├── schema/                # Zod validation schemas
│   ├── lib/                   # Utilities (prisma, auth)
│   └── utils/                 # Helper functions
├── prisma/                    # Prisma schema and migrations
├── jest.config.js            # Jest configuration
└── jest.setup.js             # Test setup and mocks
```
