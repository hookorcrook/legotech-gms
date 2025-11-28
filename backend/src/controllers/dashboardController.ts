import { Response } from 'express';
import prisma from '../config/prisma';
import { AuthRequest } from '../middleware/auth';

export const getDashboardStats = async (req: AuthRequest, res: Response) => {
  try {
    const totalMembers = await prisma.member.count();
    const activeMembers = await prisma.member.count({ where: { status: 'active' } });
    const totalPayments = await prisma.payment.count();
    const totalClasses = await prisma.class.count();
    const totalEquipment = await prisma.equipment.count();
    const totalStaff = await prisma.staff.count();

    // Get revenue statistics
    const revenueResult = await prisma.payment.aggregate({
      _sum: {
        amount: true,
      },
      where: {
        status: 'completed',
      },
    });

    const totalRevenue = revenueResult._sum.amount || 0;

    // Get monthly revenue
    const now = new Date();
    const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const monthlyRevenueResult = await prisma.payment.aggregate({
      _sum: {
        amount: true,
      },
      where: {
        status: 'completed',
        paymentDate: {
          gte: firstDayOfMonth,
        },
      },
    });

    const monthlyRevenue = monthlyRevenueResult._sum.amount || 0;

    // Get recent payments
    const recentPayments = await prisma.payment.findMany({
      take: 5,
      orderBy: { paymentDate: 'desc' },
      include: {
        member: true,
      },
    });

    // Get plan/enrollment distribution
    const planDistribution = await prisma.enrollment.groupBy({
      by: ['planId'],
      where: { status: 'active' },
      _count: {
        id: true,
      },
    });

    const membershipStats = await Promise.all(
      planDistribution.map(async (item: { planId: number; _count: { id: number } }) => {
        const plan = await prisma.plan.findUnique({
          where: { id: item.planId },
        });
        return {
          membershipName: plan?.name || 'Unknown',
          count: item._count.id,
        };
      })
    );

    // Get expiring memberships (within 7 days)
    const sevenDaysFromNow = new Date();
    sevenDaysFromNow.setDate(sevenDaysFromNow.getDate() + 7);

    const expiringMemberships = await prisma.member.findMany({
      where: {
        expiryDate: {
          lte: sevenDaysFromNow,
          gte: new Date(),
        },
        status: 'active',
      },
    });

    // Get active enrollments count
    const activeEnrollments = await prisma.enrollment.count({
      where: { status: 'active' },
    });

    // Get expiring enrollments (within 7 days)
    const expiringEnrollments = await prisma.enrollment.findMany({
      where: {
        endDate: {
          lte: sevenDaysFromNow,
          gte: new Date(),
        },
        status: 'active',
      },
      include: {
        member: true,
        plan: true,
      },
      orderBy: {
        endDate: 'asc',
      },
      take: 10,
    });

    // Get today's classes
    const today = new Date();
    const todayClasses = await prisma.class.findMany({
      where: {
        schedule: {
          contains: today.toLocaleDateString('en-US', { weekday: 'long' }),
        },
      },
      include: {
        trainer: true,
      },
      take: 5,
    });

    // Get monthly enrollment revenue
    const monthlyEnrollmentRevenue = await prisma.payment.aggregate({
      _sum: {
        amount: true,
      },
      where: {
        status: 'completed',
        paymentDate: {
          gte: firstDayOfMonth,
        },
        // Filter payments that have enrollmentId (enrollment-based payments)
        NOT: {
          enrollmentId: null,
        },
      },
    });

    const enrollmentRevenue = monthlyEnrollmentRevenue._sum?.amount || 0;

    res.json({
      totalMembers,
      activeMembers,
      totalPayments,
      totalClasses,
      totalEquipment,
      totalStaff,
      totalRevenue: parseFloat(totalRevenue.toString()),
      monthlyRevenue: parseFloat(monthlyRevenue.toString()),
      recentPayments,
      membershipStats,
      expiringMemberships,
      activeEnrollments,
      expiringEnrollments,
      todayClasses,
      enrollmentRevenue: parseFloat(enrollmentRevenue.toString()),
    });
  } catch (error) {
    console.error('Get dashboard stats error:', error);
    res.status(500).json({ error: 'Failed to fetch dashboard statistics' });
  }
};

export const getRevenueReport = async (req: AuthRequest, res: Response) => {
  try {
    const { period = 'month' } = req.query;

    const now = new Date();
    let startDate: Date;

    switch (period) {
      case 'week':
        startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 7);
        break;
      case 'year':
        startDate = new Date(now.getFullYear(), 0, 1);
        break;
      case 'month':
      default:
        startDate = new Date(now.getFullYear(), now.getMonth(), 1);
        break;
    }

    const payments = await prisma.payment.findMany({
      where: {
        paymentDate: {
          gte: startDate,
        },
        status: 'completed',
      },
      orderBy: {
        paymentDate: 'asc',
      },
    });

    // Group by date
    const revenueByDate = payments.reduce((acc: Record<string, number>, payment: any) => {
      const date = payment.paymentDate.toISOString().split('T')[0];
      if (!acc[date]) {
        acc[date] = 0;
      }
      acc[date] += parseFloat(payment.amount.toString());
      return acc;
    }, {});

    const chartData = Object.entries(revenueByDate).map(([date, amount]) => ({
      date,
      amount,
    }));

    res.json(chartData);
  } catch (error) {
    console.error('Get revenue report error:', error);
    res.status(500).json({ error: 'Failed to fetch revenue report' });
  }
};

export const getMembershipReport = async (req: AuthRequest, res: Response) => {
  try {
    // Get enrollment statistics by plan
    const enrollmentStats = await prisma.enrollment.groupBy({
      by: ['planId', 'status'],
      _count: {
        id: true,
      },
    });

    const report = await Promise.all(
      enrollmentStats.map(async (item: { planId: number; status: string; _count: { id: number } }) => {
        const plan = await prisma.plan.findUnique({
          where: { id: item.planId },
        });
        return {
          membershipName: plan?.name || 'Unknown',
          status: item.status,
          count: item._count.id,
        };
      })
    );

    res.json(report);
  } catch (error) {
    console.error('Get membership report error:', error);
    res.status(500).json({ error: 'Failed to fetch membership report' });
  }
};
