import { Response } from 'express';
import prisma from '../config/prisma';
import { AuthRequest } from '../middleware/auth';

export const getEquipment = async (req: AuthRequest, res: Response) => {
  try {
    const { category, condition } = req.query;

    const where: any = {};

    if (category) {
      where.category = category;
    }

    if (condition) {
      where.condition = condition;
    }

    const equipment = await prisma.equipment.findMany({
      where,
      orderBy: { name: 'asc' },
    });

    res.json(equipment);
  } catch (error) {
    console.error('Get equipment error:', error);
    res.status(500).json({ error: 'Failed to fetch equipment' });
  }
};

export const getEquipmentItem = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;

    const equipment = await prisma.equipment.findUnique({
      where: { id: parseInt(id) },
    });

    if (!equipment) {
      return res.status(404).json({ error: 'Equipment not found' });
    }

    res.json(equipment);
  } catch (error) {
    console.error('Get equipment error:', error);
    res.status(500).json({ error: 'Failed to fetch equipment' });
  }
};

export const createEquipment = async (req: AuthRequest, res: Response) => {
  try {
    const { name, category, quantity, condition, lastMaintenance, nextMaintenance, purchaseDate, cost, notes } = req.body;

    if (!name || !category || !quantity || !condition) {
      return res.status(400).json({ error: 'Name, category, quantity, and condition are required' });
    }

    const equipment = await prisma.equipment.create({
      data: {
        name,
        category,
        quantity,
        condition,
        lastMaintenance: lastMaintenance ? new Date(lastMaintenance) : null,
        nextMaintenance: nextMaintenance ? new Date(nextMaintenance) : null,
        purchaseDate: purchaseDate ? new Date(purchaseDate) : null,
        cost,
        notes,
      },
    });

    res.status(201).json(equipment);
  } catch (error) {
    console.error('Create equipment error:', error);
    res.status(500).json({ error: 'Failed to create equipment' });
  }
};

export const updateEquipment = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const { name, category, quantity, condition, lastMaintenance, nextMaintenance, purchaseDate, cost, notes } = req.body;

    const equipment = await prisma.equipment.update({
      where: { id: parseInt(id) },
      data: {
        name,
        category,
        quantity,
        condition,
        lastMaintenance: lastMaintenance ? new Date(lastMaintenance) : null,
        nextMaintenance: nextMaintenance ? new Date(nextMaintenance) : null,
        purchaseDate: purchaseDate ? new Date(purchaseDate) : null,
        cost,
        notes,
      },
    });

    res.json(equipment);
  } catch (error) {
    console.error('Update equipment error:', error);
    res.status(500).json({ error: 'Failed to update equipment' });
  }
};

export const deleteEquipment = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;

    await prisma.equipment.delete({
      where: { id: parseInt(id) },
    });

    res.json({ message: 'Equipment deleted successfully' });
  } catch (error) {
    console.error('Delete equipment error:', error);
    res.status(500).json({ error: 'Failed to delete equipment' });
  }
};
