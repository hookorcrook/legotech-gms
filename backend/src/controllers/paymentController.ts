import { Response } from 'express';
import prisma from '../config/prisma';
import { AuthRequest } from '../middleware/auth';

export const getPayments = async (req: AuthRequest, res: Response) => {
  try {
    const { status, memberId, startDate, endDate } = req.query;

    const where: any = {};

    if (status) {
      where.status = status;
    }

    if (memberId) {
      where.memberId = parseInt(memberId as string);
    }

    if (startDate || endDate) {
      where.paymentDate = {};
      if (startDate) {
        where.paymentDate.gte = new Date(startDate as string);
      }
      if (endDate) {
        where.paymentDate.lte = new Date(endDate as string);
      }
    }

    const payments = await prisma.payment.findMany({
      where,
      include: {
        member: true,
      },
      orderBy: { paymentDate: 'desc' },
    });

    res.json(payments);
  } catch (error) {
    console.error('Get payments error:', error);
    res.status(500).json({ error: 'Failed to fetch payments' });
  }
};

export const getPayment = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;

    const payment = await prisma.payment.findUnique({
      where: { id: parseInt(id) },
      include: {
        member: true,
      },
    });

    if (!payment) {
      return res.status(404).json({ error: 'Payment not found' });
    }

    res.json(payment);
  } catch (error) {
    console.error('Get payment error:', error);
    res.status(500).json({ error: 'Failed to fetch payment' });
  }
};

export const createPayment = async (req: AuthRequest, res: Response) => {
  try {
    const { memberId, amount, paymentMethod, description } = req.body;

    if (!memberId || !amount || !paymentMethod) {
      return res.status(400).json({ error: 'MemberId, amount, and paymentMethod are required' });
    }

    const payment = await prisma.payment.create({
      data: {
        memberId,
        amount,
        paymentMethod,
        description,
        status: 'completed',
      },
      include: {
        member: true,
      },
    });

    // Update member expiry date
    const member = await prisma.member.findUnique({ where: { id: memberId } });
    if (member) {
      const currentExpiry = member.expiryDate || new Date();
      const newExpiry = new Date(currentExpiry);
      newExpiry.setDate(newExpiry.getDate() + 30);
      
      await prisma.member.update({
        where: { id: memberId },
        data: { expiryDate: newExpiry },
      });
    }

    res.status(201).json(payment);
  } catch (error) {
    console.error('Create payment error:', error);
    res.status(500).json({ error: 'Failed to create payment' });
  }
};

export const updatePayment = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const { status, description } = req.body;

    const payment = await prisma.payment.update({
      where: { id: parseInt(id) },
      data: {
        status,
        description,
      },
      include: {
        member: true,
      },
    });

    res.json(payment);
  } catch (error) {
    console.error('Update payment error:', error);
    res.status(500).json({ error: 'Failed to update payment' });
  }
};

export const deletePayment = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;

    await prisma.payment.delete({
      where: { id: parseInt(id) },
    });

    res.json({ message: 'Payment deleted successfully' });
  } catch (error) {
    console.error('Delete payment error:', error);
    res.status(500).json({ error: 'Failed to delete payment' });
  }
};
