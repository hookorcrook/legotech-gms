import { Request, Response } from 'express';
import prisma from '../config/prisma';
import { AuthRequest } from '../middleware/auth';

export const getEnrollments = async (req: Request, res: Response) => {
  try {
    const { memberId, planId, status } = req.query;

    const where: any = {};
    if (memberId) where.memberId = parseInt(memberId as string);
    if (planId) where.planId = parseInt(planId as string);
    if (status) where.status = status;

    const enrollments = await prisma.enrollment.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      include: {
        member: true,
        plan: true,
        payments: true,
        memberClasses: {
          include: {
            class: {
              include: {
                trainer: true,
              },
            },
          },
        },
      },
    });

    res.json(enrollments);
  } catch (error) {
    console.error('Get enrollments error:', error);
    res.status(500).json({ error: 'Failed to fetch enrollments' });
  }
};

export const getEnrollment = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;

    const enrollment = await prisma.enrollment.findUnique({
      where: { id: parseInt(id) },
      include: {
        member: true,
        plan: true,
        payments: true,
        memberClasses: {
          include: {
            class: {
              include: {
                trainer: true,
              },
            },
          },
        },
      },
    });

    if (!enrollment) {
      return res.status(404).json({ error: 'Enrollment not found' });
    }

    res.json(enrollment);
  } catch (error) {
    console.error('Get enrollment error:', error);
    res.status(500).json({ error: 'Failed to fetch enrollment' });
  }
};

export const createEnrollment = async (req: AuthRequest, res: Response) => {
  try {
    const {
      memberId,
      planId,
      selectedClasses, // array of class IDs
      paymentMethod,
    } = req.body;

    // Validation
    if (!memberId || !planId) {
      return res.status(400).json({ error: 'Member ID and Plan ID are required' });
    }

    // Check if member exists
    const member = await prisma.member.findUnique({
      where: { id: parseInt(memberId) },
    });

    if (!member) {
      return res.status(404).json({ error: 'Member not found' });
    }

    // Check if plan exists
    const plan = await prisma.plan.findUnique({
      where: { id: parseInt(planId) },
    });

    if (!plan) {
      return res.status(404).json({ error: 'Plan not found' });
    }

    if (plan.status !== 'active') {
      return res.status(400).json({ error: 'Plan is not active' });
    }

    // Calculate end date based on plan duration
    const startDate = new Date();
    const endDate = new Date();
    endDate.setMonth(endDate.getMonth() + plan.durationMonths);

    // Validate selected classes
    if (selectedClasses && selectedClasses.length > 0) {
      const allowedClassIds = plan.allowedClasses as number[];
      
      for (const classId of selectedClasses) {
        // Check if class is allowed in the plan
        if (!allowedClassIds.includes(classId)) {
          const classInfo = await prisma.class.findUnique({ where: { id: classId } });
          return res.status(400).json({
            error: `Class "${classInfo?.name}" is not allowed in this plan`,
          });
        }

        // Check class capacity
        const classInfo = await prisma.class.findUnique({
          where: { id: classId },
        });

        if (!classInfo) {
          return res.status(404).json({ error: `Class with ID ${classId} not found` });
        }

        if (classInfo.enrolled >= classInfo.capacity) {
          return res.status(400).json({
            error: `Class "${classInfo.name}" is at full capacity`,
          });
        }
      }
    }

    // Create enrollment with transaction
    const enrollment = await prisma.$transaction(async (tx) => {
      // Create enrollment
      const newEnrollment = await tx.enrollment.create({
        data: {
          memberId: parseInt(memberId),
          planId: parseInt(planId),
          startDate,
          endDate,
          totalCost: plan.cost,
          status: 'active',
        },
      });

      // Create payment record
      await tx.payment.create({
        data: {
          memberId: parseInt(memberId),
          enrollmentId: newEnrollment.id,
          amount: plan.cost,
          paymentMethod: paymentMethod || 'cash',
          status: 'pending',
          description: `Enrollment in ${plan.name} plan`,
        },
      });

      // Enroll in selected classes
      if (selectedClasses && selectedClasses.length > 0) {
        for (const classId of selectedClasses) {
          await tx.memberClass.create({
            data: {
              memberId: parseInt(memberId),
              classId,
              enrollmentId: newEnrollment.id,
              status: 'active',
            },
          });

          // Update class enrolled count
          await tx.class.update({
            where: { id: classId },
            data: {
              enrolled: {
                increment: 1,
              },
            },
          });
        }
      }

      // Update member expiry date
      await tx.member.update({
        where: { id: parseInt(memberId) },
        data: {
          expiryDate: endDate,
          status: 'active',
        },
      });

      return newEnrollment;
    });

    // Fetch complete enrollment data
    const completeEnrollment = await prisma.enrollment.findUnique({
      where: { id: enrollment.id },
      include: {
        member: true,
        plan: true,
        payments: true,
        memberClasses: {
          include: {
            class: true,
          },
        },
      },
    });

    res.status(201).json(completeEnrollment);
  } catch (error) {
    console.error('Create enrollment error:', error);
    res.status(500).json({ error: 'Failed to create enrollment' });
  }
};

export const updateEnrollment = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const existingEnrollment = await prisma.enrollment.findUnique({
      where: { id: parseInt(id) },
      include: {
        memberClasses: true,
      },
    });

    if (!existingEnrollment) {
      return res.status(404).json({ error: 'Enrollment not found' });
    }

    // Update enrollment status with transaction
    const enrollment = await prisma.$transaction(async (tx) => {
      const updatedEnrollment = await tx.enrollment.update({
        where: { id: parseInt(id) },
        data: { status },
      });

      // If enrollment is cancelled, drop all classes
      if (status === 'cancelled') {
        for (const memberClass of existingEnrollment.memberClasses) {
          await tx.memberClass.update({
            where: { id: memberClass.id },
            data: { status: 'dropped' },
          });

          // Decrement class enrolled count
          await tx.class.update({
            where: { id: memberClass.classId },
            data: {
              enrolled: {
                decrement: 1,
              },
            },
          });
        }

        // Update member status if needed
        await tx.member.update({
          where: { id: existingEnrollment.memberId },
          data: { status: 'inactive' },
        });
      }

      return updatedEnrollment;
    });

    const completeEnrollment = await prisma.enrollment.findUnique({
      where: { id: enrollment.id },
      include: {
        member: true,
        plan: true,
        payments: true,
        memberClasses: {
          include: {
            class: true,
          },
        },
      },
    });

    res.json(completeEnrollment);
  } catch (error) {
    console.error('Update enrollment error:', error);
    res.status(500).json({ error: 'Failed to update enrollment' });
  }
};

export const deleteEnrollment = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;

    const existingEnrollment = await prisma.enrollment.findUnique({
      where: { id: parseInt(id) },
      include: {
        payments: true,
        memberClasses: true,
      },
    });

    if (!existingEnrollment) {
      return res.status(404).json({ error: 'Enrollment not found' });
    }

    // Check if there are completed payments
    const hasCompletedPayments = existingEnrollment.payments.some(
      (p: any) => p.status === 'completed'
    );

    if (hasCompletedPayments) {
      return res.status(400).json({
        error: 'Cannot delete enrollment with completed payments. Please cancel it instead.',
      });
    }

    // Delete enrollment with transaction
    await prisma.$transaction(async (tx) => {
      // Delete member classes
      for (const memberClass of existingEnrollment.memberClasses) {
        await tx.class.update({
          where: { id: memberClass.classId },
          data: {
            enrolled: {
              decrement: 1,
            },
          },
        });
      }

      await tx.memberClass.deleteMany({
        where: { enrollmentId: parseInt(id) },
      });

      // Delete payments
      await tx.payment.deleteMany({
        where: { enrollmentId: parseInt(id) },
      });

      // Delete enrollment
      await tx.enrollment.delete({
        where: { id: parseInt(id) },
      });
    });

    res.json({ message: 'Enrollment deleted successfully' });
  } catch (error) {
    console.error('Delete enrollment error:', error);
    res.status(500).json({ error: 'Failed to delete enrollment' });
  }
};
