import { Router } from 'express';
import {
  getStats,
  getPrograms,
  getTrainers,
  getMemberships,
  getTestimonials,
  createContactForm,
  updateStats,
} from '../controllers/publicController';
import { getGalleryImages } from '../controllers/galleryController';
import { authMiddleware, adminOnly } from '../middleware/auth';

const router = Router();

// Public routes (no authentication required)
router.get('/stats', getStats);
router.get('/programs', getPrograms);
router.get('/trainers', getTrainers);
router.get('/memberships', getMemberships);
router.get('/testimonials', getTestimonials);
router.get('/gallery', getGalleryImages);
router.post('/contact', createContactForm);

// Admin routes (authentication required)
router.put('/stats', authMiddleware, adminOnly, updateStats);

export default router;
