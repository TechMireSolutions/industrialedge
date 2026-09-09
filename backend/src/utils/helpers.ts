import jwt from 'jsonwebtoken';
import { config } from '../config/index.js';
import { prisma } from '../config/database.js';
import bcrypt from 'bcryptjs';

export const generateTokens = (user: { id: string; email: string; role: string }) => {
  const accessToken = jwt.sign(
    { id: user.id, email: user.email, role: user.role },
    config.jwt.secret,
    { expiresIn: config.jwt.expiresIn as jwt.SignOptions['expiresIn'] }
  );

  const refreshToken = jwt.sign(
    { id: user.id, type: 'refresh' },
    config.jwt.refreshSecret,
    { expiresIn: config.jwt.refreshExpiresIn as jwt.SignOptions['expiresIn'] }
  );

  return { accessToken, refreshToken };
};

export const verifyRefreshToken = (token: string) => {
  return jwt.verify(token, config.jwt.refreshSecret) as { id: string; type: string };
};

export const hashPassword = async (password: string): Promise<string> => {
  return bcrypt.hash(password, 12);
};

export const comparePassword = async (password: string, hash: string): Promise<boolean> => {
  return bcrypt.compare(password, hash);
};

export const setTokenCookies = (res: any, accessToken: string, refreshToken: string) => {
  const isProduction = config.nodeEnv === 'production';

  res.cookie('accessToken', accessToken, {
    httpOnly: true,
    secure: isProduction,
    sameSite: isProduction ? 'none' : 'lax',
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    path: '/',
    domain: isProduction ? undefined : 'localhost',
  });

  res.cookie('refreshToken', refreshToken, {
    httpOnly: true,
    secure: isProduction,
    sameSite: isProduction ? 'none' : 'lax',
    maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
    path: '/',
    domain: isProduction ? undefined : 'localhost',
  });
};

export const clearTokenCookies = (res: any) => {
  const isProduction = config.nodeEnv === 'production';

  res.clearCookie('accessToken', {
    httpOnly: true,
    secure: isProduction,
    sameSite: isProduction ? 'none' : 'lax',
    path: '/',
    domain: isProduction ? undefined : 'localhost',
  });

  res.clearCookie('refreshToken', {
    httpOnly: true,
    secure: isProduction,
    sameSite: isProduction ? 'none' : 'lax',
    path: '/',
    domain: isProduction ? undefined : 'localhost',
  });
};

export const generateOrderNumber = (): string => {
  const timestamp = Date.now().toString(36).toUpperCase();
  const random = Math.random().toString(36).substring(2, 8).toUpperCase();
  return `IE-${timestamp}-${random}`;
};

export const calculateProductPrice = (product: { price: any; oldPrice: any }) => {
  const price = Number(product.price);
  const oldPrice = product.oldPrice ? Number(product.oldPrice) : null;
  const discount = oldPrice && oldPrice > price
    ? Math.round(((oldPrice - price) / oldPrice) * 100)
    : 0;
  return { price, oldPrice, discount };
};

export const slugify = (text: string): string => {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
};

export const paginate = <T>(
  items: T[],
  page: number,
  limit: number
): { data: T[]; pagination: { page: number; limit: number; total: number; totalPages: number } } => {
  const total = items.length;
  const totalPages = Math.ceil(total / limit);
  const start = (page - 1) * limit;
  const end = start + limit;
  return {
    data: items.slice(start, end),
    pagination: { page, limit, total, totalPages },
  };
};

export const formatCurrency = (amount: number | string, currency = 'USD'): string => {
  const num = typeof amount === 'string' ? parseFloat(amount) : amount;
  return new Intl.NumberFormat('en-US', { style: 'currency', currency }).format(num);
};

export const buildProductWhereClause = (query: {
  search?: string;
  category?: string;
  collection?: string;
  minPrice?: number;
  maxPrice?: number;
  featured?: boolean;
  new?: boolean;
  topSelling?: boolean;
  bestseller?: boolean;
  sale?: boolean;
  tag?: string;
}) => {
  const where: any = { active: true };

  if (query.search) {
    where.OR = [
      { name: { contains: query.search } },
      { description: { contains: query.search } },
      { sku: { contains: query.search } },
    ];
  }

  if (query.category) {
    where.category = { slug: query.category };
  }

  if (query.minPrice !== undefined || query.maxPrice !== undefined) {
    where.price = {};
    if (query.minPrice !== undefined) where.price.gte = query.minPrice;
    if (query.maxPrice !== undefined) where.price.lte = query.maxPrice;
  }

  if (query.featured) where.isFeatured = true;
  if (query.new) where.isNew = true;
  if (query.topSelling) where.isTopSelling = true;
  if (query.bestseller) where.isBestseller = true;

  if (query.collection) {
    where.collections = {
      some: {
        collection: { slug: query.collection }
      }
    };
  }

  if (query.sale) {
    where.oldPrice = { gt: 0 };
  }

  if (query.tag) {
    where.tags = {
      some: {
        slug: query.tag
      }
    };
  }

  return where;
};

export const buildProductOrderBy = (sort?: string, order: 'asc' | 'desc' = 'desc') => {
  const orderBy: any = {};

  switch (sort) {
    case 'price':
      orderBy.price = order;
      break;
    case 'newest':
      orderBy.createdAt = order;
      break;
    case 'popularity':
      orderBy.reviewCount = order;
      break;
    case 'rating':
      orderBy.rating = order;
      break;
    case 'name':
      orderBy.name = order;
      break;
    default:
      orderBy.createdAt = 'desc';
  }

  return orderBy;
};
