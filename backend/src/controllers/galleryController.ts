import { Request, Response } from 'express';
import prisma from '../config/prisma';
import multer from 'multer';
import path from 'path';
import fs from 'fs';

// Configure multer for image uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = path.join(__dirname, '../../uploads/gallery');
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, 'gallery-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const fileFilter = (req: any, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
  const allowedTypes = /jpeg|jpg|png|gif|webp/;
  const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = allowedTypes.test(file.mimetype);

  if (mimetype && extname) {
    return cb(null, true);
  } else {
    cb(new Error('Only image files are allowed!'));
  }
};

export const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter
});

// GET /api/public/gallery - Get gallery images
export const getGalleryImages = async (req: Request, res: Response) => {
  try {
    const { featured, category } = req.query;

    const where: any = {};

    if (featured === 'true') {
      where.isFeatured = true;
    }

    if (category && category !== 'all') {
      where.category = category;
    }

    const images = await prisma.gallery.findMany({
      where,
      orderBy: { createdAt: 'desc' },
    });

    res.json(images);
  } catch (error) {
    console.error('Get gallery images error:', error);
    res.status(500).json({ error: 'Failed to fetch gallery images' });
  }
};

// GET /api/admin/gallery - Get all gallery images (admin)
export const getAllGalleryImages = async (req: Request, res: Response) => {
  try {
    const images = await prisma.gallery.findMany({
      orderBy: { createdAt: 'desc' },
    });
    res.json(images);
  } catch (error) {
    console.error('Get all gallery images error:', error);
    res.status(500).json({ error: 'Failed to fetch gallery images' });
  }
};

// GET /api/admin/gallery/:id - Get single gallery image
export const getGalleryImage = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const image = await prisma.gallery.findUnique({
      where: { id: parseInt(id) },
    });

    if (!image) {
      return res.status(404).json({ error: 'Image not found' });
    }

    res.json(image);
  } catch (error) {
    console.error('Get gallery image error:', error);
    res.status(500).json({ error: 'Failed to fetch gallery image' });
  }
};

// POST /api/admin/gallery - Create gallery image
export const createGalleryImage = async (req: Request, res: Response) => {
  try {
    const { title, category, isFeatured } = req.body;
    const file = req.file;

    if (!file) {
      return res.status(400).json({ error: 'Image file is required' });
    }

    const imageUrl = `/uploads/gallery/${file.filename}`;

    const image = await prisma.gallery.create({
      data: {
        title,
        imageUrl,
        category,
        isFeatured: isFeatured === 'true' || isFeatured === true,
      },
    });

    res.status(201).json(image);
  } catch (error) {
    console.error('Create gallery image error:', error);
    res.status(500).json({ error: 'Failed to create gallery image' });
  }
};

// PUT /api/admin/gallery/:id - Update gallery image
export const updateGalleryImage = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { title, category, isFeatured } = req.body;
    const file = req.file;

    const existingImage = await prisma.gallery.findUnique({
      where: { id: parseInt(id) },
    });

    if (!existingImage) {
      return res.status(404).json({ error: 'Image not found' });
    }

    let imageUrl = existingImage.imageUrl;

    // If new file uploaded, delete old file and use new one
    if (file) {
      // Delete old file
      const oldFilePath = path.join(__dirname, '../..', existingImage.imageUrl);
      if (fs.existsSync(oldFilePath)) {
        fs.unlinkSync(oldFilePath);
      }
      imageUrl = `/uploads/gallery/${file.filename}`;
    }

    const updatedImage = await prisma.gallery.update({
      where: { id: parseInt(id) },
      data: {
        title,
        imageUrl,
        category,
        isFeatured: isFeatured === 'true' || isFeatured === true,
      },
    });

    res.json(updatedImage);
  } catch (error) {
    console.error('Update gallery image error:', error);
    res.status(500).json({ error: 'Failed to update gallery image' });
  }
};

// DELETE /api/admin/gallery/:id - Delete gallery image
export const deleteGalleryImage = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const image = await prisma.gallery.findUnique({
      where: { id: parseInt(id) },
    });

    if (!image) {
      return res.status(404).json({ error: 'Image not found' });
    }

    // Delete file from filesystem
    const filePath = path.join(__dirname, '../..', image.imageUrl);
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }

    await prisma.gallery.delete({
      where: { id: parseInt(id) },
    });

    res.json({ message: 'Image deleted successfully' });
  } catch (error) {
    console.error('Delete gallery image error:', error);
    res.status(500).json({ error: 'Failed to delete gallery image' });
  }
};
