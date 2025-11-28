import { Request, Response } from 'express';
import prisma from '../config/prisma';

export const getTestimonials = async (req: Request, res: Response) => {
  try {
    const testimonials = await prisma.testimonial.findMany({
      orderBy: { id: 'desc' }
    });
    res.json(testimonials);
  } catch (error) {
    console.error('Error fetching testimonials:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const createTestimonial = async (req: Request, res: Response) => {
  try {
    const { rating, content, author } = req.body;
    const testimonial = await prisma.testimonial.create({
      data: {
        rating,
        content,
        author
      }
    });
    res.status(201).json(testimonial);
  } catch (error) {
    console.error('Error creating testimonial:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};
