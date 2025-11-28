import { Router } from 'express';
import { getPrograms, createProgram, getProgram, updateProgram, deleteProgram } from '../controllers/programController';
import { getTrainers, getTrainer, createTrainer, updateTrainer, deleteTrainer } from '../controllers/trainerController';
import { getMemberships, createMembership, getMembership, updateMembership, deleteMembership } from '../controllers/membershipController';
import { submitContact, getStats } from '../controllers/miscController';
import { register, login, logout, getMe } from '../controllers/authController';
import { getMembers, getMember, createMember, updateMember, deleteMember } from '../controllers/memberController';
import { getClasses, getClass, createClass, updateClass, deleteClass } from '../controllers/classController';
import { getEquipment, getEquipmentItem, createEquipment, updateEquipment, deleteEquipment } from '../controllers/equipmentController';
import { getPayments, getPayment, createPayment, updatePayment, deletePayment } from '../controllers/paymentController';
import { getStaff, getStaffMember, createStaff, updateStaff, deleteStaff } from '../controllers/staffController';
import { getDashboardStats, getRevenueReport, getMembershipReport } from '../controllers/dashboardController';
import { getPlans, getPlan, createPlan, updatePlan, deletePlan } from '../controllers/planController';
import { getEnrollments, getEnrollment, createEnrollment, updateEnrollment, deleteEnrollment } from '../controllers/enrollmentController';
import { getUsers, getUser, createUser, updateUser, deleteUser } from '../controllers/userController';
import { getSiteSettings, updateSiteSettings } from '../controllers/settingsController';
import { 
  getProfile, 
  updateProfile, 
  changePassword, 
  updateProfileImage, 
  removeProfileImage 
} from '../controllers/profileController';
import { 
  getTestimonials, 
  submitTestimonial, 
  getAllTestimonials, 
  updateTestimonial, 
  deleteTestimonial 
} from '../controllers/testimonialsController';
import { 
  getAllGalleryImages, 
  getGalleryImage, 
  createGalleryImage, 
  updateGalleryImage, 
  deleteGalleryImage,
  upload
} from '../controllers/galleryController';
import { authMiddleware, adminOnly } from '../middleware/auth';
import { checkPermission } from '../middleware/permissions';
import publicRoutes from './public';

const router = Router();

// Public routes (new dedicated public API)
router.use('/public', publicRoutes);

// Public routes
router.get('/programs', getPrograms);
router.get('/trainers', getTrainers);
router.get('/memberships', getMemberships);
router.get('/testimonials', getTestimonials);
router.get('/stats', getStats);
router.post('/contact', submitContact);

// Site Settings - Public GET, Admin PUT
router.get('/settings', getSiteSettings);

// Auth routes
router.post('/auth/register', register);
router.post('/auth/login', login);
router.post('/auth/logout', logout);
router.get('/auth/me', authMiddleware, getMe);

// Profile routes - All authenticated users
router.get('/admin/profile', authMiddleware, getProfile);
router.put('/admin/profile', authMiddleware, updateProfile);
router.put('/admin/profile/password', authMiddleware, changePassword);
router.put('/admin/profile/image', authMiddleware, updateProfileImage);
router.delete('/admin/profile/image', authMiddleware, removeProfileImage);

// Protected admin routes
// Dashboard - accessible by all roles
router.get('/admin/dashboard/stats', authMiddleware, checkPermission('dashboard'), getDashboardStats);

// Members - SUPER_ADMIN, ADMIN, MANAGER, TRAINER
router.get('/admin/members', authMiddleware, checkPermission('members'), getMembers);
router.get('/admin/members/:id', authMiddleware, checkPermission('members'), getMember);
router.post('/admin/members', authMiddleware, checkPermission('members'), createMember);
router.put('/admin/members/:id', authMiddleware, checkPermission('members'), updateMember);
router.delete('/admin/members/:id', authMiddleware, checkPermission('members'), deleteMember);

// Classes - SUPER_ADMIN, ADMIN, MANAGER, TRAINER
router.get('/admin/classes', authMiddleware, checkPermission('classes'), getClasses);
router.get('/admin/classes/:id', authMiddleware, checkPermission('classes'), getClass);
router.post('/admin/classes', authMiddleware, checkPermission('classes'), createClass);
router.put('/admin/classes/:id', authMiddleware, checkPermission('classes'), updateClass);
router.delete('/admin/classes/:id', authMiddleware, checkPermission('classes'), deleteClass);

// Equipment - SUPER_ADMIN, ADMIN, MAINTENANCE
router.get('/admin/equipment', authMiddleware, checkPermission('equipment'), getEquipment);
router.get('/admin/equipment/:id', authMiddleware, checkPermission('equipment'), getEquipmentItem);
router.post('/admin/equipment', authMiddleware, checkPermission('equipment'), createEquipment);
router.put('/admin/equipment/:id', authMiddleware, checkPermission('equipment'), updateEquipment);
router.delete('/admin/equipment/:id', authMiddleware, checkPermission('equipment'), deleteEquipment);

// Payments - SUPER_ADMIN, ADMIN, MANAGER, ACCOUNTANT
router.get('/admin/payments', authMiddleware, checkPermission('payments'), getPayments);
router.get('/admin/payments/:id', authMiddleware, checkPermission('payments'), getPayment);
router.post('/admin/payments', authMiddleware, checkPermission('payments'), createPayment);
router.put('/admin/payments/:id', authMiddleware, checkPermission('payments'), updatePayment);
router.delete('/admin/payments/:id', authMiddleware, checkPermission('payments'), deletePayment);

// Staff - SUPER_ADMIN, ADMIN only
router.get('/admin/staff', authMiddleware, checkPermission('staff'), getStaff);
router.get('/admin/staff/:id', authMiddleware, checkPermission('staff'), getStaffMember);
router.post('/admin/staff', authMiddleware, checkPermission('staff'), createStaff);
router.put('/admin/staff/:id', authMiddleware, checkPermission('staff'), updateStaff);
router.delete('/admin/staff/:id', authMiddleware, checkPermission('staff'), deleteStaff);

// Trainers (Coaches) - SUPER_ADMIN, ADMIN only
router.get('/admin/trainers', authMiddleware, checkPermission('staff'), getTrainers);
router.get('/admin/trainers/:id', authMiddleware, checkPermission('staff'), getTrainer);
router.post('/admin/trainers', authMiddleware, checkPermission('staff'), createTrainer);
router.put('/admin/trainers/:id', authMiddleware, checkPermission('staff'), updateTrainer);
router.delete('/admin/trainers/:id', authMiddleware, checkPermission('staff'), deleteTrainer);

// Plans - SUPER_ADMIN, ADMIN, MANAGER (read-only for manager)
router.get('/admin/plans', authMiddleware, checkPermission('plans'), getPlans);
router.get('/admin/plans/:id', authMiddleware, checkPermission('plans'), getPlan);
router.post('/admin/plans', authMiddleware, adminOnly, createPlan);
router.put('/admin/plans/:id', authMiddleware, adminOnly, updatePlan);
router.delete('/admin/plans/:id', authMiddleware, adminOnly, deletePlan);

// Enrollments - SUPER_ADMIN, ADMIN, MANAGER
router.get('/admin/enrollments', authMiddleware, checkPermission('enrollments'), getEnrollments);
router.get('/admin/enrollments/:id', authMiddleware, checkPermission('enrollments'), getEnrollment);
router.post('/admin/enrollments', authMiddleware, checkPermission('enrollments'), createEnrollment);
router.put('/admin/enrollments/:id', authMiddleware, checkPermission('enrollments'), updateEnrollment);
router.delete('/admin/enrollments/:id', authMiddleware, checkPermission('enrollments'), deleteEnrollment);

// Reports - SUPER_ADMIN, ADMIN, ACCOUNTANT
router.get('/admin/reports/revenue', authMiddleware, checkPermission('reports'), getRevenueReport);
router.get('/admin/reports/membership', authMiddleware, checkPermission('reports'), getMembershipReport);

// CCTV - SUPER_ADMIN, ADMIN, MAINTENANCE
// (Note: Add CCTV controller routes here when implemented)

// Programs - SUPER_ADMIN, ADMIN only
router.get('/admin/programs', authMiddleware, adminOnly, getPrograms);
router.get('/admin/programs/:id', authMiddleware, adminOnly, getProgram);
router.post('/admin/programs', authMiddleware, adminOnly, createProgram);
router.put('/admin/programs/:id', authMiddleware, adminOnly, updateProgram);
router.delete('/admin/programs/:id', authMiddleware, adminOnly, deleteProgram);

// Memberships - SUPER_ADMIN, ADMIN only
router.get('/admin/memberships', authMiddleware, adminOnly, getMemberships);
router.get('/admin/memberships/:id', authMiddleware, adminOnly, getMembership);
router.post('/admin/memberships', authMiddleware, adminOnly, createMembership);
router.put('/admin/memberships/:id', authMiddleware, adminOnly, updateMembership);
router.delete('/admin/memberships/:id', authMiddleware, adminOnly, deleteMembership);

// Testimonials - Public submission, Admin management
router.post('/testimonials', submitTestimonial);
router.get('/admin/testimonials', authMiddleware, checkPermission('testimonials'), getAllTestimonials);
router.put('/admin/testimonials/:id', authMiddleware, checkPermission('testimonials'), updateTestimonial);
router.delete('/admin/testimonials/:id', authMiddleware, checkPermission('testimonials'), deleteTestimonial);

// Gallery - SUPER_ADMIN, ADMIN only
router.get('/admin/gallery', authMiddleware, checkPermission('gallery'), getAllGalleryImages);
router.get('/admin/gallery/:id', authMiddleware, checkPermission('gallery'), getGalleryImage);
router.post('/admin/gallery', authMiddleware, checkPermission('gallery'), upload.single('image'), createGalleryImage);
router.put('/admin/gallery/:id', authMiddleware, checkPermission('gallery'), upload.single('image'), updateGalleryImage);
router.delete('/admin/gallery/:id', authMiddleware, checkPermission('gallery'), deleteGalleryImage);

// Users Management - SUPER_ADMIN, ADMIN only
router.get('/admin/users', authMiddleware, checkPermission('users'), getUsers);
router.get('/admin/users/:id', authMiddleware, checkPermission('users'), getUser);
router.post('/admin/users', authMiddleware, checkPermission('users'), createUser);
router.put('/admin/users/:id', authMiddleware, checkPermission('users'), updateUser);
router.delete('/admin/users/:id', authMiddleware, checkPermission('users'), deleteUser);

// Site Settings - SUPER_ADMIN only
router.put('/admin/settings', authMiddleware, checkPermission('settings'), updateSiteSettings);

export default router;
