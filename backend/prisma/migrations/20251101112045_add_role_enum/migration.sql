-- CreateEnum
CREATE TYPE "Role" AS ENUM ('SUPER_ADMIN', 'ADMIN', 'MANAGER', 'TRAINER', 'ACCOUNTANT', 'MAINTENANCE');

-- Step 1: Add temporary column with new enum type
ALTER TABLE "users" ADD COLUMN "role_new" "Role" NOT NULL DEFAULT 'ADMIN';

-- Step 2: Migrate existing data (map old string values to new enum)
-- Assuming existing users have role='admin', map them to SUPER_ADMIN
UPDATE "users" SET "role_new" = 'SUPER_ADMIN' WHERE "role" = 'admin';
UPDATE "users" SET "role_new" = 'ADMIN' WHERE "role" = 'Admin';
UPDATE "users" SET "role_new" = 'MANAGER' WHERE "role" = 'manager';
UPDATE "users" SET "role_new" = 'TRAINER' WHERE "role" = 'trainer';
UPDATE "users" SET "role_new" = 'ACCOUNTANT' WHERE "role" = 'accountant';
UPDATE "users" SET "role_new" = 'MAINTENANCE' WHERE "role" = 'maintenance';

-- Step 3: Drop old column
ALTER TABLE "users" DROP COLUMN "role";

-- Step 4: Rename new column to original name
ALTER TABLE "users" RENAME COLUMN "role_new" TO "role";
