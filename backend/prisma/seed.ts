/// <reference types="node" />
import { PrismaClient, Prisma } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

function stringifyImages(images: string[]) {
  return JSON.stringify(images);
}

async function main() {
  console.log('Seeding database...');

  const adminPassword = await bcrypt.hash('admin123', 12);
  const customerPassword = await bcrypt.hash('customer123', 12);

  const admin = await prisma.user.upsert({
    where: { email: 'admin@industrialedge.com' },
    update: {},
    create: {
      email: 'admin@industrialedge.com',
      name: 'Admin User',
      passwordHash: adminPassword,
      role: 'ADMIN',
    },
  });

  const customer = await prisma.user.upsert({
    where: { email: 'customer@example.com' },
    update: {},
    create: {
      email: 'customer@example.com',
      name: 'Demo Customer',
      passwordHash: customerPassword,
      role: 'CUSTOMER',
    },
  });

  console.log('Created users:', { admin: admin.email, customer: customer.email });

  const categories = await Promise.all([
    prisma.category.upsert({
      where: { slug: 'smartphones' },
      update: {},
      create: { name: 'Smartphones', slug: 'smartphones', description: 'Latest smartphones and mobile devices', active: true },
    }),
    prisma.category.upsert({
      where: { slug: 'laptops' },
      update: {},
      create: { name: 'Laptops', slug: 'laptops', description: 'High-performance laptops for work and gaming', active: true },
    }),
    prisma.category.upsert({
      where: { slug: 'tablets' },
      update: {},
      create: { name: 'Tablets', slug: 'tablets', description: 'Tablets for productivity and entertainment', active: true },
    }),
    prisma.category.upsert({
      where: { slug: 'accessories' },
      update: {},
      create: { name: 'Accessories', slug: 'accessories', description: 'Phone cases, chargers, headphones and more', active: true },
    }),
    prisma.category.upsert({
      where: { slug: 'smart-watches' },
      update: {},
      create: { name: 'Smart Watches', slug: 'smart-watches', description: 'Smartwatches and fitness trackers', active: true },
    }),
    prisma.category.upsert({
      where: { slug: 'cameras' },
      update: {},
      create: { name: 'Cameras', slug: 'cameras', description: 'Digital cameras and accessories', active: true },
    }),
  ]);

  console.log('Created categories:', categories.map(c => c.name).join(', '));

  const smartphoneCategory = categories.find(c => c.slug === 'smartphones')!;
  const laptopCategory = categories.find(c => c.slug === 'laptops')!;
  const tabletCategory = categories.find(c => c.slug === 'tablets')!;
  const accessoriesCategory = categories.find(c => c.slug === 'accessories')!;
  const smartWatchCategory = categories.find(c => c.slug === 'smart-watches')!;
  const cameraCategory = categories.find(c => c.slug === 'cameras')!;

  const products = await Promise.all([
    prisma.product.upsert({
      where: { slug: 'apple-ipad-mini-g2356' },
      update: {},
      create: {
        name: 'Apple iPad Mini G2356',
        slug: 'apple-ipad-mini-g2356',
        description: 'The Apple iPad Mini G2356 is a compact and powerful tablet featuring a stunning Liquid Retina display, A15 Bionic chip, and all-day battery life. Perfect for on-the-go productivity and entertainment.',
        shortDescription: 'Compact and powerful tablet with Liquid Retina display',
        categoryId: tabletCategory.id,
        price: new Prisma.Decimal('1050.00'),
        oldPrice: new Prisma.Decimal('1250.00'),
        sku: 'APL-IPAD-MINI-G2356',
        stock: 50,
        badge: 'new',
        images: stringifyImages([]),
        rating: new Prisma.Decimal('4.8'),
        reviewCount: 124,
        isFeatured: true,
        isNew: true,
        isTopSelling: true,
        isBestseller: true,
        active: true,
      },
    }),
    prisma.product.upsert({
      where: { slug: 'samsung-galaxy-s24-ultra' },
      update: {},
      create: {
        name: 'Samsung Galaxy S24 Ultra',
        slug: 'samsung-galaxy-s24-ultra',
        description: 'The Samsung Galaxy S24 Ultra features a 6.8-inch Dynamic AMOLED 2X display, Snapdragon 8 Gen 3 processor, 200MP camera system, and built-in S Pen. The ultimate Android flagship.',
        shortDescription: 'Flagship smartphone with 200MP camera and S Pen',
        categoryId: smartphoneCategory.id,
        price: new Prisma.Decimal('1299.99'),
        oldPrice: new Prisma.Decimal('1399.99'),
        sku: 'SAM-GAL-S24-ULTRA',
        stock: 30,
        badge: 'sale',
        images: stringifyImages([]),
        rating: new Prisma.Decimal('4.9'),
        reviewCount: 89,
        isFeatured: true,
        isNew: true,
        isTopSelling: true,
        active: true,
      },
    }),
    prisma.product.upsert({
      where: { slug: 'macbook-pro-m3-14' },
      update: {},
      create: {
        name: 'MacBook Pro 14" M3',
        slug: 'macbook-pro-m3-14',
        description: 'The MacBook Pro 14-inch with M3 chip delivers exceptional performance with up to 22 hours of battery life. Features a Liquid Retina XDR display, advanced camera and audio, and all the ports you need.',
        shortDescription: 'Professional laptop with M3 chip and 22hr battery',
        categoryId: laptopCategory.id,
        price: new Prisma.Decimal('1999.00'),
        oldPrice: new Prisma.Decimal('2199.00'),
        sku: 'APL-MBP-M3-14',
        stock: 20,
        badge: 'new',
        images: stringifyImages([]),
        rating: new Prisma.Decimal('4.9'),
        reviewCount: 67,
        isFeatured: true,
        isTopSelling: true,
        isBestseller: true,
        active: true,
      },
    }),
    prisma.product.upsert({
      where: { slug: 'sony-wh-1000xm5' },
      update: {},
      create: {
        name: 'Sony WH-1000XM5 Headphones',
        slug: 'sony-wh-1000xm5',
        description: 'Industry-leading noise canceling with Auto NC Optimizer, crystal clear hands-free calling, and 30-hour battery life. Multipoint connection for seamless device switching.',
        shortDescription: 'Premium noise-canceling headphones with 30hr battery',
        categoryId: accessoriesCategory.id,
        price: new Prisma.Decimal('399.99'),
        oldPrice: new Prisma.Decimal('449.99'),
        sku: 'SNY-WH1000XM5',
        stock: 75,
        badge: 'sale',
        images: stringifyImages([]),
        rating: new Prisma.Decimal('4.8'),
        reviewCount: 234,
        isFeatured: true,
        isTopSelling: true,
        active: true,
      },
    }),
    prisma.product.upsert({
      where: { slug: 'apple-watch-series-9' },
      update: {},
      create: {
        name: 'Apple Watch Series 9',
        slug: 'apple-watch-series-9',
        description: 'The Apple Watch Series 9 features the S9 chip for superbright display, double tap gesture, and precision finding for iPhone. Advanced health sensors including blood oxygen and ECG.',
        shortDescription: 'Smartwatch with S9 chip and double tap gesture',
        categoryId: smartWatchCategory.id,
        price: new Prisma.Decimal('399.00'),
        oldPrice: new Prisma.Decimal('429.00'),
        sku: 'APL-AW-S9-45',
        stock: 45,
        badge: 'new',
        images: stringifyImages([]),
        rating: new Prisma.Decimal('4.7'),
        reviewCount: 156,
        isFeatured: true,
        isNew: true,
        isBestseller: true,
        active: true,
      },
    }),
    prisma.product.upsert({
      where: { slug: 'canon-eos-r50' },
      update: {},
      create: {
        name: 'Canon EOS R50',
        slug: 'canon-eos-r50',
        description: 'Compact and lightweight mirrorless camera with 24.2MP APS-C sensor, 4K video, and advanced autofocus. Perfect for content creators and photography enthusiasts.',
        shortDescription: 'Compact mirrorless camera with 24.2MP sensor',
        categoryId: cameraCategory.id,
        price: new Prisma.Decimal('799.99'),
        oldPrice: new Prisma.Decimal('899.99'),
        sku: 'CAN-EOS-R50',
        stock: 25,
        badge: 'sale',
        images: stringifyImages([]),
        rating: new Prisma.Decimal('4.6'),
        reviewCount: 43,
        isNew: true,
        active: true,
      },
    }),
    prisma.product.upsert({
      where: { slug: 'dell-xps-15' },
      update: {},
      create: {
        name: 'Dell XPS 15',
        slug: 'dell-xps-15',
        description: 'The Dell XPS 15 features a stunning 15.6-inch 3.5K OLED display, Intel Core i7 processor, NVIDIA RTX 4060 graphics, and premium CNC aluminum construction.',
        shortDescription: 'Premium laptop with 3.5K OLED and RTX 4060',
        categoryId: laptopCategory.id,
        price: new Prisma.Decimal('1899.00'),
        oldPrice: new Prisma.Decimal('2099.00'),
        sku: 'DEL-XPS-15-OLED',
        stock: 15,
        badge: 'sale',
        images: stringifyImages([]),
        rating: new Prisma.Decimal('4.7'),
        reviewCount: 78,
        isTopSelling: true,
        active: true,
      },
    }),
    prisma.product.upsert({
      where: { slug: 'google-pixel-8-pro' },
      update: {},
      create: {
        name: 'Google Pixel 8 Pro',
        slug: 'google-pixel-8-pro',
        description: 'The Google Pixel 8 Pro features the Tensor G3 chip, 6.7-inch Super Actua display, pro camera system with 50MP main sensor, and 7 years of OS updates.',
        shortDescription: 'Google flagship with Tensor G3 and 7yr updates',
        categoryId: smartphoneCategory.id,
        price: new Prisma.Decimal('999.00'),
        oldPrice: new Prisma.Decimal('1099.00'),
        sku: 'GOO-PIXEL-8-PRO',
        stock: 35,
        badge: 'new',
        images: stringifyImages([]),
        rating: new Prisma.Decimal('4.6'),
        reviewCount: 92,
        isFeatured: true,
        isNew: true,
        active: true,
      },
    }),
    prisma.product.upsert({
      where: { slug: 'ipad-air-m2' },
      update: {},
      create: {
        name: 'iPad Air M2',
        slug: 'ipad-air-m2',
        description: 'The iPad Air with M2 chip features an 11-inch Liquid Retina display, 12MP Center Stage camera, Wi-Fi 6E, and all-day battery life. Perfect for creativity and productivity.',
        shortDescription: 'Versatile tablet with M2 chip and Center Stage',
        categoryId: tabletCategory.id,
        price: new Prisma.Decimal('749.00'),
        oldPrice: new Prisma.Decimal('849.00'),
        sku: 'APL-IPAD-AIR-M2',
        stock: 40,
        badge: 'sale',
        images: stringifyImages([]),
        rating: new Prisma.Decimal('4.8'),
        reviewCount: 167,
        isTopSelling: true,
        isBestseller: true,
        active: true,
      },
    }),
    prisma.product.upsert({
      where: { slug: 'airpods-pro-2' },
      update: {},
      create: {
        name: 'AirPods Pro 2nd Generation',
        slug: 'airpods-pro-2',
        description: 'AirPods Pro 2 feature H2 chip for 2x more noise cancellation, Adaptive Transparency, Personalized Spatial Audio, and up to 6 hours of listening time.',
        shortDescription: 'Premium earbuds with H2 chip and Spatial Audio',
        categoryId: accessoriesCategory.id,
        price: new Prisma.Decimal('249.00'),
        oldPrice: new Prisma.Decimal('279.00'),
        sku: 'APL-AIRPODS-PRO-2',
        stock: 100,
        badge: 'sale',
        images: stringifyImages([]),
        rating: new Prisma.Decimal('4.9'),
        reviewCount: 312,
        isFeatured: true,
        isTopSelling: true,
        isBestseller: true,
        active: true,
      },
    }),
  ]);

  console.log('Created products:', products.map(p => p.name).join(', '));

  console.log('Skipping Hero Slides seed - must be managed via CMS');

  await Promise.all([
    prisma.banner.upsert({
      where: { id: 'banner-1' },
      update: {},
      create: {
        id: 'banner-1',
        title: 'Next-Gen Tech, Today',
        description: 'Explore our latest collection of premium laptops and ultrabooks',
        image: null,
        ctaText: 'Shop Laptops',
        ctaUrl: '/shop?category=laptops',
        active: true,
        ordering: 0,
      },
    }),
    prisma.banner.upsert({
      where: { id: 'banner-2' },
      update: {},
      create: {
        id: 'banner-2',
        title: 'Mid-Season Sale — Up to 30% Off',
        description: 'Huge discounts on smartphones, accessories and wearables',
        image: null,
        discount: 30,
        ctaText: 'View Deals',
        ctaUrl: '/shop',
        active: true,
        ordering: 1,
      },
    }),
  ]);

  console.log('Created banners');

  await Promise.all([
    prisma.offer.upsert({
      where: { id: 'offer-1' },
      update: {},
      create: {
        id: 'offer-1',
        title: 'Flagship Smartphones',
        description: 'Discover the power of next-gen mobile computing. The latest Android & iOS devices at unbeatable prices.',
        image: null,
        discount: 15,
        ctaText: 'Shop Phones',
        ctaUrl: '/shop?category=smartphones',
        active: true,
        ordering: 0,
      },
    }),
    prisma.offer.upsert({
      where: { id: 'offer-2' },
      update: {},
      create: {
        id: 'offer-2',
        title: 'Premium Audio Gear',
        description: 'Immerse yourself in high-fidelity sound. Top brands, industry-leading noise cancellation.',
        image: null,
        discount: 25,
        ctaText: 'Shop Audio',
        ctaUrl: '/shop?category=accessories',
        active: true,
        ordering: 1,
      },
    }),
    prisma.offer.upsert({
      where: { id: 'offer-3' },
      update: {},
      create: {
        id: 'offer-3',
        title: 'Professional Laptops',
        description: 'Unleash your productivity with our curated lineup of ultrabooks and powerhouse workstations.',
        image: null,
        discount: 10,
        ctaText: 'Shop Laptops',
        ctaUrl: '/shop?category=laptops',
        active: true,
        ordering: 2,
      },
    }),
    prisma.offer.upsert({
      where: { id: 'offer-4' },
      update: {},
      create: {
        id: 'offer-4',
        title: 'Smart Wearables',
        description: 'Track your health, stay connected, and look great. Smartwatches and fitness bands for every lifestyle.',
        image: null,
        discount: 20,
        ctaText: 'Shop Wearables',
        ctaUrl: '/shop?category=smart-watches',
        active: true,
        ordering: 3,
      },
    }),
  ]);

  console.log('Created 4 offers');

  await Promise.all([
    prisma.service.upsert({
      where: { id: 'service-1' },
      update: {},
      create: { id: 'service-1', title: 'Free Global Shipping', description: 'On all orders over $99, delivered to your door', icon: 'fa fa-truck', active: true, ordering: 0 },
    }),
    prisma.service.upsert({
      where: { id: 'service-2' },
      update: {},
      create: { id: 'service-2', title: '30-Day Free Returns', description: 'No questions asked — hassle-free return process', icon: 'fa fa-undo', active: true, ordering: 1 },
    }),
    prisma.service.upsert({
      where: { id: 'service-3' },
      update: {},
      create: { id: 'service-3', title: '24/7 Expert Support', description: 'Our technical team is available around the clock', icon: 'fa fa-headset', active: true, ordering: 2 },
    }),
    prisma.service.upsert({
      where: { id: 'service-4' },
      update: {},
      create: { id: 'service-4', title: 'Secure Checkout', description: '256-bit SSL encrypted, PCI-compliant payments', icon: 'fa fa-lock', active: true, ordering: 3 },
    }),
  ]);

  console.log('Created services');

  await prisma.footerContent.upsert({
    where: { section: 'contact' },
    update: {},
    create: {
      section: 'contact',
      title: 'Contact Information',
      content: JSON.stringify({
        address: '123 Street New York, USA',
        email: 'info@industrialedge.com',
        phone: '(+012) 3456 7890',
        website: 'industrialedge.com',
      }),
      active: true,
      ordering: 0,
    },
  });

  await prisma.footerContent.upsert({
    where: { section: 'customer-service' },
    update: {},
    create: {
      section: 'customer-service',
      title: 'Customer Service',
      content: JSON.stringify({
        links: [
          { label: 'Contact Us', url: '/contact' },
          { label: 'Returns', url: '/page/returns' },
          { label: 'Order History', url: '/page/order-history' },
          { label: 'Site Map', url: '/page/site-map' },
          { label: 'Testimonials', url: '/page/testimonials' },
          { label: 'My Account', url: '/page/my-account' },
        ],
      }),
      active: true,
      ordering: 1,
    },
  });

  await prisma.footerContent.upsert({
    where: { section: 'information' },
    update: {},
    create: {
      section: 'information',
      title: 'Information',
      content: JSON.stringify({
        links: [
          { label: 'About Us', url: '/page/about' },
          { label: 'Delivery Information', url: '/page/delivery-info' },
          { label: 'Privacy Policy', url: '/page/privacy-policy' },
          { label: 'Terms & Conditions', url: '/page/terms' },
          { label: 'Warranty', url: '/page/warranty' },
          { label: 'FAQ', url: '/page/faq' },
          { label: 'Seller Login', url: '/page/seller-login' },
        ],
      }),
      active: true,
      ordering: 2,
    },
  });

  await prisma.footerContent.upsert({
    where: { section: 'extras' },
    update: {},
    create: {
      section: 'extras',
      title: 'Extras',
      content: JSON.stringify({
        links: [
          { label: 'Brands', url: '/page/brands' },
          { label: 'Gift Vouchers', url: '/page/gift-vouchers' },
          { label: 'Affiliates', url: '/page/affiliates' },
          { label: 'Wishlist', url: '/wishlist' },
          { label: 'Track Your Order', url: '/page/track-order' },
        ],
      }),
      active: true,
      ordering: 3,
    },
  });

  console.log('Created footer content');

  // ─────────────────────────────────────────────────────────────
  // Settings
  // ─────────────────────────────────────────────────────────────

  await prisma.generalSettings.upsert({
    where: { id: 'default' },
    update: {},
    create: {
      id: 'default',
      siteName: 'Industrial Edge',
      tagline: 'Industrial Edge — Quality Products, Better Solutions',
      siteDescription:
        'Industrial Edge provides quality electronics, technology products and accessories.',
      websiteUrl: 'https://industrialedge.com',
    },
  });

  await prisma.brandingSettings.upsert({
    where: { id: 'default' },
    update: {},
    create: {
      id: 'default',
    },
  });

  await prisma.themeSettings.upsert({
    where: { id: 'default' },
    update: {},
    create: {
      id: 'default',
      primaryColor: '#237B39',
      secondaryColor: '#181246',
      accentColor: '#4736bf',
      successColor: '#198754',
      dangerColor: '#dc3545',
      warningColor: '#ffc107',
      infoColor: '#0dcaf0',
      backgroundColor: '#ffffff',
      cardColor: '#ffffff',
      textColor: '#212529',
      borderRadius: '0.375rem',
      shadowStyle: '0 0.5rem 1rem rgba(0, 0, 0, 0.15)',
      fontFamily: 'Inter, sans-serif',
      headingFont: 'Outfit, sans-serif',
    },
  });

  await prisma.seoSettings.upsert({
    where: { id: 'default' },
    update: {},
    create: {
      id: 'default',
      metaTitle: 'Industrial Edge',
      metaDescription:
        'Industrial Edge — quality electronics, technology products and accessories.',
      keywords:
        'Industrial Edge, electronics, technology, laptops, smartphones, accessories',
      twitterCard: 'summary_large_image',
    },
  });

  await prisma.contactSettings.upsert({
    where: { id: 'default' },
    update: {},
    create: {
      id: 'default',
      emails: JSON.stringify([
        'info@industrialedge.com',
      ]),
      phones: JSON.stringify([
        '(+012) 3456 7890',
      ]),
      addresses: JSON.stringify([
        '123 Street New York, USA',
      ]),
      workingHours: JSON.stringify({
        monday: '09:00 - 18:00',
        tuesday: '09:00 - 18:00',
        wednesday: '09:00 - 18:00',
        thursday: '09:00 - 18:00',
        friday: '09:00 - 18:00',
        saturday: '09:00 - 14:00',
        sunday: 'Closed',
      }),
      socialLinks: JSON.stringify({
        facebook: 'https://facebook.com/industrialedge',
        twitter: 'https://twitter.com/industrialedge',
        instagram: 'https://instagram.com/industrialedge',
        linkedin: 'https://linkedin.com/company/industrialedge',
      }),
    },
  });

  await prisma.systemSettings.upsert({
    where: { id: 'default' },
    update: {},
    create: {
      id: 'default',
      maintenanceMode: false,
      allowRegistration: true,
      requireEmailVerification: false,
      enableAuditLogging: true,
      defaultLanguage: 'en',
      defaultCurrency: 'USD',
      timeZone: 'UTC',
      uploadSizeLimit: 5,
      sessionTimeout: 120,
    },
  });

  await prisma.featureFlags.upsert({
    where: { id: 'default' },
    update: {},
    create: {
      id: 'default',
      enableWishlist: true,
      enableCompare: false,
      enableReviews: true,
      enableCoupons: true,
      enableNewsletter: true,
      enablePartners: true,
      enableBlog: false,
      enableTestimonials: true,
      enableSmokeEffect: false,
      enableAnimations: true,
    },
  });

  await prisma.settingsMetadata.upsert({
    where: { id: 'default' },
    update: {
      schemaVersion: 1,
      lastMigration: new Date(),
    },
    create: {
      id: 'default',
      schemaVersion: 1,
      lastMigration: new Date(),
    },
  });

  console.log('Created settings');

  await Promise.all([
    prisma.pageContent.upsert({
      where: { slug: 'about' },
      update: {},
      create: { slug: 'about', title: 'About Us', content: '<h2>About Industrial Edge</h2><p>We are a leading electronics retailer dedicated to bringing you the latest technology at competitive prices.</p>', active: true },
    }),
    prisma.pageContent.upsert({
      where: { slug: 'returns' },
      update: {},
      create: { slug: 'returns', title: 'Returns Policy', content: '<h2>Returns Policy</h2><p>30-day money back guarantee on all products. Items must be in original condition.</p>', active: true },
    }),
    prisma.pageContent.upsert({
      where: { slug: 'delivery-info' },
      update: {},
      create: { slug: 'delivery-info', title: 'Delivery Information', content: '<h2>Delivery Information</h2><p>Free shipping on all orders. Delivery within 3-5 business days.</p>', active: true },
    }),
    prisma.pageContent.upsert({
      where: { slug: 'privacy-policy' },
      update: {},
      create: { slug: 'privacy-policy', title: 'Privacy Policy', content: '<h2>Privacy Policy</h2><p>We respect your privacy and protect your personal data.</p>', active: true },
    }),
    prisma.pageContent.upsert({
      where: { slug: 'terms' },
      update: {},
      create: { slug: 'terms', title: 'Terms & Conditions', content: '<h2>Terms & Conditions</h2><p>By using this website, you agree to our terms and conditions.</p>', active: true },
    }),
    prisma.pageContent.upsert({
      where: { slug: 'warranty' },
      update: {},
      create: { slug: 'warranty', title: 'Warranty', content: '<h2>Warranty Information</h2><p>All products come with manufacturer warranty. Extended warranty available.</p>', active: true },
    }),
    prisma.pageContent.upsert({
      where: { slug: 'faq' },
      update: {},
      create: { slug: 'faq', title: 'Frequently Asked Questions', content: '<h2>FAQ</h2><p>Find answers to common questions about orders, shipping, returns, and more.</p>', active: true },
    }),
  ]);

  console.log('Created page content');

  await prisma.coupon.upsert({
    where: { code: 'WELCOME10' },
    update: {},
    create: { code: 'WELCOME10', type: 'PERCENTAGE', value: new Prisma.Decimal('10'), minimumOrder: new Prisma.Decimal('50'), active: true, usageLimit: 1000 },
  });

  await prisma.coupon.upsert({
    where: { code: 'SAVE20' },
    update: {},
    create: { code: 'SAVE20', type: 'FIXED_AMOUNT', value: new Prisma.Decimal('20'), minimumOrder: new Prisma.Decimal('100'), active: true, usageLimit: 500 },
  });

  console.log('Created coupons');

  console.log('Database seeding completed!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
