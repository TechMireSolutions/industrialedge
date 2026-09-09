import { z } from 'zod';

export const registerSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').max(100),
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  phone: z.string().optional(),
});

export const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
});

export const updateProfileSchema = z.object({
  name: z.string().min(2).max(100).optional(),
  phone: z.string().optional(),
  currentPassword: z.string().optional(),
  newPassword: z.string().min(8).optional(),
}).refine(
  data => !data.currentPassword || (data.currentPassword && data.newPassword),
  { message: 'New password required when changing password', path: ['newPassword'] }
);

export const addressSchema = z.object({
  type: z.enum(['shipping', 'billing']).default('shipping'),
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  company: z.string().optional(),
  address: z.string().min(1, 'Address is required'),
  city: z.string().min(1, 'City is required'),
  country: z.string().min(1, 'Country is required'),
  postalCode: z.string().optional(),
  phone: z.string().min(1, 'Phone is required'),
  isDefault: z.boolean().optional(),
});

export const productSchema = z.object({
  name: z.string().min(1, 'Name is required').max(200),
  slug: z.string().max(200).regex(/^[a-z0-9-]+$/, 'Slug must be lowercase alphanumeric with hyphens').optional(),
  description: z.string().min(1, 'Description is required'),
  shortDescription: z.string().max(500).optional(),
  categoryId: z.string().min(1, 'Category is required'),
  price: z.number().positive('Price must be positive'),
  oldPrice: z.number().positive().optional(),
  shippingPrice: z.number().min(0, 'Shipping price cannot be negative').optional(),
  sku: z.string().max(50).optional(),
  stock: z.number().int().min(0, 'Stock cannot be negative'),
  badge: z.string().max(20).optional(),
  images: z.array(z.string().url('Invalid image URL')).min(1, 'At least one image required'),
  isFeatured: z.boolean().optional(),
  isNew: z.boolean().optional(),
  isTopSelling: z.boolean().optional(),
  isBestseller: z.boolean().optional(),
  active: z.boolean().optional(),
  tags: z.array(z.string()).optional(),
});

export const categorySchema = z.object({
  name: z.string().min(1, 'Name is required').max(100),
  slug: z.string().min(1, 'Slug is required').max(100).regex(/^[a-z0-9-]+$/, 'Slug must be lowercase alphanumeric with hyphens'),
  description: z.string().optional(),
  image: z.string().url().optional(),
  active: z.boolean().optional(),
});

export const tagSchema = z.object({
  name: z.string().min(1, 'Name is required').max(100),
  slug: z.string().min(1, 'Slug is required').max(100).regex(/^[a-z0-9-]+$/, 'Slug must be lowercase alphanumeric with hyphens'),
});

export const cartItemSchema = z.object({
  productId: z.string().min(1, 'Product ID is required'),
  quantity: z.number().int().positive('Quantity must be positive'),
});

export const updateCartItemSchema = z.object({
  quantity: z.number().int().positive('Quantity must be positive'),
});

export const checkoutSchema = z.object({
  billingAddress: z.object({
    firstName: z.string().min(1),
    lastName: z.string().min(1),
    company: z.string().optional(),
    address: z.string().min(1),
    city: z.string().min(1),
    country: z.string().min(1),
    postalCode: z.string().optional(),
    phone: z.string().min(1),
    email: z.string().email(),
  }),
  shippingAddress: z.object({
    firstName: z.string().min(1),
    lastName: z.string().min(1),
    company: z.string().optional(),
    address: z.string().min(1),
    city: z.string().min(1),
    country: z.string().min(1),
    postalCode: z.string().optional(),
    phone: z.string().min(1),
  }).optional(),
  paymentMethod: z.enum(['CASH_ON_DELIVERY']),
  notes: z.string().optional(),
  couponCode: z.string().optional(),
});

export const reviewSchema = z.object({
  rating: z.number().int().min(1).max(5),
  title: z.string().min(1, 'Title is required').max(100),
  comment: z.string().min(1, 'Comment is required').max(2000),
});

export const heroSlideSchema = z.object({
  imageId: z.string().optional().nullable(),
  image: z.string().optional().nullable(),
  backgroundImageId: z.string().optional().nullable(),
  backgroundImage: z.string().optional().nullable(),
  imageAlt: z.string().optional().nullable(),
  titleLine1: z.string().max(100).optional().nullable(),
  titleLine2: z.string().max(100).optional().nullable(),
  titleLine3: z.string().max(100).optional().nullable(),
  eyebrowText: z.string().max(100).optional().nullable(),
  showEyebrow: z.boolean().optional(),
  description: z.string().max(500).optional().nullable(),
  primaryButtonText: z.string().max(50).optional().nullable(),
  primaryButtonUrl: z.string().optional().nullable(),
  showPrimaryCTA: z.boolean().optional(),
  secondaryButtonText: z.string().max(50).optional().nullable(),
  secondaryButtonUrl: z.string().optional().nullable(),
  showSecondaryCTA: z.boolean().optional(),
  active: z.boolean().optional(),
  ordering: z.number().int().optional(),
});

export const bannerSchema = z.object({
  title: z.string().min(1, 'Title is required').max(100),
  description: z.string().max(500).optional(),
  image: z.string().url('Invalid image URL'),
  discount: z.number().int().min(0).max(100).optional(),
  ctaText: z.string().max(50).optional(),
  ctaUrl: z.string().url().optional(),
  active: z.boolean().optional(),
  ordering: z.number().int().optional(),
});

export const offerSchema = z.object({
  title: z.string().min(1, 'Title is required').max(100),
  description: z.string().max(500).optional(),
  image: z.string().min(1, 'Image is required'),
  discount: z.number().int().min(1).max(100),
  ctaText: z.string().max(50).optional(),
  ctaUrl: z.string().url().optional().or(z.string().startsWith('/')),
  active: z.boolean().optional(),
  ordering: z.number().int().optional(),
});

export const serviceSchema = z.object({
  title: z.string().min(1, 'Title is required').max(100),
  description: z.string().min(1, 'Description is required').max(500),
  icon: z.string().min(1, 'Icon is required').max(50),
  active: z.boolean().optional(),
  ordering: z.number().int().optional(),
});

export const footerContentSchema = z.object({
  section: z.string().min(1, 'Section is required').max(50),
  title: z.string().min(1, 'Title is required').max(100),
  content: z.record(z.any()),
  active: z.boolean().optional(),
  ordering: z.number().int().optional(),
});

export const siteSettingsSchema = z.object({
  siteName: z.string().min(1).max(100).optional(),
  contactEmail: z.string().email().optional(),
  contactPhone: z.string().optional(),
  contactAddress: z.string().optional(),
  website: z.string().url().optional(),
  socialLinks: z.record(z.string()).optional(),
  logo: z.string().url().optional(),
  favicon: z.string().url().optional(),
  themeSettings: z.record(z.any()).optional(),
});

export const contactSchema = z.object({
  name: z.string().min(1, 'Name is required').max(100),
  email: z.string().email('Invalid email address'),
  phone: z.string().optional(),
  project: z.string().optional(),
  subject: z.string().min(1, 'Subject is required').max(200),
  message: z.string().min(1, 'Message is required').max(5000),
});

export const pageContentSchema = z.object({
  slug: z.string().min(1, 'Slug is required').max(100).regex(/^[a-z0-9-]+$/, 'Slug must be lowercase alphanumeric with hyphens'),
  title: z.string().min(1, 'Title is required').max(200),
  content: z.string().min(1, 'Content is required'),
  active: z.boolean().optional(),
});

export const couponSchema = z.object({
  code: z.string().min(1, 'Code is required').max(20).toUpperCase(),
  type: z.enum(['PERCENTAGE', 'FIXED_AMOUNT']),
  value: z.number().positive('Value must be positive'),
  minimumOrder: z.number().positive().optional(),
  maximumDiscount: z.number().positive().optional(),
  expiry: z.string().datetime().optional(),
  active: z.boolean().optional(),
  usageLimit: z.number().int().positive().optional(),
});

export const orderStatusSchema = z.object({
  status: z.enum(['PENDING', 'CONFIRMED', 'PROCESSING', 'SHIPPED', 'DELIVERED', 'CANCELLED', 'REFUNDED']),
});

export const querySchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(100).default(20),
  sort: z.string().optional(),
  order: z.enum(['asc', 'desc']).default('desc'),
  search: z.string().optional(),
  category: z.string().optional(),
  minPrice: z.coerce.number().positive().optional(),
  maxPrice: z.coerce.number().positive().optional(),
  featured: z.coerce.boolean().optional(),
  new: z.coerce.boolean().optional(),
  topSelling: z.coerce.boolean().optional(),
  bestseller: z.coerce.boolean().optional(),
});

export const generalSettingsSchema = z.object({
  siteName: z.string().min(1).max(100).nullable().optional(),
  tagline: z.string().nullable().optional(),
  siteDescription: z.string().nullable().optional(),
  websiteUrl: z.string().url().nullable().optional(),
});

export const brandingSettingsSchema = z.object({
  mainLogoId: z.string().optional().nullable(),
  darkLogoId: z.string().optional().nullable(),
  navbarLogoId: z.string().optional().nullable(),
  footerLogoId: z.string().optional().nullable(),
  loginLogoId: z.string().optional().nullable(),
  faviconId: z.string().optional().nullable(),
});

export const themeSettingsSchema = z.object({
  primaryColor: z.string().regex(/^#[0-9A-Fa-f]{6}$/).nullable().optional(),
  secondaryColor: z.string().regex(/^#[0-9A-Fa-f]{6}$/).nullable().optional(),
  accentColor: z.string().regex(/^#[0-9A-Fa-f]{6}$/).nullable().optional(),
  successColor: z.string().regex(/^#[0-9A-Fa-f]{6}$/).nullable().optional(),
  dangerColor: z.string().regex(/^#[0-9A-Fa-f]{6}$/).nullable().optional(),
  warningColor: z.string().regex(/^#[0-9A-Fa-f]{6}$/).nullable().optional(),
  infoColor: z.string().regex(/^#[0-9A-Fa-f]{6}$/).nullable().optional(),
  backgroundColor: z.string().regex(/^#[0-9A-Fa-f]{6}$/).nullable().optional(),
  cardColor: z.string().regex(/^#[0-9A-Fa-f]{6}$/).nullable().optional(),
  textColor: z.string().regex(/^#[0-9A-Fa-f]{6}$/).nullable().optional(),
  borderRadius: z.string().nullable().optional(),
  shadowStyle: z.string().nullable().optional(),
  fontFamily: z.string().nullable().optional(),
  headingFont: z.string().nullable().optional(),
});

export const seoSettingsSchema = z.object({
  metaTitle: z.string().nullable().optional(),
  metaDescription: z.string().nullable().optional(),
  keywords: z.string().nullable().optional(),
  canonicalUrl: z.string().url().nullable().optional(),
  robotsTxt: z.string().nullable().optional(),
  ogTitle: z.string().nullable().optional(),
  ogDescription: z.string().nullable().optional(),
  ogImageId: z.string().nullable().optional(),
  twitterCard: z.string().nullable().optional(),
  schemaOrg: z.string().nullable().optional(),
  googleAnalytics: z.string().nullable().optional(),
  googleTagManager: z.string().nullable().optional(),
  metaPixel: z.string().nullable().optional(),
  bingWebmaster: z.string().nullable().optional(),
  googleSearchConsole: z.string().nullable().optional(),
});

export const contactSettingsSchema = z.object({
  emails: z.string().nullable().optional(),
  phones: z.string().nullable().optional(),
  addresses: z.string().nullable().optional(),
  workingHours: z.string().nullable().optional(),
  socialLinks: z.string().nullable().optional(),
});

export const systemSettingsSchema = z.object({
  maintenanceMode: z.boolean().optional(),
  allowRegistration: z.boolean().optional(),
  requireEmailVerification: z.boolean().optional(),
  enableAuditLogging: z.boolean().optional(),
  defaultLanguage: z.string().optional(),
  defaultCurrency: z.string().optional(),
  timeZone: z.string().optional(),
  uploadSizeLimit: z.number().int().positive().optional(),
  sessionTimeout: z.number().int().positive().optional(),
});

export const featureFlagsSchema = z.object({
  enableWishlist: z.boolean().optional(),
  enableCompare: z.boolean().optional(),
  enableReviews: z.boolean().optional(),
  enableCoupons: z.boolean().optional(),
  enableNewsletter: z.boolean().optional(),
  enablePartners: z.boolean().optional(),
  enableBlog: z.boolean().optional(),
  enableTestimonials: z.boolean().optional(),
  enableSmokeEffect: z.boolean().optional(),
  enableAnimations: z.boolean().optional(),
});

export const updateSettingsSchema = z.object({
  general: generalSettingsSchema.optional(),
  branding: brandingSettingsSchema.optional(),
  theme: themeSettingsSchema.optional(),
  seo: seoSettingsSchema.optional(),
  contact: contactSettingsSchema.optional(),
  system: systemSettingsSchema.optional(),
  featureFlags: featureFlagsSchema.optional(),
});

export const menuItemSchema = z.object({
  label: z.string().min(1, 'Label is required'),
  type: z.enum(['link', 'dropdown', 'mega_menu', 'button', 'system_action']).default('link'),
  destinationType: z.enum(['page', 'category', 'collection', 'product', 'internal', 'external']).nullable().optional(),
  systemAction: z.enum(['search', 'wishlist', 'account', 'cart']).nullable().optional(),
  source: z.enum(['manual', 'dynamic_categories', 'dynamic_collections']).nullable().optional(),
  url: z.string().nullable().optional(),
  target: z.string().default('_self'),
  categoryId: z.string().nullable().optional(),
  collectionId: z.string().nullable().optional(),
  productId: z.string().nullable().optional(),
  pageId: z.string().nullable().optional(),
  icon: z.string().nullable().optional(),
  iconPosition: z.string().nullable().optional(),
  badgeText: z.string().nullable().optional(),
  badgeVariant: z.string().nullable().optional(),
  variant: z.string().nullable().optional(),
  order: z.number().int().default(0),
  visible: z.boolean().default(true),
  desktopVisible: z.boolean().default(true),
  mobileVisible: z.boolean().default(true),
  parentId: z.string().nullable().optional(),
}).refine(data => {
  if (data.type === 'system_action' && !data.systemAction) return false;
  return true;
}, { message: 'System action type requires a systemAction selected', path: ['systemAction'] })
.refine(data => {
  if (data.type === 'link' || data.type === 'button') {
    if (data.destinationType === 'category' && !data.categoryId) return false;
    if (data.destinationType === 'collection' && !data.collectionId) return false;
    if (data.destinationType === 'product' && !data.productId) return false;
    if (data.destinationType === 'page' && !data.pageId) return false;
    if (data.destinationType === 'internal' && (!data.url || !data.url.startsWith('/'))) return false;
    if (data.destinationType === 'external' && (!data.url || (!data.url.startsWith('http://') && !data.url.startsWith('https://')))) return false;
  }
  return true;
}, { message: 'Selected destination type requires a valid associated resource ID or URL. Internal links must start with /. External links must start with http:// or https://.', path: ['destinationType'] });
