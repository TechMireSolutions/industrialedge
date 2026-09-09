import { Router } from 'express';
import { adminController } from '../controllers/adminController.js';
import { authenticate, authorize } from '../middleware/auth.js';
import { adminProductRouter, adminCategoryRouter } from './productRoutes.js';
import { adminOrderRouter } from './orderRoutes.js';
import { adminCmsRouter } from './cmsRoutes.js';
import { adminTagRouter } from './tagRoutes.js';

const router = Router();

// Protect all admin routes
router.use(authenticate);
router.use(authorize('ADMIN'));

// Dashboard & Reports
router.get('/dashboard', adminController.getDashboard);
router.get('/reports/sales', adminController.getSalesReport);

// Custom Product & Order Admin Endpoints (must be before sub-routers to avoid :id collisions)
router.get('/products/low-stock', adminController.getLowStockProducts);
router.get('/orders/recent', adminController.getRecentOrders);

// Users
router.get('/users', adminController.getUsers);
router.get('/users/:id', adminController.getUserById);
router.post('/users', adminController.createUser);
router.put('/users/:id', adminController.updateUser);
router.put('/users/:id/role', adminController.updateUserRole);
router.delete('/users/:id', adminController.deleteUser);

// Mount Sub-Routers
// (Note: because they already have their own auth middleware in their files, 
// they are doubly protected here, which is perfectly safe).
router.use('/products', adminProductRouter);
router.use('/categories', adminCategoryRouter);
router.use('/tags', adminTagRouter);
router.use('/orders', adminOrderRouter);
// Note: cmsRoutes includes /hero-slides, /coupons, /banners, etc.
// We mount it at the root of /admin because adminCmsRouter internally mounts directly to /hero-slides etc.
router.use('/', adminCmsRouter);

export default router;
