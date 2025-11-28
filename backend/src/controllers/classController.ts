import { Response } from 'express';
import prisma from '../config/prisma';
import { AuthRequest } from '../middleware/auth';

export const getClasses = async (req: AuthRequest, res: Response) => {
  try {
    const { day, trainerId } = req.query;

    const where: any = {};

    if (day) {
      where.day = day;
    }

    if (trainerId) {
      where.trainerId = parseInt(trainerId as string);
    }

    const classes = await prisma.class.findMany({
      where,
      include: {
        trainer: true,
      },
      orderBy: { time: 'asc' },
    });

    res.json(classes);
  } catch (error) {
    console.error('Get classes error:', error);
    res.status(500).json({ error: 'Failed to fetch classes' });
  }
};

export const getClass = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;

    const classData = await prisma.class.findUnique({
      where: { id: parseInt(id) },
      include: {
        trainer: true,
      },
    });

    if (!classData) {
      return res.status(404).json({ error: 'Class not found' });
    }

    res.json(classData);
  } catch (error) {
    console.error('Get class error:', error);
    res.status(500).json({ error: 'Failed to fetch class' });
  }
};

export const createClass = async (req: AuthRequest, res: Response) => {
  try {
    const { name, description, trainerId, schedule, day, time, duration, capacity } = req.body;

    if (!name || !trainerId || !day || !time || !duration || !capacity) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const classData = await prisma.class.create({
      data: {
        name,
        description,
        trainerId,
        schedule: schedule || `${day} at ${time}`,
        day,
        time,
        duration,
        capacity,
      },
      include: {
        trainer: true,
      },
    });

    res.status(201).json(classData);
  } catch (error) {
    console.error('Create class error:', error);
    res.status(500).json({ error: 'Failed to create class' });
  }
};

export const updateClass = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const { name, description, trainerId, schedule, day, time, duration, capacity, enrolled } = req.body;

    const classData = await prisma.class.update({
      where: { id: parseInt(id) },
      data: {
        name,
        description,
        trainerId,
        schedule,
        day,
        time,
        duration,
        capacity,
        enrolled,
      },
      include: {
        trainer: true,
      },
    });

    res.json(classData);
  } catch (error) {
    console.error('Update class error:', error);
    res.status(500).json({ error: 'Failed to update class' });
  }
};

export const deleteClass = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;

    await prisma.class.delete({
      where: { id: parseInt(id) },
    });

    res.json({ message: 'Class deleted successfully' });
  } catch (error) {
    console.error('Delete class error:', error);
    res.status(500).json({ error: 'Failed to delete class' });
  }
};
