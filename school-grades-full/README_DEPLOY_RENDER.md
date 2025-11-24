# Deploy to Render (quick steps)

1. Push this repo to GitHub.
2. Create a managed Postgres DB on Render (or let render.yaml create it).
3. In the Web Service settings, set environment variables:
   - DATABASE_URL (use internal URL from DB info)
   - JWT_SECRET (set a random secret)
4. Use the build command: `npm install && npx prisma generate && npm run build`
5. Use start command: `npm start`
6. After deploy, run migrations: in Render Shell run `npx prisma migrate deploy`
7. Seed data: `npm run seed`
