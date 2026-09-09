import { prisma } from '../config/database.js';
import { AppError } from '../middleware/errorHandler.js';
import { buildProductWhereClause, buildProductOrderBy, paginate, slugify } from '../utils/helpers.js';
import { Decimal } from '@prisma/client/runtime/library.js';
import crypto from 'crypto';

export const formatProduct = (product: any) => {
  if (!product) return product;
  if (typeof product.images === 'string') {
    try {
      product.images = JSON.parse(product.images);
    } catch (e) {
      product.images = product.images ? [product.images] : [];
    }
  }
  if (product.shippingPrice) {
    product.shippingPrice = Number(product.shippingPrice);
  }
  return product;
};

export const productService = {
  async getAll(query: {
    page?: number;
    limit?: number;
    sort?: string;
    order?: 'asc' | 'desc';
    search?: string;
    category?: string;
    minPrice?: number;
    maxPrice?: number;
    featured?: boolean;
    new?: boolean;
    topSelling?: boolean;
    bestseller?: boolean;
    collection?: string;
    sale?: boolean;
    tag?: string;
  }) {
    const page = query.page || 1;
    const limit = Math.min(query.limit || 20, 100);
    const where = buildProductWhereClause(query);
    const orderBy = buildProductOrderBy(query.sort, query.order);

    const [products, total] = await Promise.all([
      prisma.product.findMany({
        where,
        orderBy,
        skip: (page - 1) * limit,
        take: limit,
        include: { 
          category: { select: { id: true, name: true, slug: true } },
          tags: { select: { id: true, name: true, slug: true } }
        },
      }),
      prisma.product.count({ where }),
    ]);

    return {
      data: products.map(formatProduct),
      pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
    };
  },

  async getById(id: string) {
    const product = await prisma.product.findUnique({
      where: { id },
      include: { 
        category: { select: { id: true, name: true, slug: true } },
        tags: { select: { id: true, name: true, slug: true } }
      },
    });
    if (!product) throw new AppError(404, 'Product not found');
    return formatProduct(product);
  },

  async getBySlug(slug: string) {
    const product = await prisma.product.findUnique({
      where: { slug },
      include: { 
        category: { select: { id: true, name: true, slug: true } },
        tags: { select: { id: true, name: true, slug: true } }
      },
    });
    if (!product) throw new AppError(404, 'Product not found');
    return formatProduct(product);
  },

  async getRelated(productId: string, categoryId: string, limit = 4) {
    const products = await prisma.product.findMany({
      where: {
        id: { not: productId },
        categoryId,
        active: true,
      },
      take: limit,
      include: { category: { select: { id: true, name: true, slug: true } } },
      orderBy: { createdAt: 'desc' },
    });
    return products.map(formatProduct);
  },

  async getFeatured(limit = 8) {
    const products = await prisma.product.findMany({
      where: { isFeatured: true, active: true },
      take: limit,
      include: { category: { select: { id: true, name: true, slug: true } } },
      orderBy: { createdAt: 'desc' },
    });
    return products.map(formatProduct);
  },

  async getNewArrivals(limit = 8) {
    const products = await prisma.product.findMany({
      where: { isNew: true, active: true },
      take: limit,
      include: { category: { select: { id: true, name: true, slug: true } } },
      orderBy: { createdAt: 'desc' },
    });
    return products.map(formatProduct);
  },

  async getTopSelling(limit = 8) {
    const products = await prisma.product.findMany({
      where: { isTopSelling: true, active: true },
      take: limit,
      include: { category: { select: { id: true, name: true, slug: true } } },
      orderBy: { createdAt: 'desc' },
    });
    return products.map(formatProduct);
  },

  async getBestsellers(limit = 8) {
    const products = await prisma.product.findMany({
      where: { isBestseller: true, active: true },
      take: limit,
      include: { category: { select: { id: true, name: true, slug: true } } },
      orderBy: { createdAt: 'desc' },
    });
    return products.map(formatProduct);
  },

  async create(data: any) {
    if (!data.slug) {
      let baseSlug = slugify(data.name);
      let uniqueSlug = baseSlug;
      let counter = 1;
      while (await prisma.product.findUnique({ where: { slug: uniqueSlug } })) {
        uniqueSlug = `${baseSlug}-${counter}`;
        counter++;
      }
      data.slug = uniqueSlug;
    } else {
      const existingSlug = await prisma.product.findUnique({ where: { slug: data.slug } });
      if (existingSlug) throw new AppError(409, 'Slug already exists');
    }

    if (!data.sku) {
      let isUnique = false;
      let uniqueSku = '';
      while (!isUnique) {
        uniqueSku = `PRD-${crypto.randomBytes(4).toString('hex').toUpperCase()}`;
        const existingSku = await prisma.product.findUnique({ where: { sku: uniqueSku } });
        if (!existingSku) {
          isUnique = true;
        }
      }
      data.sku = uniqueSku;
    } else {
      const existingSku = await prisma.product.findUnique({ where: { sku: data.sku } });
      if (existingSku) throw new AppError(409, 'SKU already exists');
    }

    const category = await prisma.category.findUnique({ where: { id: data.categoryId } });
    if (!category) throw new AppError(404, 'Category not found');

    const { tags, ...productData } = data;

    const createData: any = {
      ...productData,
      images: Array.isArray(productData.images) ? JSON.stringify(productData.images) : productData.images,
      price: new Decimal(productData.price),
      oldPrice: productData.oldPrice ? new Decimal(productData.oldPrice) : null,
      shippingPrice: productData.shippingPrice ? new Decimal(productData.shippingPrice) : new Decimal(0),
    };

    if (tags && Array.isArray(tags) && tags.length > 0) {
      createData.tags = { connect: tags.map((id: string) => ({ id })) };
    }

    const product = await prisma.product.create({
      data: createData,
      include: { 
        category: { select: { id: true, name: true, slug: true } },
        tags: { select: { id: true, name: true, slug: true } }
      },
    });
    return formatProduct(product);
  },

  async update(id: string, data: any) {
    const product = await prisma.product.findUnique({ where: { id } });
    if (!product) throw new AppError(404, 'Product not found');

    if (data.slug && data.slug !== product.slug) {
      const existingSlug = await prisma.product.findUnique({ where: { slug: data.slug } });
      if (existingSlug) throw new AppError(409, 'Slug already exists');
    }

    if (data.sku && data.sku !== product.sku) {
      const existingSku = await prisma.product.findUnique({ where: { sku: data.sku } });
      if (existingSku) throw new AppError(409, 'SKU already exists');
    }

    if (data.categoryId) {
      const category = await prisma.category.findUnique({ where: { id: data.categoryId } });
      if (!category) throw new AppError(404, 'Category not found');
    }

    const { tags, ...updateFields } = data;
    const updateData: any = { ...updateFields };
    if (updateFields.price !== undefined) updateData.price = new Decimal(updateFields.price);
    if (updateFields.oldPrice !== undefined) updateData.oldPrice = updateFields.oldPrice === null ? null : new Decimal(updateFields.oldPrice);
    if (updateFields.shippingPrice !== undefined) updateData.shippingPrice = new Decimal(updateFields.shippingPrice);
    if (updateFields.images && Array.isArray(updateFields.images)) updateData.images = JSON.stringify(updateFields.images);

    if (tags !== undefined) {
      updateData.tags = { set: tags.map((id: string) => ({ id })) };
    }

    const updatedProduct = await prisma.product.update({
      where: { id },
      data: updateData,
      include: { 
        category: { select: { id: true, name: true, slug: true } },
        tags: { select: { id: true, name: true, slug: true } }
      },
    });
    return formatProduct(updatedProduct);
  },

  async delete(id: string) {
    const product = await prisma.product.findUnique({ where: { id } });
    if (!product) throw new AppError(404, 'Product not found');

    const orderItems = await prisma.orderItem.count({ where: { productId: id } });
    if (orderItems > 0) {
      return prisma.product.update({
        where: { id },
        data: { active: false },
      });
    }

    const deletedProduct = await prisma.product.delete({ where: { id } });
    return formatProduct(deletedProduct);
  },

  async updateStock(id: string, quantity: number) {
    return prisma.product.update({
      where: { id },
      data: { stock: { decrement: quantity } },
    });
  },

  async checkStock(items: { productId: string; quantity: number }[]) {
    const products = await prisma.product.findMany({
      where: { id: { in: items.map(i => i.productId) } },
      select: { id: true, stock: true, name: true },
    });

    const stockMap = new Map(products.map(p => [p.id, p.stock]));
    const errors: string[] = [];

    for (const item of items) {
      const available = stockMap.get(item.productId) || 0;
      if (available < item.quantity) {
        const product = products.find(p => p.id === item.productId);
        errors.push(`${product?.name || 'Product'}: only ${available} in stock`);
      }
    }

    return { valid: errors.length === 0, errors };
  },
};

export const categoryService = {
  async getAll(activeOnly = false) {
    return prisma.category.findMany({
      where: activeOnly ? { active: true } : {},
      orderBy: { name: 'asc' },
      include: { _count: { select: { products: { where: { active: true } } } } },
    });
  },

  async getById(id: string) {
    const category = await prisma.category.findUnique({ where: { id } });
    if (!category) throw new AppError(404, 'Category not found');
    return category;
  },

  async getBySlug(slug: string) {
    const category = await prisma.category.findUnique({ where: { slug } });
    if (!category) throw new AppError(404, 'Category not found');
    return category;
  },

  async create(data: any) {
    const existingSlug = await prisma.category.findUnique({ where: { slug: data.slug } });
    if (existingSlug) throw new AppError(409, 'Slug already exists');

    return prisma.category.create({ data });
  },

  async update(id: string, data: any) {
    const category = await prisma.category.findUnique({ where: { id } });
    if (!category) throw new AppError(404, 'Category not found');

    if (data.slug && data.slug !== category.slug) {
      const existingSlug = await prisma.category.findUnique({ where: { slug: data.slug } });
      if (existingSlug) throw new AppError(409, 'Slug already exists');
    }

    return prisma.category.update({ where: { id }, data });
  },

  async delete(id: string) {
    const category = await prisma.category.findUnique({ where: { id } });
    if (!category) throw new AppError(404, 'Category not found');

    const productCount = await prisma.product.count({ where: { categoryId: id } });
    if (productCount > 0) {
      throw new AppError(409, 'Cannot delete category with products');
    }

    return prisma.category.delete({ where: { id } });
  },
};
