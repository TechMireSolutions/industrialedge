import { prisma } from '../config/database.js';
import { AppError } from '../middleware/errorHandler.js';
import { hashPassword, comparePassword, generateTokens, setTokenCookies, clearTokenCookies, verifyRefreshToken } from '../utils/helpers.js';

export const authService = {
  async register(data: { name: string; email: string; password: string; phone?: string }) {
    const existingUser = await prisma.user.findUnique({ where: { email: data.email } });
    if (existingUser) {
      throw new AppError(409, 'Email already registered');
    }

    const passwordHash = await hashPassword(data.password);
    const user = await prisma.user.create({
      data: {
        name: data.name,
        email: data.email,
        passwordHash,
        phone: data.phone,
      },
      select: { id: true, email: true, name: true, role: true, createdAt: true },
    });

    const tokens = generateTokens({ id: user.id, email: user.email, role: user.role });

    return { user, tokens };
  },

  async login(data: { email: string; password: string }) {
    const user = await prisma.user.findUnique({ where: { email: data.email } });
    if (!user) {
      throw new AppError(401, 'Invalid credentials');
    }

    const isValid = await comparePassword(data.password, user.passwordHash);
    if (!isValid) {
      throw new AppError(401, 'Invalid credentials');
    }

    const tokens = generateTokens({ id: user.id, email: user.email, role: user.role });

    const { passwordHash: _, ...userWithoutPassword } = user;
    return { user: userWithoutPassword, tokens };
  },

  async logout(res: any) {
    clearTokenCookies(res);
    return { success: true };
  },

  async refreshToken(token: string, res: any) {
    try {
      const decoded = verifyRefreshToken(token);

      const user = await prisma.user.findUnique({
        where: { id: decoded.id },
        select: { id: true, email: true, role: true },
      });

      if (!user) {
        throw new AppError(401, 'User not found');
      }

      const tokens = generateTokens({ id: user.id, email: user.email, role: user.role });
      setTokenCookies(res, tokens.accessToken, tokens.refreshToken);

      return { user, tokens };
    } catch {
      throw new AppError(401, 'Invalid refresh token');
    }
  },

  async getProfile(userId: string) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        role: true,
        createdAt: true,
        addresses: true,
      },
    });

    if (!user) {
      throw new AppError(404, 'User not found');
    }

    return user;
  },

  async updateProfile(userId: string, data: { name?: string; phone?: string; currentPassword?: string; newPassword?: string }) {
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) {
      throw new AppError(404, 'User not found');
    }

    const updateData: any = {};
    if (data.name) updateData.name = data.name;
    if (data.phone) updateData.phone = data.phone;

    if (data.currentPassword && data.newPassword) {
      const isValid = await comparePassword(data.currentPassword, user.passwordHash);
      if (!isValid) {
        throw new AppError(401, 'Current password is incorrect');
      }
      updateData.passwordHash = await hashPassword(data.newPassword);
    }

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: updateData,
      select: { id: true, name: true, email: true, phone: true, role: true, createdAt: true },
    });

    return updatedUser;
  },

  async changePassword(userId: string, currentPassword: string, newPassword: string) {
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) {
      throw new AppError(404, 'User not found');
    }

    const isValid = await comparePassword(currentPassword, user.passwordHash);
    if (!isValid) {
      throw new AppError(401, 'Current password is incorrect');
    }

    const passwordHash = await hashPassword(newPassword);
    await prisma.user.update({
      where: { id: userId },
      data: { passwordHash },
    });

    return { success: true };
  },
};
