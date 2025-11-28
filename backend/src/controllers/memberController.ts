import { Response } from 'express';
import prisma from '../config/prisma';
import { AuthRequest } from '../middleware/auth';

export const getMembers = async (req: AuthRequest, res: Response) => {
  try {
    const { status, search } = req.query;

    const where: any = {};

    if (status) {
      where.status = status;
    }

    if (search) {
      where.OR = [
        { name: { contains: search as string, mode: 'insensitive' } },
        { email: { contains: search as string, mode: 'insensitive' } },
        { phone: { contains: search as string } },
      ];
    }

    const members = await prisma.member.findMany({
      where,
      include: {
        payments: {
          orderBy: { paymentDate: 'desc' },
          take: 1,
        },
        enrollments: {
          include: {
            plan: true,
          },
          orderBy: { createdAt: 'desc' },
          take: 1,
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    res.json(members);
  } catch (error) {
    console.error('Get members error:', error);
    res.status(500).json({ error: 'Failed to fetch members' });
  }
};

export const getMember = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;

    const member = await prisma.member.findUnique({
      where: { id: parseInt(id) },
      include: {
        payments: {
          orderBy: { paymentDate: 'desc' },
        },
        enrollments: {
          include: {
            plan: true,
            memberClasses: {
              include: {
                class: true,
              },
            },
          },
        },
      },
    });

    if (!member) {
      return res.status(404).json({ error: 'Member not found' });
    }

    res.json(member);
  } catch (error) {
    console.error('Get member error:', error);
    res.status(500).json({ error: 'Failed to fetch member' });
  }
};

export const createMember = async (req: AuthRequest, res: Response) => {
  try {
    const { name, email, phone, address, emergencyContact, notes } = req.body;

    if (!name || !email || !phone) {
      return res.status(400).json({ error: 'Name, email, and phone are required' });
    }

    const existingMember = await prisma.member.findUnique({ where: { email } });

    if (existingMember) {
      return res.status(400).json({ error: 'Member with this email already exists' });
    }

    const member = await prisma.member.create({
      data: {
        name,
        email,
        phone,
        address,
        emergencyContact,
        notes,
      },
    });

    res.status(201).json(member);
  } catch (error) {
    console.error('Create member error:', error);
    res.status(500).json({ error: 'Failed to create member' });
  }
};

export const updateMember = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const { name, email, phone, status, address, emergencyContact, notes, expiryDate } = req.body;

    const member = await prisma.member.update({
      where: { id: parseInt(id) },
      data: {
        name,
        email,
        phone,
        status,
        address,
        emergencyContact,
        notes,
        expiryDate: expiryDate ? new Date(expiryDate) : undefined,
      },
    });

    res.json(member);
  } catch (error) {
    console.error('Update member error:', error);
    res.status(500).json({ error: 'Failed to update member' });
  }
};

export const deleteMember = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;

    await prisma.member.delete({
      where: { id: parseInt(id) },
    });

    res.json({ message: 'Member deleted successfully' });
  } catch (error) {
    console.error('Delete member error:', error);
    res.status(500).json({ error: 'Failed to delete member' });
  }
};
