import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

interface AuthRequest extends Request {
  user?: {
    id: number;
    email: string;
    role: string;
  };
}

// Get all approved testimonials (public)
export const getTestimonials = async (req: Request, res: Response) => {
  try {
    const { featured } = req.query;
    
    const where: any = { approved: true };
    if (featured === 'true') {
      where.featured = true;
    }

    const testimonials = await prisma.testimonial.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        author: true,
        role: true,
        content: true,
        image: true,
        rating: true,
        featured: true,
        createdAt: true,
      },
    });

    res.json(testimonials);
  } catch (error) {
    console.error('Error fetching testimonials:', error);
    res.status(500).json({ error: 'Failed to fetch testimonials' });
  }
};

// Submit new testimonial (public)
export const submitTestimonial = async (req: Request, res: Response) => {
  try {
    const { author, role, content, email, rating } = req.body;

    if (!author || !content) {
      return res.status(400).json({ 
        error: 'Name and testimonial content are required' 
      });
    }

    const testimonial = await prisma.testimonial.create({
      data: {
        author,
        role: role || null,
        content,
        email: email || null,
        rating: rating || 5,
        approved: false, // Requires admin approval
        featured: false,
      },
    });

    res.status(201).json({ 
      message: 'Thank you for your testimonial! It will be reviewed by our team.',
      testimonial: {
        id: testimonial.id,
        author: testimonial.author,
        content: testimonial.content,
      },
    });
  } catch (error) {
    console.error('Error submitting testimonial:', error);
    res.status(500).json({ error: 'Failed to submit testimonial' });
  }
};

// Get all testimonials (admin)
export const getAllTestimonials = async (req: AuthRequest, res: Response) => {
  try {
    const { status } = req.query;
    
    const where: any = {};
    if (status === 'pending') {
      where.approved = false;
    } else if (status === 'approved') {
      where.approved = true;
    }

    const testimonials = await prisma.testimonial.findMany({
      where,
      orderBy: { createdAt: 'desc' },
    });

    res.json(testimonials);
  } catch (error) {
    console.error('Error fetching testimonials:', error);
    res.status(500).json({ error: 'Failed to fetch testimonials' });
  }
};

// Update testimonial (admin)
export const updateTestimonial = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const { approved, featured, author, role, content, rating, email } = req.body;

    const updateData: any = {};
    if (approved !== undefined) updateData.approved = approved;
    if (featured !== undefined) updateData.featured = featured;
    if (author !== undefined) updateData.author = author;
    if (role !== undefined) updateData.role = role;
    if (content !== undefined) updateData.content = content;
    if (rating !== undefined) updateData.rating = rating;
    if (email !== undefined) updateData.email = email;

    const testimonial = await prisma.testimonial.update({
      where: { id: parseInt(id) },
      data: updateData,
    });

    res.json(testimonial);
  } catch (error) {
    console.error('Error updating testimonial:', error);
    res.status(500).json({ error: 'Failed to update testimonial' });
  }
};

// Delete testimonial (admin)
export const deleteTestimonial = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;

    await prisma.testimonial.delete({
      where: { id: parseInt(id) },
    });

    res.json({ message: 'Testimonial deleted successfully' });
  } catch (error) {
    console.error('Error deleting testimonial:', error);
    res.status(500).json({ error: 'Failed to delete testimonial' });
  }
};
