import { prisma } from '../config/database.js';
import { AppError } from '../middleware/errorHandler.js';

export const tagService = {
  async getAll() {
    return prisma.tag.findMany({
      orderBy: { name: 'asc' },
      include: {
        _count: {
          select: { products: true }
        }
      }
    });
  },

  async getById(id: string) {
    const tag = await prisma.tag.findUnique({ 
      where: { id },
      include: {
        _count: {
          select: { products: true }
        }
      }
    });
    if (!tag) throw new AppError(404, 'Tag not found');
    return tag;
  },

  async create(data: { name: string; slug: string }) {
    const existing = await prisma.tag.findUnique({ where: { slug: data.slug } });
    if (existing) throw new AppError(409, 'Tag slug already exists');
    return prisma.tag.create({ data });
  },

  async update(id: string, data: { name?: string; slug?: string }) {
    const tag = await prisma.tag.findUnique({ where: { id } });
    if (!tag) throw new AppError(404, 'Tag not found');

    if (data.slug && data.slug !== tag.slug) {
      const existing = await prisma.tag.findUnique({ where: { slug: data.slug } });
      if (existing) throw new AppError(409, 'Tag slug already exists');
    }

    return prisma.tag.update({ where: { id }, data });
  },

  async delete(id: string) {
    const tag = await prisma.tag.findUnique({ where: { id } });
    if (!tag) throw new AppError(404, 'Tag not found');
    return prisma.tag.delete({ where: { id } });
  },
};
