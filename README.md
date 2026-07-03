# Safe City Hawassa

A secure abuse reporting and case management platform for Hawassa, Ethiopia.

## Features

- Anonymous and identified abuse reporting
- Multi-step report wizard
- Claim-code lookup for status tracking
- Admin dashboard with escalation logic and audit logging
- Emergency resources management
- Bilingual English/Amharic UI

## Run locally

### With Docker

```bash
docker compose up --build
```

### Without Docker

#### 1. Install MySQL
Install MySQL 8+ locally and create a database named `safe_city_hawassa`.

#### 2. Configure the backend environment
Update the backend `.env` file with your MySQL connection string:

```env
DATABASE_URL="mysql://root:rootpass@localhost:3306/safe_city_hawassa"
```

#### 3. Run Prisma migrations and seed data
```bash
cd backend
npx prisma migrate dev --name init
npm run seed
```

#### 4. Start the app
```bash
cd ..
npm run dev
```

## Stack

- Frontend: React, TypeScript, Vite, Tailwind CSS
- Backend: Node.js, Express, TypeScript, Prisma, MySQL
