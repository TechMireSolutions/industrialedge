import { Router } from 'express';
import {
    cmsController,
    contactController,
    reviewController,
    couponController,
    addressController
} from '../controllers/cmsController.js';
import { uploadController } from '../controllers/uploadController.js';
import { authenticate, authorize, optionalAuth } from '../middleware/auth.js';
import { validateBody, validateParams } from '../middleware/validate.js';
import {
    heroSlideSchema,
    bannerSchema,
    offerSchema,
    serviceSchema,
    footerContentSchema,
    siteSettingsSchema,
    pageContentSchema,
    contactSchema,
    reviewSchema,
    couponSchema,
    addressSchema
} from '../validators/schemas.js';
import { z } from 'zod';
import { uploadSingle, uploadArray } from '../middleware/upload.js';

const router = Router();

const idParamSchema = z.object({ id: z.string().min(1) });
const slugParamSchema = z.object({ slug: z.string().min(1) });
const productIdParamSchema = z.object({ productId: z.string().min(1) });

// Public routes (no auth required)
router.get('/hero-slides', optionalAuth, cmsController.getHeroSlides);
router.get('/hero-slides/:id', optionalAuth, validateParams(idParamSchema), cmsController.getHeroSlide);

router.get('/banners', optionalAuth, cmsController.getBanners);
router.get('/banners/:id', optionalAuth, validateParams(idParamSchema), cmsController.getBanner);

router.get('/offers', optionalAuth, cmsController.getOffers);
router.get('/offers/:id', optionalAuth, validateParams(idParamSchema), cmsController.getOffer);

router.get('/services', optionalAuth, cmsController.getServices);
router.get('/services/:id', optionalAuth, validateParams(idParamSchema), cmsController.getService);

router.get('/footer', optionalAuth, cmsController.getFooterContents);
router.get('/footer/:id', optionalAuth, validateParams(idParamSchema), cmsController.getFooterContent);

router.get('/pages', optionalAuth, cmsController.getPages);
router.get('/pages/:slug', optionalAuth, validateParams(slugParamSchema), cmsController.getPage);

router.post('/contact', validateBody(contactSchema), contactController.submitContact);

router.get('/products/:productId/reviews', optionalAuth, validateParams(productIdParamSchema), reviewController.getProductReviews);
router.post('/products/:productId/reviews', authenticate, validateParams(productIdParamSchema), validateBody(reviewSchema), reviewController.createReview);

router.post('/coupons/validate', optionalAuth, couponController.validate);

router.get('/addresses', authenticate, addressController.getAddresses);
router.get('/addresses/:id', authenticate, validateParams(idParamSchema), addressController.getAddress);
router.post('/addresses', authenticate, validateBody(addressSchema), addressController.createAddress);
router.put('/addresses/:id', authenticate, validateParams(idParamSchema), validateBody(addressSchema.partial()), addressController.updateAddress);
router.delete('/addresses/:id', authenticate, validateParams(idParamSchema), addressController.deleteAddress);

// Upload routes (require authentication)
router.post('/upload/image', authenticate, uploadSingle('image'), uploadController.uploadImage);
router.post('/upload/images', authenticate, uploadArray('images', 10), uploadController.uploadMultipleImages);

// Admin routes (require ADMIN role)
export const adminCmsRouter = Router();
adminCmsRouter.use(authenticate, authorize('ADMIN'));

// Hero Slides
adminCmsRouter.get('/hero-slides', cmsController.getHeroSlides);
adminCmsRouter.get('/hero-slides/:id', validateParams(idParamSchema), cmsController.getHeroSlide);
adminCmsRouter.post('/hero-slides', validateBody(heroSlideSchema), cmsController.createHeroSlide);
adminCmsRouter.put('/hero-slides/:id', validateParams(idParamSchema), validateBody(heroSlideSchema.partial()), cmsController.updateHeroSlide);
adminCmsRouter.delete('/hero-slides/:id', validateParams(idParamSchema), cmsController.deleteHeroSlide);
adminCmsRouter.put('/hero-slides/reorder', cmsController.reorderHeroSlides);

// Banners
adminCmsRouter.get('/banners', cmsController.getBanners);
adminCmsRouter.get('/banners/:id', validateParams(idParamSchema), cmsController.getBanner);
adminCmsRouter.post('/banners', validateBody(bannerSchema), cmsController.createBanner);
adminCmsRouter.put('/banners/:id', validateParams(idParamSchema), validateBody(bannerSchema.partial()), cmsController.updateBanner);
adminCmsRouter.delete('/banners/:id', validateParams(idParamSchema), cmsController.deleteBanner);

// Offers
adminCmsRouter.get('/offers', cmsController.getOffers);
adminCmsRouter.get('/offers/:id', validateParams(idParamSchema), cmsController.getOffer);
adminCmsRouter.post('/offers', validateBody(offerSchema), cmsController.createOffer);
adminCmsRouter.put('/offers/:id', validateParams(idParamSchema), validateBody(offerSchema.partial()), cmsController.updateOffer);
adminCmsRouter.delete('/offers/:id', validateParams(idParamSchema), cmsController.deleteOffer);

// Services
adminCmsRouter.get('/services', cmsController.getServices);
adminCmsRouter.get('/services/:id', validateParams(idParamSchema), cmsController.getService);
adminCmsRouter.post('/services', validateBody(serviceSchema), cmsController.createService);
adminCmsRouter.put('/services/:id', validateParams(idParamSchema), validateBody(serviceSchema.partial()), cmsController.updateService);
adminCmsRouter.delete('/services/:id', validateParams(idParamSchema), cmsController.deleteService);

// Footer
adminCmsRouter.get('/footer', cmsController.getFooterContents);
adminCmsRouter.get('/footer/:id', validateParams(idParamSchema), cmsController.getFooterContent);
adminCmsRouter.post('/footer', validateBody(footerContentSchema), cmsController.createFooterContent);
adminCmsRouter.put('/footer/:id', validateParams(idParamSchema), validateBody(footerContentSchema.partial()), cmsController.updateFooterContent);
adminCmsRouter.delete('/footer/:id', validateParams(idParamSchema), cmsController.deleteFooterContent);

// Contact Submissions
adminCmsRouter.get('/contacts', contactController.getSubmissions);
adminCmsRouter.get('/contacts/:id', validateParams(idParamSchema), contactController.getSubmission);
adminCmsRouter.delete('/contacts/:id', validateParams(idParamSchema), contactController.deleteSubmission);

// Pages
adminCmsRouter.get('/pages', cmsController.getPages);
adminCmsRouter.get('/pages/:id', validateParams(idParamSchema), cmsController.getPage);
adminCmsRouter.post('/pages', validateBody(pageContentSchema), cmsController.createPage);
adminCmsRouter.put('/pages/:id', validateParams(idParamSchema), validateBody(pageContentSchema.partial()), cmsController.updatePage);
adminCmsRouter.delete('/pages/:id', validateParams(idParamSchema), cmsController.deletePage);

// Reviews (Admin view)
adminCmsRouter.get('/reviews', reviewController.getProductReviews);
adminCmsRouter.put('/reviews/:id', validateParams(idParamSchema), reviewController.approveReview);
adminCmsRouter.delete('/reviews/:id', validateParams(idParamSchema), reviewController.deleteReview);

// Coupons
adminCmsRouter.get('/coupons', couponController.getAll);
adminCmsRouter.get('/coupons/:id', validateParams(idParamSchema), couponController.validate);
adminCmsRouter.post('/coupons', validateBody(couponSchema), couponController.create);
adminCmsRouter.put('/coupons/:id', validateParams(idParamSchema), validateBody(couponSchema.partial()), couponController.update);
adminCmsRouter.delete('/coupons/:id', validateParams(idParamSchema), couponController.delete);

export default router;
