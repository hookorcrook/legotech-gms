import { Request, Response } from 'express';
import prisma from '../config/prisma';

// GET /api/public/stats - Get site statistics
export const getStats = async (req: Request, res: Response) => {
  try {
    // Always fetch live counts from the database
    const memberCount = await prisma.member.count({ where: { status: 'active' } });
    const trainerCount = await prisma.trainer.count({ where: { status: 'active' } });
    const classCount = await prisma.class.count();

    res.json({
      members: memberCount,
      coaches: trainerCount,
      classesPerWeek: classCount,
    });
  } catch (error) {
    console.error('Get stats error:', error);
    res.status(500).json({ error: 'Failed to fetch statistics' });
  }
};

// GET /api/public/programs - Get all active programs
export const getPrograms = async (req: Request, res: Response) => {
  try {
    const { featured } = req.query;

    const where: any = {};

    if (featured === 'true') {
      where.isFeatured = true;
    }

    const programs = await prisma.program.findMany({
      where,
      orderBy: { createdAt: 'asc' },
    });

    res.json(programs);
  } catch (error) {
    console.error('Get programs error:', error);
    res.status(500).json({ error: 'Failed to fetch programs' });
  }
};

// GET /api/public/trainers - Get featured trainers
export const getTrainers = async (req: Request, res: Response) => {
  try {
    const { featured } = req.query;

    const where: any = {
      status: 'active',
    };

    if (featured === 'true') {
      where.isFeatured = true;
    }

    const trainers = await prisma.trainer.findMany({
      where,
      select: {
        id: true,
        name: true,
        specialty: true,
        type: true,
        imageUrl: true,
        bio: true,
        experience: true,
        certifications: true,
        specialties: true,
      },
      orderBy: { createdAt: 'desc' },
    });

    res.json(trainers);
  } catch (error) {
    console.error('Get trainers error:', error);
    res.status(500).json({ error: 'Failed to fetch trainers' });
  }
};

// GET /api/public/memberships - Get all memberships
export const getMemberships = async (req: Request, res: Response) => {
  try {
    const { popular } = req.query;

    const where: any = {};

    if (popular === 'true') {
      where.isPopular = true;
    }

    const memberships = await prisma.membership.findMany({
      where,
      orderBy: { price: 'asc' },
    });

    res.json(memberships);
  } catch (error) {
    console.error('Get memberships error:', error);
    res.status(500).json({ error: 'Failed to fetch memberships' });
  }
};

// GET /api/public/testimonials - Get testimonials
export const getTestimonials = async (req: Request, res: Response) => {
  try {
    const { limit } = req.query;
    const takeLimit = limit ? parseInt(limit as string) : undefined;

    const testimonials = await prisma.testimonial.findMany({
      orderBy: { createdAt: 'desc' },
      take: takeLimit,
    });

    res.json(testimonials);
  } catch (error) {
    console.error('Get testimonials error:', error);
    res.status(500).json({ error: 'Failed to fetch testimonials' });
  }
};

// POST /api/public/contact - Submit contact form
export const createContactForm = async (req: Request, res: Response) => {
  try {
    const { name, email, message } = req.body;

    if (!name || !email) {
      return res.status(400).json({ error: 'Name and email are required' });
    }

    const contact = await prisma.contactForm.create({
      data: {
        name,
        email,
        message: message || '',
      },
    });

    res.status(201).json({
      message: 'Contact form submitted successfully',
      id: contact.id,
    });
  } catch (error) {
    console.error('Create contact form error:', error);
    res.status(500).json({ error: 'Failed to submit contact form' });
  }
};

// PUT /api/admin/stats - Update site statistics (admin only)
export const updateStats = async (req: Request, res: Response) => {
  try {
    const { members, coaches, classesPerWeek } = req.body;

    if (members === undefined || coaches === undefined || classesPerWeek === undefined) {
      return res.status(400).json({ 
        error: 'Members, coaches, and classesPerWeek are required' 
      });
    }

    // Check if stats record exists
    let stats = await prisma.stats.findFirst();

    if (stats) {
      // Update existing record
      stats = await prisma.stats.update({
        where: { id: stats.id },
        data: {
          members: parseInt(members),
          coaches: parseInt(coaches),
          classesPerWeek: parseInt(classesPerWeek),
        },
      });
    } else {
      // Create new record
      stats = await prisma.stats.create({
        data: {
          members: parseInt(members),
          coaches: parseInt(coaches),
          classesPerWeek: parseInt(classesPerWeek),
        },
      });
    }

    res.json({
      message: 'Stats updated successfully',
      stats,
    });
  } catch (error) {
    console.error('Update stats error:', error);
    res.status(500).json({ error: 'Failed to update stats' });
  }
};
