import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Test that all new models are accessible
async function test() {
  // Plan model
  const plans = await prisma.plan.findMany();
  console.log('Plans:', plans.length);

  // Enrollment model
  const enrollments = await prisma.enrollment.findMany();
  console.log('Enrollments:', enrollments.length);

  // MemberClass model
  const memberClasses = await prisma.memberClass.findMany();
  console.log('MemberClasses:', memberClasses.length);

  console.log('✅ All Prisma types are working correctly!');
}

test().catch(console.error).finally(() => prisma.$disconnect());
