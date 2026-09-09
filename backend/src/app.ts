import express from 'express';
import path from 'path';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import { config } from './config/index.js';
import { errorHandler, notFoundHandler } from './middleware/errorHandler.js';
import authRoutes from './routes/authRoutes.js';
import cartRoutes from './routes/cartRoutes.js';
import orderRoutes from './routes/orderRoutes.js';
import cmsRoutes from './routes/cmsRoutes.js';
import productRoutes from './routes/productRoutes.js';
import notificationRoutes from './routes/notificationRoutes.js';
import adminRoutes from './routes/adminRoutes.js';
import settingsRoutes from './routes/settingsRoutes.js';
import mediaRoutes from './routes/mediaRoutes.js';
import partnerRoutes from './routes/partnerRoutes.js';
import menuRoutes from './routes/menuRoutes.js';
import homepageSectionRoutes from './routes/homepageSectionRoutes.js';
import collectionRoutes from './routes/collectionRoutes.js';
import { publicTagRouter } from './routes/tagRoutes.js';

const app = express();

app.use(cors({
  origin: config.frontendUrl,
  credentials: true,
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser(config.cookie.secret));

app.use('/api/uploads', express.static(config.upload.dir));

app.get('/api/image-proxy', (req, res) => {
  const filePath = req.query.path as string;
  if (!filePath || filePath.includes('..')) {
    return res.status(403).json({ success: false, message: 'Forbidden' });
  }
  
  const uploadDir = path.join(process.cwd(), config.upload.dir || 'uploads');
  const fullPath = path.join(uploadDir, filePath);
  
  res.sendFile(fullPath, (err) => {
    if (err) {
      res.status(404).json({ success: false, message: 'Image not found' });
    }
  });
});

app.get('/api/health', (req, res) => {
  res.json({ success: true, message: 'API is healthy', timestamp: new Date().toISOString() });
});

app.use('/api/auth', authRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api', cmsRoutes);
app.use('/api/settings', settingsRoutes);
app.use('/api/media', mediaRoutes);
app.use('/api/partners', partnerRoutes);
app.use('/api/menus', menuRoutes);
app.use('/api/homepage-sections', homepageSectionRoutes);
app.use('/api/products', productRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/collections', collectionRoutes);
app.use('/api/tags', publicTagRouter);
app.use('/api/admin', adminRoutes);

app.use(notFoundHandler);
app.use(errorHandler);

export default app;
