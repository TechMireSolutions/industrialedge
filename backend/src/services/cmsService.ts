import { prisma } from '../config/database.js';
import { AppError } from '../middleware/errorHandler.js';

export const cmsService = {
  mapHeroSlide(slide: any) {
    return {
      ...slide,
      image: slide.image?.storagePath || slide.image?.url || '',
      backgroundImage: slide.backgroundImage?.storagePath || slide.backgroundImage?.url || ''
    };
  },

  async getHeroSlides(activeOnly = true) {
    const slides = await prisma.heroSlide.findMany({
      where: activeOnly ? { active: true } : {},
      orderBy: { ordering: 'asc' },
      include: { image: true, backgroundImage: true }
    });
    return slides.map(slide => this.mapHeroSlide(slide));
  },

  async getHeroSlideById(id: string) {
    const slide = await prisma.heroSlide.findUnique({ 
      where: { id },
      include: { image: true, backgroundImage: true }
    });
    if (!slide) throw new AppError(404, 'Hero slide not found');
    return this.mapHeroSlide(slide);
  },

  async createHeroSlide(data: any) {
    const { image, backgroundImage, ...prismaData } = data;
    const slide = await prisma.heroSlide.create({ 
      data: prismaData, 
      include: { image: true, backgroundImage: true } 
    });
    return this.mapHeroSlide(slide);
  },

  async updateHeroSlide(id: string, data: any) {
    const slide = await prisma.heroSlide.findUnique({ where: { id } });
    if (!slide) throw new AppError(404, 'Hero slide not found');
    const { image, backgroundImage, ...prismaData } = data;
    const updated = await prisma.heroSlide.update({ 
      where: { id }, 
      data: prismaData, 
      include: { image: true, backgroundImage: true } 
    });
    return this.mapHeroSlide(updated);
  },

  async deleteHeroSlide(id: string) {
    const slide = await prisma.heroSlide.findUnique({ where: { id } });
    if (!slide) throw new AppError(404, 'Hero slide not found');
    return prisma.heroSlide.delete({ where: { id } });
  },

  async reorderHeroSlides(ids: string[]) {
    return prisma.$transaction(
      ids.map((id, index) =>
        prisma.heroSlide.update({ where: { id }, data: { ordering: index } })
      )
    );
  },

  async getBanners(activeOnly = true) {
    return prisma.banner.findMany({
      where: activeOnly ? { active: true } : {},
      orderBy: { ordering: 'asc' },
    });
  },

  async getBannerById(id: string) {
    const banner = await prisma.banner.findUnique({ where: { id } });
    if (!banner) throw new AppError(404, 'Banner not found');
    return banner;
  },

  async createBanner(data: any) {
    return prisma.banner.create({ data });
  },

  async updateBanner(id: string, data: any) {
    const banner = await prisma.banner.findUnique({ where: { id } });
    if (!banner) throw new AppError(404, 'Banner not found');
    return prisma.banner.update({ where: { id }, data });
  },

  async deleteBanner(id: string) {
    const banner = await prisma.banner.findUnique({ where: { id } });
    if (!banner) throw new AppError(404, 'Banner not found');
    return prisma.banner.delete({ where: { id } });
  },

  async getOffers(activeOnly = true) {
    const where: any = {};
    if (activeOnly) {
      where.active = true;
      const now = new Date();
      where.OR = [
        { startDate: null, endDate: null },
        { startDate: { lte: now }, endDate: null },
        { startDate: null, endDate: { gte: now } },
        { startDate: { lte: now }, endDate: { gte: now } }
      ];
    }
    return prisma.offer.findMany({
      where,
      orderBy: { ordering: 'asc' },
    });
  },

  async getOfferById(id: string) {
    const offer = await prisma.offer.findUnique({ where: { id } });
    if (!offer) throw new AppError(404, 'Offer not found');
    return offer;
  },

  async createOffer(data: any) {
    return prisma.offer.create({ data });
  },

  async updateOffer(id: string, data: any) {
    const offer = await prisma.offer.findUnique({ where: { id } });
    if (!offer) throw new AppError(404, 'Offer not found');
    return prisma.offer.update({ where: { id }, data });
  },

  async deleteOffer(id: string) {
    const offer = await prisma.offer.findUnique({ where: { id } });
    if (!offer) throw new AppError(404, 'Offer not found');
    return prisma.offer.delete({ where: { id } });
  },

  async getServices(activeOnly = true) {
    return prisma.service.findMany({
      where: activeOnly ? { active: true } : {},
      orderBy: { ordering: 'asc' },
    });
  },

  async getServiceById(id: string) {
    const service = await prisma.service.findUnique({ where: { id } });
    if (!service) throw new AppError(404, 'Service not found');
    return service;
  },

  async createService(data: any) {
    return prisma.service.create({ data });
  },

  async updateService(id: string, data: any) {
    const service = await prisma.service.findUnique({ where: { id } });
    if (!service) throw new AppError(404, 'Service not found');
    return prisma.service.update({ where: { id }, data });
  },

  async deleteService(id: string) {
    const service = await prisma.service.findUnique({ where: { id } });
    if (!service) throw new AppError(404, 'Service not found');
    return prisma.service.delete({ where: { id } });
  },

  async getFooterContents(activeOnly = true) {
    return prisma.footerContent.findMany({
      where: activeOnly ? { active: true } : {},
      orderBy: { ordering: 'asc' },
    });
  },

  async getFooterContentBySection(section: string) {
    return prisma.footerContent.findUnique({ where: { section } });
  },

  async getFooterContentById(id: string) {
    const content = await prisma.footerContent.findUnique({ where: { id } });
    if (!content) throw new AppError(404, 'Footer content not found');
    return content;
  },

  async createFooterContent(data: any) {
    const existing = await prisma.footerContent.findUnique({ where: { section: data.section } });
    if (existing) throw new AppError(409, 'Footer section already exists');
    return prisma.footerContent.create({ data });
  },

  async updateFooterContent(id: string, data: any) {
    const content = await prisma.footerContent.findUnique({ where: { id } });
    if (!content) throw new AppError(404, 'Footer content not found');

    if (data.section && data.section !== content.section) {
      const existing = await prisma.footerContent.findUnique({ where: { section: data.section } });
      if (existing) throw new AppError(409, 'Footer section already exists');
    }

    return prisma.footerContent.update({ where: { id }, data });
  },

  async deleteFooterContent(id: string) {
    const content = await prisma.footerContent.findUnique({ where: { id } });
    if (!content) throw new AppError(404, 'Footer content not found');
    return prisma.footerContent.delete({ where: { id } });
  },



  async getPageContent(slug: string) {
    const page = await prisma.pageContent.findUnique({ where: { slug } });
    if (!page) throw new AppError(404, 'Page not found');
    return page;
  },

  async getAllPageContents(activeOnly = true) {
    return prisma.pageContent.findMany({
      where: activeOnly ? { active: true } : {},
      orderBy: { title: 'asc' },
    });
  },

  async createPageContent(data: any) {
    const existing = await prisma.pageContent.findUnique({ where: { slug: data.slug } });
    if (existing) throw new AppError(409, 'Page slug already exists');
    return prisma.pageContent.create({ data });
  },

  async updatePageContent(id: string, data: any) {
    const page = await prisma.pageContent.findUnique({ where: { id } });
    if (!page) throw new AppError(404, 'Page not found');

    if (data.slug && data.slug !== page.slug) {
      const existing = await prisma.pageContent.findUnique({ where: { slug: data.slug } });
      if (existing) throw new AppError(409, 'Page slug already exists');
    }

    return prisma.pageContent.update({ where: { id }, data });
  },

  async deletePageContent(id: string) {
    const page = await prisma.pageContent.findUnique({ where: { id } });
    if (!page) throw new AppError(404, 'Page not found');
    return prisma.pageContent.delete({ where: { id } });
  },
};

export const contactService = {
  async submitContact(data: any) {
    return prisma.contactSubmission.create({ data });
  },

  async getSubmissions(page = 1, limit = 20) {
    const [submissions, total] = await Promise.all([
      prisma.contactSubmission.findMany({
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.contactSubmission.count(),
    ]);

    return {
      data: submissions,
      pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
    };
  },

  async getSubmissionById(id: string) {
    const submission = await prisma.contactSubmission.findUnique({ where: { id } });
    if (!submission) throw new AppError(404, 'Submission not found');
    return submission;
  },

  async deleteSubmission(id: string) {
    const submission = await prisma.contactSubmission.findUnique({ where: { id } });
    if (!submission) throw new AppError(404, 'Submission not found');
    return prisma.contactSubmission.delete({ where: { id } });
  },
};

export const reviewService = {
  async getProductReviews(productId: string, approvedOnly = true, page = 1, limit = 10) {
    const where: any = { productId };
    if (approvedOnly) where.approved = true;

    const [reviews, total] = await Promise.all([
      prisma.review.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * limit,
        take: limit,
        include: { user: { select: { id: true, name: true } } },
      }),
      prisma.review.count({ where }),
    ]);

    return {
      data: reviews,
      pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
    };
  },

  async createReview(userId: string, productId: string, data: { rating: number; title: string; comment: string }) {
    const product = await prisma.product.findUnique({ where: { id: productId } });
    if (!product) throw new AppError(404, 'Product not found');

    const existing = await prisma.review.findUnique({
      where: { productId_userId: { productId, userId } },
    });

    if (existing) throw new AppError(409, 'You have already reviewed this product');

    const orderItem = await prisma.orderItem.findFirst({
      where: {
        productId,
        order: { userId, paymentStatus: 'PAID' },
      },
    });

    if (!orderItem) throw new AppError(403, 'You can only review products you have purchased');

    return prisma.review.create({
      data: { userId, productId, ...data },
      include: { user: { select: { id: true, name: true } } },
    });
  },

  async updateReview(userId: string, reviewId: string, data: { rating?: number; title?: string; comment?: string }) {
    const review = await prisma.review.findUnique({ where: { id: reviewId } });
    if (!review) throw new AppError(404, 'Review not found');
    if (review.userId !== userId) throw new AppError(403, 'Not authorized');

    return prisma.review.update({
      where: { id: reviewId },
      data,
      include: { user: { select: { id: true, name: true } } },
    });
  },

  async deleteReview(userId: string, reviewId: string) {
    const review = await prisma.review.findUnique({ where: { id: reviewId } });
    if (!review) throw new AppError(404, 'Review not found');
    if (review.userId !== userId) throw new AppError(403, 'Not authorized');

    return prisma.review.delete({ where: { id: reviewId } });
  },

  async approveReview(reviewId: string) {
    return prisma.review.update({
      where: { id: reviewId },
      data: { approved: true },
    });
  },

  async rejectReview(reviewId: string) {
    return prisma.review.update({
      where: { id: reviewId },
      data: { approved: false },
    });
  },

  async getReviewStats(productId: string) {
    const reviews = await prisma.review.findMany({
      where: { productId, approved: true },
      select: { rating: true },
    });

    if (reviews.length === 0) return { averageRating: 0, reviewCount: 0 };

    const sum = reviews.reduce((acc, r) => acc + r.rating, 0);
    const average = sum / reviews.length;

    await prisma.product.update({
      where: { id: productId },
      data: { rating: Math.round(average * 100) / 100, reviewCount: reviews.length },
    });

    return { averageRating: Math.round(average * 100) / 100, reviewCount: reviews.length };
  },
};

export const couponService = {
  async getAll(page = 1, limit = 20) {
    const [coupons, total] = await Promise.all([
      prisma.coupon.findMany({
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.coupon.count(),
    ]);

    return { data: coupons, pagination: { page, limit, total, totalPages: Math.ceil(total / limit) } };
  },

  async getByCode(code: string) {
    const coupon = await prisma.coupon.findUnique({ where: { code: code.toUpperCase() } });
    if (!coupon) throw new AppError(404, 'Coupon not found');
    return coupon;
  },

  async validateCoupon(code: string, subtotal: number) {
    const coupon = await this.getByCode(code);
    if (!coupon.active) throw new AppError(400, 'Coupon is not active');
    if (coupon.expiry && new Date(coupon.expiry) < new Date()) throw new AppError(400, 'Coupon has expired');
    if (coupon.usageLimit && coupon.usageCount >= coupon.usageLimit) throw new AppError(400, 'Coupon usage limit reached');
    if (coupon.minimumOrder && subtotal < Number(coupon.minimumOrder)) {
      throw new AppError(400, `Minimum order of $${Number(coupon.minimumOrder)} required`);
    }
    return coupon;
  },

  async create(data: any) {
    const existing = await prisma.coupon.findUnique({ where: { code: data.code.toUpperCase() } });
    if (existing) throw new AppError(409, 'Coupon code already exists');
    return prisma.coupon.create({ data: { ...data, code: data.code.toUpperCase() } });
  },

  async update(id: string, data: any) {
    const coupon = await prisma.coupon.findUnique({ where: { id } });
    if (!coupon) throw new AppError(404, 'Coupon not found');

    if (data.code && data.code.toUpperCase() !== coupon.code) {
      const existing = await prisma.coupon.findUnique({ where: { code: data.code.toUpperCase() } });
      if (existing) throw new AppError(409, 'Coupon code already exists');
      data.code = data.code.toUpperCase();
    }

    return prisma.coupon.update({ where: { id }, data });
  },

  async delete(id: string) {
    const coupon = await prisma.coupon.findUnique({ where: { id } });
    if (!coupon) throw new AppError(404, 'Coupon not found');
    return prisma.coupon.delete({ where: { id } });
  },
};

export const addressService = {
  async getAddresses(userId: string) {
    return prisma.address.findMany({ where: { userId }, orderBy: { isDefault: 'desc' } });
  },

  async getAddressById(userId: string, id: string) {
    const address = await prisma.address.findUnique({ where: { id } });
    if (!address || address.userId !== userId) throw new AppError(404, 'Address not found');
    return address;
  },

  async createAddress(userId: string, data: any) {
    if (data.isDefault) {
      await prisma.address.updateMany({ where: { userId }, data: { isDefault: false } });
    } else {
      const count = await prisma.address.count({ where: { userId } });
      if (count === 0) data.isDefault = true;
    }

    return prisma.address.create({ data: { ...data, userId } });
  },

  async updateAddress(userId: string, id: string, data: any) {
    const address = await prisma.address.findUnique({ where: { id } });
    if (!address || address.userId !== userId) throw new AppError(404, 'Address not found');

    if (data.isDefault) {
      await prisma.address.updateMany({ where: { userId }, data: { isDefault: false } });
    }

    return prisma.address.update({ where: { id }, data });
  },

  async deleteAddress(userId: string, id: string) {
    const address = await prisma.address.findUnique({ where: { id } });
    if (!address || address.userId !== userId) throw new AppError(404, 'Address not found');

    await prisma.address.delete({ where: { id } });

    const remaining = await prisma.address.findFirst({ where: { userId }, orderBy: { createdAt: 'asc' } });
    if (remaining) {
      await prisma.address.update({ where: { id: remaining.id }, data: { isDefault: true } });
    }

    return { success: true };
  },
};
