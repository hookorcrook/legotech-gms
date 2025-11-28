import { Request, Response } from 'express';
import prisma from '../config/prisma';
import { AuthRequest } from '../middleware/auth';

export const getPlans = async (req: Request, res: Response) => {
  try {
    const { status } = req.query;

    const where: any = {};
    if (status) {
      where.status = status;
    }

    const plans = await prisma.plan.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      include: {
        _count: {
          select: { enrollments: true },
        },
      },
    });

    res.json(plans);
  } catch (error) {
    console.error('Get plans error:', error);
    res.status(500).json({ error: 'Failed to fetch plans' });
  }
};

export const getPlan = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;

    const plan = await prisma.plan.findUnique({
      where: { id: parseInt(id) },
      include: {
        enrollments: {
          include: {
            member: true,
          },
        },
      },
    });

    if (!plan) {
      return res.status(404).json({ error: 'Plan not found' });
    }

    res.json(plan);
  } catch (error) {
    console.error('Get plan error:', error);
    res.status(500).json({ error: 'Failed to fetch plan' });
  }
};

export const createPlan = async (req: AuthRequest, res: Response) => {
  try {
    const {
      name,
      durationMonths,
      cost,
      description,
      allowedClasses,
      features,
    } = req.body;

    // Validation
    if (!name || !durationMonths || !cost) {
      return res.status(400).json({ error: 'Name, duration, and cost are required' });
    }

    if (durationMonths <= 0) {
      return res.status(400).json({ error: 'Duration must be positive' });
    }

    if (cost <= 0) {
      return res.status(400).json({ error: 'Cost must be positive' });
    }

    const plan = await prisma.plan.create({
      data: {
        name,
        durationMonths: parseInt(durationMonths),
        cost: parseFloat(cost),
        description,
        allowedClasses: allowedClasses || [],
        features: features || [],
        status: 'active',
      },
    });

    res.status(201).json(plan);
  } catch (error) {
    console.error('Create plan error:', error);
    res.status(500).json({ error: 'Failed to create plan' });
  }
};

export const updatePlan = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const {
      name,
      durationMonths,
      cost,
      description,
      allowedClasses,
      features,
      status,
    } = req.body;

    const existingPlan = await prisma.plan.findUnique({
      where: { id: parseInt(id) },
    });

    if (!existingPlan) {
      return res.status(404).json({ error: 'Plan not found' });
    }

    // Validation
    if (durationMonths && durationMonths <= 0) {
      return res.status(400).json({ error: 'Duration must be positive' });
    }

    if (cost && cost <= 0) {
      return res.status(400).json({ error: 'Cost must be positive' });
    }

    const updateData: any = {};
    if (name !== undefined) updateData.name = name;
    if (durationMonths !== undefined) updateData.durationMonths = parseInt(durationMonths);
    if (cost !== undefined) updateData.cost = parseFloat(cost);
    if (description !== undefined) updateData.description = description;
    if (allowedClasses !== undefined) updateData.allowedClasses = allowedClasses;
    if (features !== undefined) updateData.features = features;
    if (status !== undefined) updateData.status = status;

    const plan = await prisma.plan.update({
      where: { id: parseInt(id) },
      data: updateData,
    });

    res.json(plan);
  } catch (error) {
    console.error('Update plan error:', error);
    res.status(500).json({ error: 'Failed to update plan' });
  }
};

export const deletePlan = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;

    const existingPlan = await prisma.plan.findUnique({
      where: { id: parseInt(id) },
      include: {
        enrollments: {
          where: {
            status: 'active',
          },
        },
      },
    });

    if (!existingPlan) {
      return res.status(404).json({ error: 'Plan not found' });
    }

    // Check if plan has active enrollments
    if (existingPlan.enrollments.length > 0) {
      return res.status(400).json({
        error: 'Cannot delete plan with active enrollments. Please deactivate it instead.',
      });
    }

    await prisma.plan.delete({
      where: { id: parseInt(id) },
    });

    res.json({ message: 'Plan deleted successfully' });
  } catch (error) {
    console.error('Delete plan error:', error);
    res.status(500).json({ error: 'Failed to delete plan' });
  }
};
