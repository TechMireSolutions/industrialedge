import { prisma } from '../config/database.js';
import { AppError } from '../middleware/errorHandler.js';
import { cartService } from './cartService.js';
import { generateOrderNumber, formatCurrency } from '../utils/helpers.js';
import { Decimal } from '@prisma/client/runtime/library.js';
import { emailService } from './emailService.js';
import { couponService } from './cmsService.js';
import { notificationService } from './notificationService.js';

export const orderService = {
  async createFromCart(userId: string, data: {
    billingAddress: any;
    shippingAddress?: any;
    paymentMethod: string;
    notes?: string;
    couponCode?: string;
    cartId: string;
  }) {
    const cartSummary = await cartService.getCartSummary(data.cartId);
    if (!cartSummary || cartSummary.items.length === 0) {
      throw new AppError(400, 'Cart is empty');
    }

    const stockCheck = await cartService.checkStock(
      cartSummary.items.map(item => ({ productId: item.productId, quantity: item.quantity }))
    );
    if (!stockCheck.valid) {
      throw new AppError(409, `Stock validation failed: ${stockCheck.errors.join(', ')}`);
    }

    let discount = new Decimal(0);
    let coupon: any = null;

    if (data.couponCode) {
      coupon = await prisma.coupon.findUnique({
        where: { code: data.couponCode.toUpperCase() },
      });

      if (!coupon || !coupon.active) {
        throw new AppError(400, 'Invalid coupon code');
      }

      if (coupon.expiry && new Date(coupon.expiry) < new Date()) {
        throw new AppError(400, 'Coupon has expired');
      }

      if (coupon.usageLimit && coupon.usageCount >= coupon.usageLimit) {
        throw new AppError(400, 'Coupon usage limit reached');
      }

      if (coupon.minimumOrder && cartSummary.subtotal < Number(coupon.minimumOrder)) {
        throw new AppError(400, `Minimum order of ${formatCurrency(Number(coupon.minimumOrder))} required`);
      }

      if (coupon.type === 'PERCENTAGE') {
        discount = new Decimal(cartSummary.subtotal * Number(coupon.value) / 100);
      } else {
        discount = new Decimal(Number(coupon.value));
      }

      if (coupon.maximumDiscount && discount.gt(coupon.maximumDiscount)) {
        discount = new Decimal(Number(coupon.maximumDiscount));
      }
    }

    const subtotal = new Decimal(cartSummary.subtotal);
    const shipping = new Decimal((cartSummary as any).shippingTotal || 0);
    const total = subtotal.minus(discount).plus(shipping);

    const order = await prisma.$transaction(async (tx) => {
      const orderNumber = generateOrderNumber();

      const order = await tx.order.create({
        data: {
          orderNumber,
          userId,
          status: 'PENDING',
          paymentStatus: 'PENDING',
          paymentMethod: 'CASH_ON_DELIVERY',
          subtotal,
          shipping,
          discount,
          total,
          billingAddress: data.billingAddress,
          shippingAddress: data.shippingAddress || data.billingAddress,
          notes: data.notes,
          items: {
            create: cartSummary.items.map(item => ({
              productId: item.productId,
              productName: item.product.name,
              sku: item.product.sku,
              quantity: item.quantity,
              price: item.unitPrice,
              total: new Decimal(item.total),
            })),
          },
        },
        include: { items: true },
      });

      await tx.orderStatusHistory.create({
        data: {
          orderId: order.id,
          status: 'PENDING',
        }
      });

      if (coupon) {
        await tx.coupon.update({
          where: { id: coupon.id },
          data: { usageCount: { increment: 1 } },
        });
      }

      for (const item of cartSummary.items) {
        await tx.product.update({
          where: { id: item.productId },
          data: { stock: { decrement: item.quantity } },
        });
      }

      await tx.cartItem.deleteMany({ where: { cartId: data.cartId } });

      return order;
    });

    // Send order confirmation email (non-blocking)
    emailService.sendOrderConfirmationEmail({
      ...order,
      items: order.items,
      billingAddress: order.billingAddress,
      shippingAddress: order.shippingAddress,
    }).catch(err => console.error('Failed to send order confirmation email:', err));

    // Send admin notification email
    emailService.sendAdminNewOrderNotification({
      ...order,
      items: order.items,
      billingAddress: order.billingAddress,
      shippingAddress: order.shippingAddress,
    }).catch(err => console.error('Failed to send admin notification email:', err));

    // Create admin notification in database
    const billing = order.billingAddress as any;
    notificationService.createNotification({
      title: `New Order #${order.orderNumber}`,
      message: `A new order has been placed by ${billing?.firstName} ${billing?.lastName}.`,
      type: 'SUCCESS',
      link: `/admin/orders/${order.id}`,
    }).catch(err => console.error('Failed to create admin notification:', err));

    return order;
  },

  async getById(id: string, userId?: string, isAdmin = false) {
    const where: any = { id };
    if (!isAdmin && userId) {
      where.userId = userId;
    }

    const order = await prisma.order.findUnique({
      where,
      include: {
        items: {
          include: { product: { select: { id: true, name: true, slug: true, images: true } } },
        },
        statusHistory: {
          orderBy: { createdAt: 'desc' }
        }
      },
    });

    if (!order) throw new AppError(404, 'Order not found');
    return this.formatOrder(order);
  },

  async getUserOrders(userId: string, page = 1, limit = 10) {
    const [orders, total] = await Promise.all([
      prisma.order.findMany({
        where: { userId },
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * limit,
        take: limit,
        include: { items: true },
      }),
      prisma.order.count({ where: { userId } }),
    ]);

    return {
      data: orders.map(this.formatOrder),
      pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
    };
  },

  async getAllOrders(query: {
    page?: number;
    limit?: number;
    status?: string;
    paymentStatus?: string;
    search?: string;
  }) {
    const page = query.page || 1;
    const limit = Math.min(query.limit || 20, 100);
    const where: any = {};

    if (query.status) where.status = query.status;
    if (query.paymentStatus) where.paymentStatus = query.paymentStatus;
    if (query.search) {
      where.OR = [
        { orderNumber: { contains: query.search } },
        { user: { name: { contains: query.search } } },
        { user: { email: { contains: query.search } } },
      ];
    }

    const [orders, total] = await Promise.all([
      prisma.order.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * limit,
        take: limit,
        include: {
          user: { select: { id: true, name: true, email: true } },
          items: true,
        },
      }),
      prisma.order.count({ where }),
    ]);

    return {
      data: orders.map(this.formatOrder),
      pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
    };
  },

  async updateStatus(id: string, status: string) {
    const oldOrder = await prisma.order.findUnique({ where: { id } });
    if (!oldOrder) throw new AppError(404, 'Order not found');

    const validTransitions: Record<string, string[]> = {
      'PENDING': ['CONFIRMED', 'CANCELLED'],
      'CONFIRMED': ['PROCESSING', 'CANCELLED'],
      'PROCESSING': ['SHIPPED'],
      'SHIPPED': ['DELIVERED'],
      'DELIVERED': [],
      'CANCELLED': []
    };

    if (oldOrder.status !== status) {
      const allowed = validTransitions[oldOrder.status] || [];
      if (!allowed.includes(status)) {
        throw new AppError(400, `Invalid status transition from ${oldOrder.status} to ${status}`);
      }
    }

    const order = await prisma.order.update({
      where: { id },
      data: { status: status as any },
      include: { items: true, statusHistory: { orderBy: { createdAt: 'desc' } } },
    });

    if (oldOrder.status !== status) {
      await prisma.orderStatusHistory.create({
        data: {
          orderId: id,
          status,
        }
      });

      emailService.sendOrderStatusEmail({
        ...order,
        items: order.items,
        billingAddress: order.billingAddress,
        shippingAddress: order.shippingAddress,
      }, status).catch(err => console.error('Failed to send status change email:', err));
    }

    return this.formatOrder(order);
  },

  async updatePaymentStatus(id: string, paymentStatus: string, paidAt?: Date) {
    const order = await prisma.order.update({
      where: { id },
      data: { paymentStatus: paymentStatus as any, paidAt: paidAt || new Date() },
      include: { items: true },
    });
    return this.formatOrder(order);
  },

  formatOrder(order: any) {
    return {
      ...order,
      subtotal: Number(order.subtotal),
      shipping: Number(order.shipping),
      discount: Number(order.discount),
      total: Number(order.total),
      items: order.items.map((item: any) => ({
        ...item,
        price: Number(item.price),
        total: Number(item.total),
      })),
    };
  },

  async validateCoupon(code: string, subtotal: number) {
    return couponService.validateCoupon(code, subtotal);
  },

  async getDashboardStats() {
    const [totalProducts, totalOrders, totalCustomers, totalRevenue, pendingOrders, lowStockProducts] = await Promise.all([
      prisma.product.count(),
      prisma.order.count(),
      prisma.user.count({ where: { role: 'CUSTOMER' } }),
      prisma.order.aggregate({ _sum: { total: true }, where: { paymentStatus: 'PAID' } }),
      prisma.order.count({ where: { status: 'PENDING' } }),
      prisma.product.count({ where: { stock: { lte: 10 }, active: true } }),
    ]);

    return {
      totalProducts,
      totalOrders,
      totalCustomers,
      totalRevenue: Number(totalRevenue._sum.total || 0),
      pendingOrders,
      lowStockProducts,
    };
  },
};
