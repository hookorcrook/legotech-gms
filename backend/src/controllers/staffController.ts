import { Response } from 'express';
import prisma from '../config/prisma';
import { AuthRequest } from '../middleware/auth';

export const getStaff = async (req: AuthRequest, res: Response) => {
  try {
    const { role, status } = req.query;

    const where: any = {};

    if (role) {
      where.role = role;
    }

    if (status) {
      where.status = status;
    }

    const staff = await prisma.staff.findMany({
      where,
      orderBy: { name: 'asc' },
    });

    res.json(staff);
  } catch (error) {
    console.error('Get staff error:', error);
    res.status(500).json({ error: 'Failed to fetch staff' });
  }
};

export const getStaffMember = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;

    const staff = await prisma.staff.findUnique({
      where: { id: parseInt(id) },
    });

    if (!staff) {
      return res.status(404).json({ error: 'Staff member not found' });
    }

    res.json(staff);
  } catch (error) {
    console.error('Get staff member error:', error);
    res.status(500).json({ error: 'Failed to fetch staff member' });
  }
};

export const createStaff = async (req: AuthRequest, res: Response) => {
  try {
    const { name, email, phone, role, salary, address, emergencyContact } = req.body;

    if (!name || !email || !phone || !role || !salary) {
      return res.status(400).json({ error: 'Name, email, phone, role, and salary are required' });
    }

    const existingStaff = await prisma.staff.findUnique({ where: { email } });

    if (existingStaff) {
      return res.status(400).json({ error: 'Staff member with this email already exists' });
    }

    const staff = await prisma.staff.create({
      data: {
        name,
        email,
        phone,
        role,
        salary,
        address,
        emergencyContact,
      },
    });

    res.status(201).json(staff);
  } catch (error) {
    console.error('Create staff error:', error);
    res.status(500).json({ error: 'Failed to create staff member' });
  }
};

export const updateStaff = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const { name, email, phone, role, salary, address, emergencyContact, status } = req.body;

    const staff = await prisma.staff.update({
      where: { id: parseInt(id) },
      data: {
        name,
        email,
        phone,
        role,
        salary,
        address,
        emergencyContact,
        status,
      },
    });

    res.json(staff);
  } catch (error) {
    console.error('Update staff error:', error);
    res.status(500).json({ error: 'Failed to update staff member' });
  }
};

export const deleteStaff = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;

    await prisma.staff.delete({
      where: { id: parseInt(id) },
    });

    res.json({ message: 'Staff member deleted successfully' });
  } catch (error) {
    console.error('Delete staff error:', error);
    res.status(500).json({ error: 'Failed to delete staff member' });
  }
};
