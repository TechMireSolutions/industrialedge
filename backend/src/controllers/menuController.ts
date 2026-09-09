import { Request, Response, NextFunction } from 'express';
import db from '../config/database.js';

// Resolve both named { prisma } and default export styles safely
const prisma: any = (db as any).prisma || db;

export const menuController = {
  // ADMIN Endpoint: Fetch all menus with full configuration data
  async getMenus(req: Request, res: Response, next: NextFunction) {
    try {
      const menus = await prisma.menu.findMany({
        where: { deletedAt: null },
        include: {
          items: {
            where: { deletedAt: null, parentId: null },
            orderBy: { order: 'asc' },
            include: {
              category: { select: { id: true, name: true, slug: true } },
              collection: { select: { id: true, name: true, slug: true } },
              page: { select: { id: true, title: true, slug: true } },
              product: { select: { id: true, name: true, slug: true } },
              children: {
                where: { deletedAt: null },
                orderBy: { order: 'asc' },
                include: {
                  category: { select: { id: true, name: true, slug: true } },
                  collection: { select: { id: true, name: true, slug: true } },
                  page: { select: { id: true, title: true, slug: true } },
                  product: { select: { id: true, name: true, slug: true } },
                  children: {
                    where: { deletedAt: null },
                    orderBy: { order: 'asc' },
                    include: {
                      category: { select: { id: true, name: true, slug: true } },
                      collection: { select: { id: true, name: true, slug: true } },
                      page: { select: { id: true, title: true, slug: true } },
                      product: { select: { id: true, name: true, slug: true } },
                    },
                  },
                },
              },
            },
          },
        },
      });
      return res.json({ success: true, data: menus });
    } catch (error: any) {
      console.error('=== ERROR in getMenus ===', error);
      return res.status(500).json({
        success: false,
        message: error?.message || 'Failed to fetch menus',
      });
    }
  },

  // PUBLIC Endpoint: Fetch active menu by slug and automatically inject dynamic sources
  async getActiveMenu(req: Request, res: Response, next: NextFunction) {
    try {
      const { slug } = req.params;
      const menu = await prisma.menu.findFirst({
        where: { slug, deletedAt: null },
        include: {
          items: {
            where: { deletedAt: null, parentId: null, visible: true },
            orderBy: { order: 'asc' },
            include: {
              category: { select: { id: true, name: true, slug: true } },
              collection: { select: { id: true, name: true, slug: true } },
              page: { select: { id: true, title: true, slug: true } },
              product: { select: { id: true, name: true, slug: true } },
              children: {
                where: { deletedAt: null, visible: true },
                orderBy: { order: 'asc' },
                include: {
                  category: { select: { id: true, name: true, slug: true } },
                  collection: { select: { id: true, name: true, slug: true } },
                  page: { select: { id: true, title: true, slug: true } },
                  product: { select: { id: true, name: true, slug: true } },
                  children: {
                    where: { deletedAt: null, visible: true },
                    orderBy: { order: 'asc' },
                    include: {
                      category: { select: { id: true, name: true, slug: true } },
                      collection: { select: { id: true, name: true, slug: true } },
                      page: { select: { id: true, title: true, slug: true } },
                      product: { select: { id: true, name: true, slug: true } },
                    },
                  },
                },
              },
            },
          },
        },
      });

      if (!menu) {
        return res.status(404).json({ success: false, message: 'Menu not found' });
      }

      // Inject dynamic categories/collections if requested by a parent item
      let activeCategories: any[] = [];
      let activeCollections: any[] = [];
      try {
        activeCategories = await prisma.category.findMany({ where: { active: true }, orderBy: { name: 'asc' } });
        activeCollections = await prisma.collection.findMany({ where: { active: true }, orderBy: { name: 'asc' } });
      } catch (e) {
        console.warn('Could not load dynamic sources', e);
      }

      const processDynamicSources = (items: any[]) => {
        const result: any[] = [];
        for (const item of items) {
          result.push(item);
          if (item.source === 'dynamic_categories') {
            item.children = activeCategories.map((cat, idx) => ({
              id: `dyn-cat-${cat.id}`,
              type: 'link',
              destinationType: 'category',
              label: cat.name,
              category: { slug: cat.slug },
              order: idx,
              visible: true,
              desktopVisible: true,
              mobileVisible: true,
              children: [],
            }));
          } else if (item.source === 'dynamic_collections') {
            item.children = activeCollections.map((col, idx) => ({
              id: `dyn-col-${col.id}`,
              type: 'link',
              destinationType: 'collection',
              label: col.name,
              collection: { slug: col.slug },
              order: idx,
              visible: true,
              desktopVisible: true,
              mobileVisible: true,
              children: [],
            }));
          } else if (item.children && item.children.length > 0) {
            item.children = processDynamicSources(item.children);
          }
        }
        return result;
      };

      const finalMenu = { ...menu, items: processDynamicSources(menu.items) };

      return res.json({ success: true, data: finalMenu });
    } catch (error: any) {
      console.error('=== ERROR in getActiveMenu ===', error);
      return res.status(500).json({
        success: false,
        message: error?.message || 'Failed to fetch active menu',
      });
    }
  },

  // ADMIN Endpoint: Create Menu
  async createMenu(req: Request, res: Response, next: NextFunction) {
    try {
      const { name, slug, description } = req.body;

      if (!name || !slug) {
        return res.status(400).json({
          success: false,
          message: 'Name and slug are required to create a menu',
        });
      }

      const cleanSlug = String(slug)
        .trim()
        .toLowerCase()
        .replace(/[^a-z0-9-]/g, '-');

      // Check for existing slug
      const existing = await prisma.menu.findUnique({
        where: { slug: cleanSlug },
      });

      if (existing) {
        return res.status(409).json({
          success: false,
          message: `A menu with the slug "${cleanSlug}" already exists.`,
        });
      }

      const menu = await prisma.menu.create({
        data: {
          name: String(name).trim(),
          slug: cleanSlug,
          description: description ? String(description).trim() : '',
        },
      });

      return res.status(201).json({ success: true, data: menu });
    } catch (error: any) {
      console.error('=== ERROR in createMenu ===', error);
      return res.status(500).json({
        success: false,
        message: error?.message || 'Failed to create menu',
      });
    }
  },

  async addMenuItem(req: Request, res: Response, next: NextFunction) {
    try {
      const { menuId } = req.params;
      const data = req.body;

      const item = await prisma.menuItem.create({
        data: {
          menuId,
          label: data.label,
          type: data.type || 'link',
          destinationType: data.destinationType || null,
          systemAction: data.systemAction || null,
          source: data.source || null,
          url: data.url || null,
          target: data.target || '_self',
          categoryId: data.categoryId || null,
          collectionId: data.collectionId || null,
          productId: data.productId || null,
          pageId: data.pageId || null,
          icon: data.icon || null,
          iconPosition: data.iconPosition || 'left',
          badgeText: data.badgeText || null,
          badgeVariant: data.badgeVariant || null,
          variant: data.variant || null,
          order: Number(data.order) || 0,
          visible: data.visible !== undefined ? Boolean(data.visible) : true,
          desktopVisible: data.desktopVisible !== undefined ? Boolean(data.desktopVisible) : true,
          mobileVisible: data.mobileVisible !== undefined ? Boolean(data.mobileVisible) : true,
          parentId: data.parentId || null,
        },
      });
      return res.status(201).json({ success: true, data: item });
    } catch (error: any) {
      console.error('=== ERROR in addMenuItem ===', error);
      return res.status(500).json({ success: false, message: error?.message || 'Failed to add menu item' });
    }
  },

  async updateMenuItem(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const data = req.body;

      const item = await prisma.menuItem.update({
        where: { id },
        data: {
          label: data.label,
          type: data.type,
          destinationType: data.destinationType || null,
          systemAction: data.systemAction || null,
          source: data.source || null,
          url: data.url || null,
          target: data.target || '_self',
          categoryId: data.categoryId || null,
          collectionId: data.collectionId || null,
          productId: data.productId || null,
          pageId: data.pageId || null,
          icon: data.icon || null,
          iconPosition: data.iconPosition || 'left',
          badgeText: data.badgeText || null,
          badgeVariant: data.badgeVariant || null,
          variant: data.variant || null,
          order: Number(data.order) || 0,
          visible: data.visible !== undefined ? Boolean(data.visible) : true,
          desktopVisible: data.desktopVisible !== undefined ? Boolean(data.desktopVisible) : true,
          mobileVisible: data.mobileVisible !== undefined ? Boolean(data.mobileVisible) : true,
          parentId: data.parentId || null,
        },
      });
      return res.json({ success: true, data: item });
    } catch (error: any) {
      console.error('=== ERROR in updateMenuItem ===', error);
      return res.status(500).json({ success: false, message: error?.message || 'Failed to update menu item' });
    }
  },

  async deleteMenuItem(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      await prisma.menuItem.delete({
        where: { id },
      });
      return res.json({ success: true, message: 'Item deleted' });
    } catch (error: any) {
      console.error('=== ERROR in deleteMenuItem ===', error);
      return res.status(500).json({ success: false, message: error?.message || 'Failed to delete menu item' });
    }
  },

  async reorderMenuItems(req: Request, res: Response, next: NextFunction) {
    try {
      const { items } = req.body;
      const transactions = items.map((item: any) =>
        prisma.menuItem.update({
          where: { id: item.id },
          data: { order: Number(item.order) },
        })
      );
      await prisma.$transaction(transactions);
      return res.json({ success: true, message: 'Items reordered' });
    } catch (error: any) {
      console.error('=== ERROR in reorderMenuItems ===', error);
      return res.status(500).json({ success: false, message: error?.message || 'Failed to reorder menu items' });
    }
  },
};