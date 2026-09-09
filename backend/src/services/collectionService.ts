import prisma from '../config/database.js';
import { AppError } from '../middleware/errorHandler.js';
import { slugify } from '../utils/helpers.js';

export const collectionService = {
  async getAllCollections() {
    return prisma.collection.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        _count: {
          select: { products: true }
        }
      }
    });
  },

  async getActiveCollections() {
    return prisma.collection.findMany({
      where: { active: true },
      orderBy: { createdAt: 'desc' },
      include: {
        _count: {
          select: { products: true }
        }
      }
    });
  },

  async getCollectionById(id: string) {
    const collection = await prisma.collection.findUnique({
      where: { id },
      include: {
        products: {
          include: {
            product: true
          },
          orderBy: {
            displayOrder: 'asc'
          }
        }
      }
    });

    if (!collection) {
      throw new AppError(404, 'Collection not found');
    }

    return collection;
  },

  async getCollectionBySlug(slug: string) {
    const collection = await prisma.collection.findUnique({
      where: { slug },
      include: {
        products: {
          include: {
            product: true
          },
          orderBy: {
            displayOrder: 'asc'
          }
        }
      }
    });

    if (!collection) {
      throw new AppError(404, 'Collection not found');
    }

    return collection;
  },

  async createCollection(data: any) {
    const slug = data.slug || slugify(data.name);

    // Check if slug exists
    const existing = await prisma.collection.findUnique({ where: { slug } });
    if (existing) {
      throw new AppError(400, 'Collection with this slug already exists');
    }

    return prisma.collection.create({
      data: {
        name: data.name,
        slug,
        description: data.description,
        image: data.image,
        active: data.active !== undefined ? data.active : true,
      }
    });
  },

  async updateCollection(id: string, data: any) {
    const collection = await prisma.collection.findUnique({ where: { id } });
    if (!collection) {
      throw new AppError(404, 'Collection not found');
    }

    let slug = data.slug;
    if (data.name && (!slug || slug === '')) {
      slug = slugify(data.name);
    }

    if (slug && slug !== collection.slug) {
      const existing = await prisma.collection.findUnique({ where: { slug } });
      if (existing) {
        throw new AppError(400, 'Collection with this slug already exists');
      }
    }

    return prisma.collection.update({
      where: { id },
      data: {
        name: data.name !== undefined ? data.name : collection.name,
        slug: slug !== undefined ? slug : collection.slug,
        description: data.description !== undefined ? data.description : collection.description,
        image: data.image !== undefined ? data.image : collection.image,
        active: data.active !== undefined ? data.active : collection.active,
      }
    });
  },

  async deleteCollection(id: string) {
    const collection = await prisma.collection.findUnique({ where: { id } });
    if (!collection) {
      throw new AppError(404, 'Collection not found');
    }

    await prisma.collection.delete({ where: { id } });
    return { success: true };
  },

  async assignProducts(collectionId: string, productIds: string[]) {
    const collection = await prisma.collection.findUnique({ where: { id: collectionId } });
    if (!collection) {
      throw new AppError(404, 'Collection not found');
    }

    // First delete all existing products for this collection to replace them
    await prisma.collectionProduct.deleteMany({
      where: { collectionId }
    });

    // Then insert the new ones
    if (productIds && productIds.length > 0) {
      const dataToInsert = productIds.map((productId, index) => ({
        collectionId,
        productId,
        displayOrder: index
      }));

      await prisma.collectionProduct.createMany({
        data: dataToInsert
      });
    }

    return this.getCollectionById(collectionId);
  }
};
