# School Grades - Fullstack Template (Next.js + Prisma + PostgreSQL)

This is a starter template for a student grades management web app with roles:
`ADMIN`, `TEACHER`, `STUDENT`.

Features included:
- Multi-user roles and role-based access control
- Register / Login (JWT via HttpOnly cookie)
- Prisma ORM models (Postgres)
- Basic API routes for users, classes, grades
- Seed script to create sample admin / teacher / students
- `render.yaml` example for Render deployment
- `.env.example` with required environment variables

## Quickstart (local)
1. Copy `.env.example` to `.env` and set `DATABASE_URL` and `JWT_SECRET`.
2. `npm install`
3. `npx prisma generate`
4. `npx prisma migrate dev --name init`
5. `npm run seed` (optional)
6. `npm run dev`

## Deploy to Render
- Create a managed PostgreSQL database on Render, copy the `DATABASE_URL`.
- Create a Web Service on Render connected to this repo, set env vars (`DATABASE_URL`, `JWT_SECRET`).
- Use `render.yaml` (optional) for IaC.

This template is intentionally minimal; adapt authentication, validation, UI and security to production needs.
