import prisma from '../config/database.js';

let cachedPublicSettings: any = null;
let cachedAdminSettings: any = null;

export const settingsRepository = {
  clearCache() {
    cachedPublicSettings = null;
    cachedAdminSettings = null;
  },

  async getPublicSettings() {
    if (cachedPublicSettings) return cachedPublicSettings;

    const [
      general,
      branding,
      theme,
      seo,
      contact,
      featureFlags,
    ] = await Promise.all([
      prisma.generalSettings.findUnique({
        where: { id: 'default' },
      }),

      prisma.brandingSettings.findUnique({
        where: { id: 'default' },
        include: {
          mainLogo: true,
          darkLogo: true,
          navbarLogo: true,
          footerLogo: true,
          loginLogo: true,
          favicon: true,
        },
      }),

      prisma.themeSettings.findUnique({
        where: { id: 'default' },

      }),

      prisma.seoSettings.findUnique({
        where: { id: 'default' },
      }),

      prisma.contactSettings.findUnique({
        where: { id: 'default' },
      }),

      prisma.featureFlags.findUnique({
        where: { id: 'default' },
      }),
    ]);

    cachedPublicSettings = {
      general,
      branding,
      theme,
      seo,
      contact,
      featureFlags,
    };

    return cachedPublicSettings;
  },

  async getAdminSettings() {
    if (cachedAdminSettings) return cachedAdminSettings;

    const [
      general,
      branding,
      theme,
      seo,
      contact,
      system,
      featureFlags,
    ] = await Promise.all([
      prisma.generalSettings.findUnique({ where: { id: 'default' } }),
      prisma.brandingSettings.findUnique({
        where: { id: 'default' },
        include: {
          mainLogo: true,
          darkLogo: true,
          navbarLogo: true,
          footerLogo: true,
          loginLogo: true,
          favicon: true,
        },
      }),
      prisma.themeSettings.findUnique({ where: { id: 'default' } }),
      prisma.seoSettings.findUnique({ where: { id: 'default' } }),
      prisma.contactSettings.findUnique({ where: { id: 'default' } }),
      prisma.systemSettings.findUnique({ where: { id: 'default' } }),
      prisma.featureFlags.findUnique({ where: { id: 'default' } }),
    ]);

    cachedAdminSettings = { general, branding, theme, seo, contact, system, featureFlags };
    return cachedAdminSettings;
  },

  async updateSettingsTransaction(data: any, adminId: string, ip: string) {
    // Helper to remove relation objects (keep only scalar fields and ID fields)
    const sanitizeData = (obj: any) => {
      if (!obj || typeof obj !== 'object') return obj;
      const result: any = {};
      for (const [key, value] of Object.entries(obj)) {
        // Skip relation objects (objects that are not arrays and not Date/primitives)
        if (value && typeof value === 'object' && !Array.isArray(value) && !(value instanceof Date)) {
          // Keep only ID fields (ending with Id)
          if (key.endsWith('Id')) {
            result[key] = value;
          }
          // Skip relation objects like mainLogo, darkLogo, navbarLogo, etc.
          continue;
        }
        result[key] = value;
      }
      return result;
    };

    const sanitizedData = {
      general: data.general ? sanitizeData(data.general) : undefined,
      branding: data.branding ? sanitizeData(data.branding) : undefined,
      theme: data.theme ? sanitizeData(data.theme) : undefined,
      seo: data.seo ? sanitizeData(data.seo) : undefined,
      contact: data.contact ? sanitizeData(data.contact) : undefined,
      system: data.system ? sanitizeData(data.system) : undefined,
      featureFlags: data.featureFlags ? sanitizeData(data.featureFlags) : undefined,
    };

    const result = await prisma.$transaction(async (tx) => {
      // 1. Fetch old snapshot for audit log
      const [
        generalOld,
        brandingOld,
        themeOld,
        seoOld,
        contactOld,
        systemOld,
        featureFlagsOld,
      ] = await Promise.all([
        tx.generalSettings.findUnique({ where: { id: 'default' } }),
        tx.brandingSettings.findUnique({ where: { id: 'default' } }),
        tx.themeSettings.findUnique({ where: { id: 'default' } }),
        tx.seoSettings.findUnique({ where: { id: 'default' } }),
        tx.contactSettings.findUnique({ where: { id: 'default' } }),
        tx.systemSettings.findUnique({ where: { id: 'default' } }),
        tx.featureFlags.findUnique({ where: { id: 'default' } }),
      ]);
      const beforeSnapshot = JSON.stringify({
        general: generalOld, branding: brandingOld, theme: themeOld, seo: seoOld, contact: contactOld, system: systemOld, featureFlags: featureFlagsOld
      });

      // 2. Upsert each module
      if (sanitizedData.general) {
        await tx.generalSettings.upsert({
          where: { id: 'default' },
          create: { id: 'default', ...sanitizedData.general },
          update: { ...sanitizedData.general },
        });
      }
      if (sanitizedData.branding) {
        await tx.brandingSettings.upsert({
          where: { id: 'default' },
          create: { id: 'default', ...sanitizedData.branding },
          update: { ...sanitizedData.branding },
        });
      }
      if (sanitizedData.theme) {
        await tx.themeSettings.upsert({
          where: { id: 'default' },
          create: { id: 'default', ...sanitizedData.theme },
          update: { ...sanitizedData.theme },
        });
      }
      if (sanitizedData.seo) {
        await tx.seoSettings.upsert({
          where: { id: 'default' },
          create: { id: 'default', ...sanitizedData.seo },
          update: { ...sanitizedData.seo },
        });
      }
      if (sanitizedData.contact) {
        await tx.contactSettings.upsert({
          where: { id: 'default' },
          create: { id: 'default', ...sanitizedData.contact },
          update: { ...sanitizedData.contact },
        });
      }
      if (sanitizedData.system) {
        await tx.systemSettings.upsert({
          where: { id: 'default' },
          create: { id: 'default', ...sanitizedData.system },
          update: { ...sanitizedData.system },
        });
      }
      if (sanitizedData.featureFlags) {
        await tx.featureFlags.upsert({
          where: { id: 'default' },
          create: { id: 'default', ...sanitizedData.featureFlags },
          update: { ...sanitizedData.featureFlags },
        });
      }

      // 3. Create Audit Log
      const [
        generalNew,
        brandingNew,
        themeNew,
        seoNew,
        contactNew,
        systemNew,
        featureFlagsNew,
      ] = await Promise.all([
        tx.generalSettings.findUnique({ where: { id: 'default' } }),
        tx.brandingSettings.findUnique({ where: { id: 'default' } }),
        tx.themeSettings.findUnique({ where: { id: 'default' } }),
        tx.seoSettings.findUnique({ where: { id: 'default' } }),
        tx.contactSettings.findUnique({ where: { id: 'default' } }),
        tx.systemSettings.findUnique({ where: { id: 'default' } }),
        tx.featureFlags.findUnique({ where: { id: 'default' } }),
      ]);
      const afterSnapshot = JSON.stringify({
        general: generalNew, branding: brandingNew, theme: themeNew, seo: seoNew, contact: contactNew, system: systemNew, featureFlags: featureFlagsNew
      });

      await tx.auditLog.create({
        data: {
          adminId: adminId,
          action: 'UPDATE',
          entity: 'Settings',
          before: beforeSnapshot,
          after: afterSnapshot,
          ip: ip,
        }
      });

      // 4. Create Settings Version
      await tx.settingsVersion.create({
        data: {
          settingsId: 'global',
          snapshot: afterSnapshot,
          adminId: adminId,
        }
      });

      return { success: true };
    }, {
      maxWait: 5000,
      timeout: 20000
    });

    // Clear cache after transaction completes successfully
    settingsRepository.clearCache();
    return result;
  }
};
