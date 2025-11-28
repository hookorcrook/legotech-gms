# Prisma ORM Migration Guide

## ✅ Migration Complete

The backend has been successfully migrated from raw PostgreSQL queries (pg library) to **Prisma ORM**.

---

## 🎯 What Changed

### Before (Raw SQL with pg)
```typescript
import pool from '../config/database';

const result = await pool.query('SELECT * FROM programs');
res.json(result.rows);
```

### After (Prisma ORM)
```typescript
import prisma from '../config/prisma';

const programs = await prisma.program.findMany();
res.json(programs);
```

---

## 📦 Benefits of Prisma

✅ **Type Safety** - Full TypeScript support with auto-generated types  
✅ **Better Developer Experience** - IntelliSense and autocomplete  
✅ **Migration Management** - Schema versioning and migrations  
✅ **Query Builder** - No more SQL string concatenation  
✅ **Relation Handling** - Easy joins and nested queries  
✅ **Database Agnostic** - Easy to switch databases if needed  

---

## 🏗️ New Structure

### Schema Definition (`prisma/schema.prisma`)

All database models are now defined in a single schema file:

```prisma
model Program {
  id          Int      @id @default(autoincrement())
  category    String   @db.VarChar(100)
  title       String   @db.VarChar(200)
  description String   @db.Text
  features    Json
  createdAt   DateTime @default(now()) @map("created_at")
  updatedAt   DateTime @updatedAt @map("updated_at")

  @@map("programs")
}
```

### Prisma Client (`src/config/prisma.ts`)

Singleton Prisma client instance with proper connection pooling:

```typescript
import { PrismaClient } from '@prisma/client';

export const prisma = new PrismaClient({
  log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
});

export default prisma;
```

### Updated Controllers

All controllers now use Prisma queries:

```typescript
// programs
const programs = await prisma.program.findMany({
  orderBy: { id: 'asc' }
});

// trainers
const trainers = await prisma.trainer.findMany({
  orderBy: { id: 'asc' }
});

// memberships
const memberships = await prisma.membership.findMany({
  orderBy: { price: 'asc' }
});
```

---

## 📝 Files Modified

### Added
- ✅ `prisma/schema.prisma` - Database schema definition
- ✅ `prisma/seed.ts` - Database seeding script
- ✅ `prisma.config.ts` - Prisma configuration
- ✅ `src/config/prisma.ts` - Prisma client instance

### Modified
- ✅ `src/controllers/programController.ts` - Prisma queries
- ✅ `src/controllers/trainerController.ts` - Prisma queries
- ✅ `src/controllers/membershipController.ts` - Prisma queries
- ✅ `src/controllers/testimonialController.ts` - Prisma queries
- ✅ `src/controllers/miscController.ts` - Prisma queries
- ✅ `package.json` - Added Prisma scripts
- ✅ `.env` - Updated DATABASE_URL format

### Deprecated (Can be removed)
- ❌ `src/config/database.ts` - No longer needed
- ❌ `schema.sql` - Replaced by Prisma migrations

---

## 🚀 New npm Scripts

```json
{
  "seed": "DATABASE_URL=\"...\" ts-node prisma/seed.ts",
  "prisma:generate": "npx prisma generate",
  "prisma:push": "DATABASE_URL=\"...\" npx prisma db push",
  "prisma:studio": "DATABASE_URL=\"...\" npx prisma studio"
}
```

### Usage

```bash
# Generate Prisma Client (after schema changes)
npm run prisma:generate

# Push schema to database (development)
npm run prisma:push

# Seed database with sample data
npm run seed

# Open Prisma Studio (database GUI)
npm run prisma:studio
```

---

## 🗄️ Database Setup

### 1. Create Database

```bash
createdb gym_management
```

### 2. Push Schema

```bash
cd backend
npm run prisma:push
```

This command:
- Creates all tables
- Sets up columns and types
- Adds indexes
- No migration files needed for development

### 3. Seed Data

```bash
npm run seed
```

This populates:
- 3 Programs
- 4 Trainers
- 3 Memberships
- 3 Testimonials
- 1 Stats record

---

## 🔧 Environment Configuration

### .env Format

```env
# Prisma Database URL
DATABASE_URL="postgresql://USER@localhost:5432/gym_management?schema=public"
```

Replace `USER` with your PostgreSQL username (usually your system username on Mac).

---

## 📊 Prisma Studio

Prisma Studio provides a visual database browser:

```bash
npm run prisma:studio
```

This opens a web interface at `http://localhost:5555` where you can:
- View all tables and data
- Add/edit/delete records
- Run filters and queries
- Export data

---

## 🔄 Common Workflows

### Adding a New Model

1. **Define in schema**
   ```prisma
   model NewModel {
     id   Int    @id @default(autoincrement())
     name String
   }
   ```

2. **Push to database**
   ```bash
   npm run prisma:push
   ```

3. **Regenerate client**
   ```bash
   npm run prisma:generate
   ```

4. **Use in code**
   ```typescript
   const items = await prisma.newModel.findMany();
   ```

### Changing Existing Model

1. **Update schema.prisma**
2. **Push changes**: `npm run prisma:push`
3. **Client auto-regenerates**

### Resetting Database

```bash
# Drop all data and recreate
DATABASE_URL="..." npx prisma db push --force-reset

# Reseed
npm run seed
```

---

## 📚 Prisma Query Examples

### Find All
```typescript
const all = await prisma.program.findMany();
```

### Find with Filter
```typescript
const filtered = await prisma.program.findMany({
  where: { category: 'Strength' }
});
```

### Find One
```typescript
const one = await prisma.program.findUnique({
  where: { id: 1 }
});
```

### Create
```typescript
const created = await prisma.program.create({
  data: {
    category: 'Cardio',
    title: 'Running',
    description: 'Endurance training',
    features: ['5K', '10K', 'Marathon']
  }
});
```

### Update
```typescript
const updated = await prisma.program.update({
  where: { id: 1 },
  data: { title: 'New Title' }
});
```

### Delete
```typescript
const deleted = await prisma.program.delete({
  where: { id: 1 }
});
```

### Count
```typescript
const count = await prisma.program.count();
```

### Order By
```typescript
const ordered = await prisma.program.findMany({
  orderBy: { createdAt: 'desc' }
});
```

### Pagination
```typescript
const paginated = await prisma.program.findMany({
  skip: 10,
  take: 5
});
```

---

## 🧪 Testing with Prisma

Prisma makes testing easier with:

```typescript
// Before each test
beforeEach(async () => {
  await prisma.program.deleteMany();
});

// After all tests
afterAll(async () => {
  await prisma.$disconnect();
});
```

---

## 🐛 Troubleshooting

### Error: "Cannot find module '@prisma/client'"

```bash
npm run prisma:generate
```

### Error: "Database connection failed"

Check your `DATABASE_URL` in `.env`:
- Verify username
- Verify database exists
- Verify PostgreSQL is running

```bash
# Check if database exists
psql -l | grep gym_management

# Check if PostgreSQL is running
ps aux | grep postgres
```

### Error: "Table doesn't exist"

```bash
npm run prisma:push
```

### Schema out of sync

```bash
# Pull schema from database
npx prisma db pull

# Or push schema to database
npm run prisma:push
```

---

## 📖 Documentation

- [Prisma Docs](https://www.prisma.io/docs)
- [Prisma Client API](https://www.prisma.io/docs/reference/api-reference/prisma-client-reference)
- [Prisma Schema Reference](https://www.prisma.io/docs/reference/api-reference/prisma-schema-reference)
- [Prisma CLI](https://www.prisma.io/docs/reference/api-reference/command-reference)

---

## ✨ Summary

The migration to Prisma ORM provides:

- ✅ **Type-safe database queries**
- ✅ **Better developer experience**
- ✅ **Easier schema management**
- ✅ **Built-in migration system**
- ✅ **Visual database browser**
- ✅ **Cleaner, more maintainable code**

All functionality remains the same, but with improved code quality and developer experience!

---

**Migration completed on**: October 30, 2025  
**Prisma version**: 6.18.0  
**Status**: ✅ Production Ready
