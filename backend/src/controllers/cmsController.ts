import { Request, Response, NextFunction } from 'express';
import { cmsService, contactService, reviewService, couponService, addressService } from '../services/cmsService.js';
import { AppError } from '../middleware/errorHandler.js';
import { AuthRequest } from '../middleware/auth.js';

export const cmsController = {
  async getHeroSlides(req: Request, res: Response, next: NextFunction) {
    try {
      const activeOnly = req.query.active !== 'false';
      const slides = await cmsService.getHeroSlides(activeOnly);
      res.json({ success: true, data: slides });
    } catch (error) {
      next(error);
    }
  },

  async getHeroSlide(req: Request, res: Response, next: NextFunction) {
    try {
      const slide = await cmsService.getHeroSlideById(req.params.id);
      res.json({ success: true, data: slide });
    } catch (error) {
      next(error);
    }
  },

  async createHeroSlide(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const slide = await cmsService.createHeroSlide(req.body);
      res.status(201).json({ success: true, data: slide });
    } catch (error) {
      next(error);
    }
  },

  async updateHeroSlide(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const slide = await cmsService.updateHeroSlide(req.params.id, req.body);
      res.json({ success: true, data: slide });
    } catch (error) {
      next(error);
    }
  },

  async deleteHeroSlide(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      await cmsService.deleteHeroSlide(req.params.id);
      res.json({ success: true, message: 'Hero slide deleted' });
    } catch (error) {
      next(error);
    }
  },

  async reorderHeroSlides(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      await cmsService.reorderHeroSlides(req.body.ids);
      res.json({ success: true, message: 'Hero slides reordered' });
    } catch (error) {
      next(error);
    }
  },

  async getBanners(req: Request, res: Response, next: NextFunction) {
    try {
      const activeOnly = req.query.active !== 'false';
      const banners = await cmsService.getBanners(activeOnly);
      res.json({ success: true, data: banners });
    } catch (error) {
      next(error);
    }
  },

  async getBanner(req: Request, res: Response, next: NextFunction) {
    try {
      const banner = await cmsService.getBannerById(req.params.id);
      res.json({ success: true, data: banner });
    } catch (error) {
      next(error);
    }
  },

  async createBanner(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const banner = await cmsService.createBanner(req.body);
      res.status(201).json({ success: true, data: banner });
    } catch (error) {
      next(error);
    }
  },

  async updateBanner(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const banner = await cmsService.updateBanner(req.params.id, req.body);
      res.json({ success: true, data: banner });
    } catch (error) {
      next(error);
    }
  },

  async deleteBanner(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      await cmsService.deleteBanner(req.params.id);
      res.json({ success: true, message: 'Banner deleted' });
    } catch (error) {
      next(error);
    }
  },

  async getOffers(req: Request, res: Response, next: NextFunction) {
    try {
      const activeOnly = req.query.active !== 'false';
      const offers = await cmsService.getOffers(activeOnly);
      res.json({ success: true, data: offers });
    } catch (error) {
      next(error);
    }
  },

  async getOffer(req: Request, res: Response, next: NextFunction) {
    try {
      const offer = await cmsService.getOfferById(req.params.id);
      res.json({ success: true, data: offer });
    } catch (error) {
      next(error);
    }
  },

  async createOffer(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const offer = await cmsService.createOffer(req.body);
      res.status(201).json({ success: true, data: offer });
    } catch (error) {
      next(error);
    }
  },

  async updateOffer(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const offer = await cmsService.updateOffer(req.params.id, req.body);
      res.json({ success: true, data: offer });
    } catch (error) {
      next(error);
    }
  },

  async deleteOffer(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      await cmsService.deleteOffer(req.params.id);
      res.json({ success: true, message: 'Offer deleted' });
    } catch (error) {
      next(error);
    }
  },

  async getServices(req: Request, res: Response, next: NextFunction) {
    try {
      const activeOnly = req.query.active !== 'false';
      const services = await cmsService.getServices(activeOnly);
      res.json({ success: true, data: services });
    } catch (error) {
      next(error);
    }
  },

  async getService(req: Request, res: Response, next: NextFunction) {
    try {
      const service = await cmsService.getServiceById(req.params.id);
      res.json({ success: true, data: service });
    } catch (error) {
      next(error);
    }
  },

  async createService(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const service = await cmsService.createService(req.body);
      res.status(201).json({ success: true, data: service });
    } catch (error) {
      next(error);
    }
  },

  async updateService(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const service = await cmsService.updateService(req.params.id, req.body);
      res.json({ success: true, data: service });
    } catch (error) {
      next(error);
    }
  },

  async deleteService(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      await cmsService.deleteService(req.params.id);
      res.json({ success: true, message: 'Service deleted' });
    } catch (error) {
      next(error);
    }
  },

  async getFooterContents(req: Request, res: Response, next: NextFunction) {
    try {
      const activeOnly = req.query.active !== 'false';
      const contents = await cmsService.getFooterContents(activeOnly);
      res.json({ success: true, data: contents });
    } catch (error) {
      next(error);
    }
  },

  async getFooterContent(req: Request, res: Response, next: NextFunction) {
    try {
      const content = await cmsService.getFooterContentById(req.params.id);
      res.json({ success: true, data: content });
    } catch (error) {
      next(error);
    }
  },

  async createFooterContent(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const content = await cmsService.createFooterContent(req.body);
      res.status(201).json({ success: true, data: content });
    } catch (error) {
      next(error);
    }
  },

  async updateFooterContent(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const content = await cmsService.updateFooterContent(req.params.id, req.body);
      res.json({ success: true, data: content });
    } catch (error) {
      next(error);
    }
  },

  async deleteFooterContent(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      await cmsService.deleteFooterContent(req.params.id);
      res.json({ success: true, message: 'Footer content deleted' });
    } catch (error) {
      next(error);
    }
  },

  async getPages(req: Request, res: Response, next: NextFunction) {
    try {
      const activeOnly = req.query.active !== 'false';
      const pages = await cmsService.getAllPageContents(activeOnly);
      res.json({ success: true, data: pages });
    } catch (error) {
      next(error);
    }
  },

  async getPage(req: Request, res: Response, next: NextFunction) {
    try {
      const page = await cmsService.getPageContent(req.params.slug);
      res.json({ success: true, data: page });
    } catch (error) {
      next(error);
    }
  },

  async createPage(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const page = await cmsService.createPageContent(req.body);
      res.status(201).json({ success: true, data: page });
    } catch (error) {
      next(error);
    }
  },

  async updatePage(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const page = await cmsService.updatePageContent(req.params.id, req.body);
      res.json({ success: true, data: page });
    } catch (error) {
      next(error);
    }
  },

  async deletePage(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      await cmsService.deletePageContent(req.params.id);
      res.json({ success: true, message: 'Page deleted' });
    } catch (error) {
      next(error);
    }
  },
};

export const contactController = {
  async submitContact(req: Request, res: Response, next: NextFunction) {
    try {
      const submission = await contactService.submitContact(req.body);
      res.status(201).json({ success: true, data: submission, message: 'Message sent successfully' });
    } catch (error) {
      next(error);
    }
  },

  async getSubmissions(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 20;
      const result = await contactService.getSubmissions(page, limit);
      res.json({ success: true, data: result.data, pagination: result.pagination });
    } catch (error) {
      next(error);
    }
  },

  async getSubmission(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const submission = await contactService.getSubmissionById(req.params.id);
      res.json({ success: true, data: submission });
    } catch (error) {
      next(error);
    }
  },

  async deleteSubmission(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      await contactService.deleteSubmission(req.params.id);
      res.json({ success: true, message: 'Submission deleted' });
    } catch (error) {
      next(error);
    }
  },
};

export const reviewController = {
  async getProductReviews(req: Request, res: Response, next: NextFunction) {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;
      const approvedOnly = req.query.approved !== 'false';
      const result = await reviewService.getProductReviews(req.params.productId, approvedOnly, page, limit);
      res.json({ success: true, data: result.data, pagination: result.pagination });
    } catch (error) {
      next(error);
    }
  },

  async createReview(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const review = await reviewService.createReview(req.user!.id, req.params.productId, req.body);
      res.status(201).json({ success: true, data: review });
    } catch (error) {
      next(error);
    }
  },

  async updateReview(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const review = await reviewService.updateReview(req.user!.id, req.params.id, req.body);
      res.json({ success: true, data: review });
    } catch (error) {
      next(error);
    }
  },

  async deleteReview(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      await reviewService.deleteReview(req.user!.id, req.params.id);
      res.json({ success: true, message: 'Review deleted' });
    } catch (error) {
      next(error);
    }
  },

  async approveReview(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const review = await reviewService.approveReview(req.params.id);
      await reviewService.getReviewStats(review.productId);
      res.json({ success: true, data: review });
    } catch (error) {
      next(error);
    }
  },

  async rejectReview(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const review = await reviewService.rejectReview(req.params.id);
      await reviewService.getReviewStats(review.productId);
      res.json({ success: true, data: review });
    } catch (error) {
      next(error);
    }
  },
};

export const couponController = {
  async getAll(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 20;
      const result = await couponService.getAll(page, limit);
      res.json({ success: true, data: result.data, pagination: result.pagination });
    } catch (error) {
      next(error);
    }
  },

  async validate(req: Request, res: Response, next: NextFunction) {
    try {
      const { code, subtotal } = req.body;
      const coupon = await couponService.validateCoupon(code, subtotal);
      let discount = 0;
      if (coupon.type === 'PERCENTAGE') {
        discount = subtotal * Number(coupon.value) / 100;
      } else {
        discount = Number(coupon.value);
      }
      if (coupon.maximumDiscount && discount > Number(coupon.maximumDiscount)) {
        discount = Number(coupon.maximumDiscount);
      }
      res.json({ success: true, data: { coupon, discount } });
    } catch (error) {
      next(error);
    }
  },

  async create(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const coupon = await couponService.create(req.body);
      res.status(201).json({ success: true, data: coupon });
    } catch (error) {
      next(error);
    }
  },

  async update(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const coupon = await couponService.update(req.params.id, req.body);
      res.json({ success: true, data: coupon });
    } catch (error) {
      next(error);
    }
  },

  async delete(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      await couponService.delete(req.params.id);
      res.json({ success: true, message: 'Coupon deleted' });
    } catch (error) {
      next(error);
    }
  },
};

export const addressController = {
  async getAddresses(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const addresses = await addressService.getAddresses(req.user!.id);
      res.json({ success: true, data: addresses });
    } catch (error) {
      next(error);
    }
  },

  async getAddress(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const address = await addressService.getAddressById(req.user!.id, req.params.id);
      res.json({ success: true, data: address });
    } catch (error) {
      next(error);
    }
  },

  async createAddress(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const address = await addressService.createAddress(req.user!.id, req.body);
      res.status(201).json({ success: true, data: address });
    } catch (error) {
      next(error);
    }
  },

  async updateAddress(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const address = await addressService.updateAddress(req.user!.id, req.params.id, req.body);
      res.json({ success: true, data: address });
    } catch (error) {
      next(error);
    }
  },

  async deleteAddress(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      await addressService.deleteAddress(req.user!.id, req.params.id);
      res.json({ success: true, message: 'Address deleted' });
    } catch (error) {
      next(error);
    }
  },
};
