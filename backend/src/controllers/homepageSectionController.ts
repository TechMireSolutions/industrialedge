import { Request, Response, NextFunction } from 'express';
import prisma from '../config/database.js';

export const homepageSectionController = {
  async getSections(req: Request, res: Response, next: NextFunction) {
    try {
      const activeOnly = req.query.active !== 'false';
      const sections = await prisma.homepageSection.findMany({
        where: activeOnly ? { enabled: true } : {},
        orderBy: { displayOrder: 'asc' }
      });
      res.json({ success: true, data: sections });
    } catch (err) {
      next(err);
    }
  },

  async updateSections(req: Request, res: Response, next: NextFunction) {
    try {
      const { sections } = req.body;
      if (!Array.isArray(sections)) {
        res.status(400).json({ success: false, message: 'Invalid sections array' });
        return;
      }

      const existingSections = await prisma.homepageSection.findMany();
      const existingIds = new Set(existingSections.map(s => s.id));
      const incomingIds = new Set(sections.filter((s: any) => s.id && !String(s.id).startsWith('new_')).map((s: any) => s.id));

      // Delete sections that were removed in the builder
      const idsToDelete = existingSections.filter(s => !incomingIds.has(s.id)).map(s => s.id);
      if (idsToDelete.length > 0) {
        await prisma.homepageSection.deleteMany({
          where: { id: { in: idsToDelete } }
        });
      }

      // Upsert / Create incoming sections
      for (const section of sections) {
        const data = {
          sectionName: section.type || section.sectionName,
          settings: JSON.stringify({
            title: section.title,
            subtitle: section.subtitle,
            config: section.config || {}
          }),
          enabled: section.active !== undefined ? Boolean(section.active) : Boolean(section.enabled),
          displayOrder: parseInt(section.order !== undefined ? section.order : section.displayOrder) || 0
        };

        if (section.id && existingIds.has(section.id) && !String(section.id).startsWith('new_')) {
          await prisma.homepageSection.update({
            where: { id: section.id },
            data
          });
        } else {
          await prisma.homepageSection.create({
            data
          });
        }
      }

      const updated = await prisma.homepageSection.findMany({
        orderBy: { displayOrder: 'asc' }
      });

      res.json({ success: true, message: 'Sections updated', data: updated });
    } catch (err) {
      next(err);
    }
  }
};
