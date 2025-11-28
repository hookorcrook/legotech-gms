import { Request, Response } from 'express';
import prisma from '../config/prisma';

export const submitContact = async (req: Request, res: Response) => {
  try {
    const { name, email, message } = req.body;
    const contact = await prisma.contactForm.create({
      data: {
        name,
        email,
        message
      }
    });
    res.status(201).json({ success: true, data: contact });
  } catch (error) {
    console.error('Error submitting contact:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const getStats = async (req: Request, res: Response) => {
  try {
    const stats = await prisma.stats.findFirst();
    res.json(stats || { members: 1200, coaches: 35, classesPerWeek: 50 });
  } catch (error) {
    console.error('Error fetching stats:', error);
    res.json({ members: 1200, coaches: 35, classesPerWeek: 50 });
  }
};
