import app from './app.js';
import { config } from './config/index.js';
import { prisma } from './config/database.js';

const startServer = async () => {
  try {
    await prisma.$connect();
    console.log('Database connected');

    const server = app.listen(config.port, '0.0.0.0', () => {
      console.log(`Server running on port ${config.port} in ${config.nodeEnv} mode`);
      console.log(`API URL: ${config.apiUrl}`);
      console.log(`Frontend URL: ${config.frontendUrl}`);
    });

    server.on('error', (err) => {
      console.error('Server error:', err);
    });

    server.on('listening', () => {
      console.log('Server is listening on port', config.port);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

process.on('SIGINT', async () => {
  await prisma.$disconnect();
  process.exit(0);
});

process.on('SIGTERM', async () => {
  await prisma.$disconnect();
  process.exit(0);
});

startServer();
