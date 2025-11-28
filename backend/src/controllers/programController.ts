import { Request, Response } from 'express';
import prisma from '../config/prisma';

export const getPrograms = async (req: Request, res: Response) => {
  try {
    const programs = await prisma.program.findMany({
      orderBy: { id: 'asc' }
    });
    res.json(programs);
  } catch (error) {
    console.error('Error fetching programs:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const createProgram = async (req: Request, res: Response) => {
  try {
    const { category, title, description, features } = req.body;
    const program = await prisma.program.create({
      data: {
        category,
        title,
        description,
        features
      }
    });
    res.status(201).json(program);
  } catch (error) {
    console.error('Error creating program:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const getProgram = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const program = await prisma.program.findUnique({
      where: { id: parseInt(id) }
    });
    
    if (!program) {
      return res.status(404).json({ error: 'Program not found' });
    }
    
    res.json(program);
  } catch (error) {
    console.error('Error fetching program:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const updateProgram = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { category, title, description, features } = req.body;
    
    const program = await prisma.program.update({
      where: { id: parseInt(id) },
      data: {
        category,
        title,
        description,
        features
      }
    });
    
    res.json(program);
  } catch (error) {
    console.error('Error updating program:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const deleteProgram = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    
    await prisma.program.delete({
      where: { id: parseInt(id) }
    });
    
    res.json({ message: 'Program deleted successfully' });
  } catch (error) {
    console.error('Error deleting program:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};
