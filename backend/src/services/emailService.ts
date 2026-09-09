import nodemailer from 'nodemailer';
import { config } from '../config/index.js';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

interface EmailOptions {
  to: string;
  subject: string;
  html: string;
}

class EmailService {
  private transporter: nodemailer.Transporter | null = null;

  private async getTransporter() {
    if (this.transporter) return this.transporter;

    if (!config.smtp.host || !config.smtp.user || !config.smtp.pass) {
      console.warn('Email service not configured. Emails will be logged to console.');
      return null;
    }

    this.transporter = nodemailer.createTransport({
      host: config.smtp.host,
      port: config.smtp.port,
      secure: config.smtp.port === 465,
      auth: {
        user: config.smtp.user,
        pass: config.smtp.pass,
      },
    });

    return this.transporter;
  }

  async sendEmail(options: EmailOptions) {
    const transporter = await this.getTransporter();

    if (!transporter) {
      console.log('=== EMAIL WOULD BE SENT (not configured) ===');
      console.log('To:', options.to);
      console.log('Subject:', options.subject);
      console.log('HTML:', options.html);
      console.log('===========================================');
      return;
    }

    try {
      const generalSettings = await prisma.generalSettings.findFirst();
      const siteName = generalSettings?.siteName || 'Store';

      await transporter.sendMail({
        from: config.smtp.from || `${siteName} <noreply@industrialedge.com>`,
        to: options.to,
        subject: options.subject,
        html: options.html,
      });
      console.log(`Email sent to ${options.to}: ${options.subject}`);
    } catch (error) {
      console.error('Failed to send email:', error);
      // Don't throw - email failures should not break the main flow
    }
  }

  async sendOrderConfirmationEmail(order: any) {
    const generalSettings = await prisma.generalSettings.findFirst();
    const siteName = generalSettings?.siteName || 'Store';

    const itemsHtml = order.items.map((item: any) => `
      <tr>
        <td style="padding: 10px; border-bottom: 1px solid #eee;">
          <strong>${item.product?.name || item.productName}</strong><br>
          <small>Qty: ${item.quantity}</small>
        </td>
        <td style="padding: 10px; border-bottom: 1px solid #eee; text-align: right;">
          $${(Number(item.price) * item.quantity).toFixed(2)}
        </td>
      </tr>
    `).join('');

    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="background-color: #181246; color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0;">
          <h1 style="margin: 0; font-size: 28px;">${siteName}</h1>
        </div>
        
        <div style="padding: 20px; border: 1px solid #eee; border-top: none; border-radius: 0 0 8px 8px;">
          <h2 style="color: #0E1B2C; margin-top: 0;">Hello ${order.billingAddress?.firstName || 'Customer'},</h2>
          
          <p>Thank you for your order with ${siteName}. Your order has been successfully placed.</p>
          
          <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="margin-top: 0; color: #28A745;">Order Details</h3>
            <p><strong>Order Number:</strong> ${order.orderNumber}</p>
            <p><strong>Order Date:</strong> ${new Date(order.createdAt).toLocaleString()}</p>
            <p><strong>Order Status:</strong> <span style="color: #ffc107; font-weight: bold;">Pending</span></p>
            <p><strong>Payment Method:</strong> Cash on Delivery</p>
          </div>

          <h3 style="color: #0E1B2C;">Order Items</h3>
          <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
            <tbody>
              ${itemsHtml}
            </tbody>
          </table>

          <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <div style="display: flex; justify-content: space-between; padding: 8px 0;">
              <span>Subtotal:</span>
              <span>$${Number(order.subtotal).toFixed(2)}</span>
            </div>
            <div style="display: flex; justify-content: space-between; padding: 8px 0;">
              <span>Shipping:</span>
              <span>${Number(order.shipping) === 0 ? 'Free' : '$' + Number(order.shipping).toFixed(2)}</span>
            </div>
            ${order.discount > 0 ? `
            <div style="display: flex; justify-content: space-between; padding: 8px 0; color: #28A745;">
              <span>Discount:</span>
              <span>-$${Number(order.discount).toFixed(2)}</span>
            </div>` : ''}
            <hr style="border: none; border-top: 1px solid #eee; margin: 15px 0;">
            <div style="display: flex; justify-content: space-between; padding: 8px 0; font-size: 18px; font-weight: bold; color: #0E1B2C;">
              <span>Total:</span>
              <span>$${Number(order.total).toFixed(2)}</span>
            </div>
          </div>

          <h3 style="color: #0E1B2C;">Delivery Information</h3>
          <div style="background: #f8f9fa; padding: 20px; border-radius: 8px;">
            <p style="margin: 5px 0;"><strong>${order.billingAddress?.firstName} ${order.billingAddress?.lastName}</strong></p>
            <p style="margin: 5px 0;">${order.billingAddress?.address}</p>
            <p style="margin: 5px 0;">${order.billingAddress?.city}, ${order.billingAddress?.country} ${order.billingAddress?.postalCode}</p>
            <p style="margin: 5px 0;">Phone: ${order.billingAddress?.phone}</p>
            <p style="margin: 5px 0;">Email: ${order.billingAddress?.email}</p>
          </div>

          <div style="margin-top: 30px; padding: 20px; background: #fff3cd; border: 1px solid #ffeaa7; border-radius: 8px;">
            <p style="margin: 0;"><strong>Payment Method:</strong> Cash on Delivery</p>
            <p style="margin: 10px 0 0;"><strong>Payment will be collected in cash when your order is delivered.</strong></p>
          </div>

          <hr style="border: none; border-top: 1px solid #eee; margin: 30px 0;">
          <p style="color: #666; font-size: 14px; text-align: center;">We will notify you when your order status changes.<br>Thank you for shopping with ${siteName}!</p>
        </div>
      </div>
    `;

    await this.sendEmail({
      to: order.user?.email || order.billingAddress?.email,
      subject: `${siteName} — Order Confirmation #${order.orderNumber}`,
      html,
    });
  }

  async sendOrderStatusEmail(order: any, newStatus: string) {
    const generalSettings = await prisma.generalSettings.findFirst();
    const siteName = generalSettings?.siteName || 'Store';

    const statusColors: Record<string, string> = {
      PROCESSING: '#3b82f6',
      SHIPPED: '#8b5cf6',
      DELIVERED: '#10b981',
      CANCELLED: '#ef4444'
    };

    const statusMessages: Record<string, string> = {
      PROCESSING: 'Your order is now being processed.',
      SHIPPED: 'Good news! Your order has been shipped.',
      DELIVERED: 'Your order has been delivered. Enjoy!',
      CANCELLED: 'Your order has been cancelled.'
    };

    const color = statusColors[newStatus] || '#181246';

    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="background-color: ${color}; color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0;">
          <h1 style="margin: 0; font-size: 28px;">${siteName}</h1>
          <p style="margin: 10px 0 0; opacity: 0.8;">Order Status Update</p>
        </div>
        
        <div style="background: white; padding: 30px; border: 1px solid #eee; border-top: none; border-radius: 0 0 8px 8px;">
          <h2 style="color: #0E1B2C; margin-top: 0;">Hello ${order.billingAddress?.firstName || 'Customer'},</h2>
          
          <p>${statusMessages[newStatus] || `Your order status is now ${newStatus}.`}</p>
          
          <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0; text-align: center;">
            <p style="margin: 0; font-size: 14px; color: #666;">Order Number</p>
            <p style="margin: 5px 0 0; font-size: 24px; font-weight: bold; color: #0E1B2C;">${order.orderNumber}</p>
          </div>

          <p>Order Date: ${new Date(order.createdAt).toLocaleString()}</p>
          <p>Payment Method: Cash on Delivery</p>
          <p>Total Amount: $${Number(order.total).toFixed(2)}</p>

          <div style="margin-top: 30px; padding: 20px; background: #f8f9fa; border-radius: 8px;">
            <h3 style="margin-top: 0;">Delivery Address</h3>
            <p style="margin: 5px 0;">${order.shippingAddress?.firstName} ${order.shippingAddress?.lastName}</p>
            <p style="margin: 5px 0;">${order.shippingAddress?.address}</p>
            <p style="margin: 5px 0;">${order.shippingAddress?.city}, ${order.shippingAddress?.country} ${order.shippingAddress?.postalCode}</p>
            <p style="margin: 5px 0;">Phone: ${order.shippingAddress?.phone}</p>
          </div>

          <hr style="border: none; border-top: 1px solid #eee; margin: 30px 0;">
          <p style="color: #666; font-size: 14px; text-align: center;">Thank you for shopping with ${siteName}!</p>
        </div>
      </div>
    `;

    const subjectLabels: Record<string, string> = {
      PROCESSING: 'Order Processing',
      SHIPPED: 'Order Shipped',
      DELIVERED: 'Order Delivered',
      CANCELLED: 'Order Cancelled'
    };

    await this.sendEmail({
      to: order.user?.email || order.billingAddress?.email,
      subject: `${siteName} — ${subjectLabels[newStatus] || 'Order Update'} #${order.orderNumber}`,
      html,
    });
  }

  async sendAdminNewOrderNotification(order: any) {
    const generalSettings = await prisma.generalSettings.findFirst();
    const siteName = generalSettings?.siteName || 'Store';
    const adminEmail = process.env.ADMIN_EMAIL || 'admin@example.com';

    const itemsHtml = order.items.map((item: any) => `
      <tr>
        <td style="padding: 12px; border-bottom: 1px solid #eee;">${item.productName || item.product?.name}</td>
        <td style="padding: 12px; border-bottom: 1px solid #eee; text-align: center;">${item.quantity}</td>
        <td style="padding: 12px; border-bottom: 1px solid #eee; text-align: right;">$${Number(item.price).toFixed(2)}</td>
        <td style="padding: 12px; border-bottom: 1px solid #eee; text-align: right;">$${(Number(item.price) * item.quantity).toFixed(2)}</td>
      </tr>
    `).join('');

    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
      </head>
      <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="background: #181246; color: white; padding: 30px; text-align: center; border-radius: 8px 8px 0 0;">
          <h1 style="margin: 0; font-size: 28px;">${siteName}</h1>
          <p style="margin: 10px 0 0; opacity: 0.8;">New Order Received</p>
        </div>
        
        <div style="background: white; padding: 30px; border: 1px solid #eee; border-top: none; border-radius: 0 0 8px 8px;">
          <h2 style="color: #181246; margin-top: 0;">New Order #${order.orderNumber}</h2>
          
          <p>A new order has been placed on ${siteName}.</p>
          
          <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <p style="margin: 5px 0;"><strong>Customer:</strong> ${order.billingAddress?.firstName} ${order.billingAddress?.lastName}</p>
            <p style="margin: 5px 0;"><strong>Email:</strong> ${order.billingAddress?.email}</p>
            <p style="margin: 5px 0;"><strong>Phone:</strong> ${order.billingAddress?.phone}</p>
            <p style="margin: 5px 0;"><strong>Date:</strong> ${new Date(order.createdAt).toLocaleString()}</p>
            <p style="margin: 5px 0;"><strong>Payment Method:</strong> Cash on Delivery</p>
            <p style="margin: 5px 0;"><strong>Current Status:</strong> <span style="color: #ffc107; font-weight: bold;">PENDING</span></p>
          </div>

          <h3 style="color: #181246;">Order Items</h3>
          <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
            <thead>
              <tr style="background: #181246; color: white;">
                <th style="padding: 12px; text-align: left;">Product</th>
                <th style="padding: 12px; text-align: center;">Qty</th>
                <th style="padding: 12px; text-align: right;">Price</th>
                <th style="padding: 12px; text-align: right;">Total</th>
              </tr>
            </thead>
            <tbody>
              ${itemsHtml}
            </tbody>
          </table>

          <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <div style="display: flex; justify-content: space-between; padding: 8px 0;">
              <span>Subtotal:</span>
              <span>$${Number(order.subtotal).toFixed(2)}</span>
            </div>
            <div style="display: flex; justify-content: space-between; padding: 8px 0;">
              <span>Shipping:</span>
              <span>${Number(order.shipping) === 0 ? 'Free' : '$' + Number(order.shipping).toFixed(2)}</span>
            </div>
            ${order.discount > 0 ? `
            <div style="display: flex; justify-content: space-between; padding: 8px 0; color: #28A745;">
              <span>Discount:</span>
              <span>-$${Number(order.discount).toFixed(2)}</span>
            </div>` : ''}
            <hr style="border: none; border-top: 1px solid #eee; margin: 15px 0;">
            <div style="display: flex; justify-content: space-between; padding: 8px 0; font-size: 18px; font-weight: bold; color: #0E1B2C;">
              <span>Total:</span>
              <span>$${Number(order.total).toFixed(2)}</span>
            </div>
          </div>

          <hr style="border: none; border-top: 1px solid #eee; margin: 30px 0;">
          <div style="text-align: center;">
            <a href="${config.frontendUrl}/admin/orders/${order.id}" style="display: inline-block; background: #181246; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: 500;">
              View Order in Admin Panel
            </a>
          </div>
        </div>
      </body>
      </html>
    `;

    await this.sendEmail({
      to: adminEmail,
      subject: `${siteName} — New Order #${order.orderNumber}`,
      html,
    });
  }
}

export const emailService = new EmailService();
