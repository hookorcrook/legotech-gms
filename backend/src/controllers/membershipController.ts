import { Request, Response } from 'express';
import prisma from '../config/prisma';

export const getMemberships = async (req: Request, res: Response) => {
  try {
    const memberships = await prisma.membership.findMany({
      orderBy: { price: 'asc' }
    });
    res.json(memberships);
  } catch (error) {
    console.error('Error fetching memberships:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const createMembership = async (req: Request, res: Response) => {
  try {
    const { name, price, features, isPopular } = req.body;
    const membership = await prisma.membership.create({
      data: {
        name,
        price,
        features,
        isPopular
      }
    });
    res.status(201).json(membership);
  } catch (error) {
    console.error('Error creating membership:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const getMembership = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const membership = await prisma.membership.findUnique({
      where: { id: parseInt(id) }
    });
    
    if (!membership) {
      return res.status(404).json({ error: 'Membership not found' });
    }
    
    res.json(membership);
  } catch (error) {
    console.error('Error fetching membership:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const updateMembership = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { name, price, features, isPopular } = req.body;
    
    const membership = await prisma.membership.update({
      where: { id: parseInt(id) },
      data: {
        name,
        price,
        features,
        isPopular
      }
    });
    
    res.json(membership);
  } catch (error) {
    console.error('Error updating membership:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const deleteMembership = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    
    await prisma.membership.delete({
      where: { id: parseInt(id) }
    });
    
    res.json({ message: 'Membership deleted successfully' });
  } catch (error) {
    console.error('Error deleting membership:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};
