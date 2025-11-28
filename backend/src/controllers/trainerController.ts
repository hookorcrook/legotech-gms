import { Request, Response } from 'express';
import prisma from '../config/prisma';
import { AuthRequest } from '../middleware/auth';

export const getTrainers = async (req: Request, res: Response) => {
  try {
    const { type, status, isFeatured } = req.query;

    const where: any = {};

    if (type) {
      where.type = type;
    }

    if (status) {
      where.status = status;
    }

    if (isFeatured !== undefined) {
      where.isFeatured = isFeatured === 'true';
    }

    const trainers = await prisma.trainer.findMany({
      where,
      orderBy: { name: 'asc' },
      include: {
        classes: true,
      },
    });

    res.json(trainers);
  } catch (error) {
    console.error('Get trainers error:', error);
    res.status(500).json({ error: 'Failed to fetch trainers' });
  }
};

export const getTrainer = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;

    const trainer = await prisma.trainer.findUnique({
      where: { id: parseInt(id) },
      include: {
        classes: true,
      },
    });

    if (!trainer) {
      return res.status(404).json({ error: 'Trainer not found' });
    }

    res.json(trainer);
  } catch (error) {
    console.error('Get trainer error:', error);
    res.status(500).json({ error: 'Failed to fetch trainer' });
  }
};

export const createTrainer = async (req: AuthRequest, res: Response) => {
  try {
    const {
      name,
      email,
      phone,
      specialty,
      type,
      isFeatured,
      imageUrl,
      bio,
      experience,
      certifications,
      specialties,
      salary,
    } = req.body;

    if (!name || !email || !specialty || !type || !imageUrl) {
      return res.status(400).json({
        error: 'Name, email, specialty, type, and imageUrl are required',
      });
    }

    const existingTrainer = await prisma.trainer.findUnique({
      where: { email },
    });

    if (existingTrainer) {
      return res.status(400).json({
        error: 'Trainer with this email already exists',
      });
    }

    const trainer = await prisma.trainer.create({
      data: {
        name,
        email,
        phone,
        specialty,
        type,
        isFeatured: isFeatured || false,
        imageUrl,
        bio,
        experience,
        certifications,
        specialties,
        salary,
      },
    });

    res.status(201).json(trainer);
  } catch (error) {
    console.error('Create trainer error:', error);
    res.status(500).json({ error: 'Failed to create trainer' });
  }
};

export const updateTrainer = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const {
      name,
      email,
      phone,
      specialty,
      type,
      isFeatured,
      imageUrl,
      bio,
      experience,
      certifications,
      specialties,
      status,
      salary,
    } = req.body;

    const trainer = await prisma.trainer.update({
      where: { id: parseInt(id) },
      data: {
        name,
        email,
        phone,
        specialty,
        type,
        isFeatured,
        imageUrl,
        bio,
        experience,
        certifications,
        specialties,
        status,
        salary,
      },
    });

    res.json(trainer);
  } catch (error) {
    console.error('Update trainer error:', error);
    res.status(500).json({ error: 'Failed to update trainer' });
  }
};

export const deleteTrainer = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;

    // Check if trainer has any classes
    const classesCount = await prisma.class.count({
      where: { trainerId: parseInt(id) },
    });

    if (classesCount > 0) {
      return res.status(400).json({
        error: 'Cannot delete trainer with assigned classes',
      });
    }

    await prisma.trainer.delete({
      where: { id: parseInt(id) },
    });

    res.json({ message: 'Trainer deleted successfully' });
  } catch (error) {
    console.error('Delete trainer error:', error);
    res.status(500).json({ error: 'Failed to delete trainer' });
  }
};
