import app from './app.js';
import mongoose from 'mongoose';
import { config } from './app/config/index.js';
import { Server } from 'http';
import seedSuperAdmin from './app/DB/index.js';

let server: Server;

const startServer = async () => {
  try {
    await mongoose.connect(config.databaseUrl as string);
    seedSuperAdmin();
    server = app.listen(config.port, () => {
      console.log(`the server is running on PORT ${config.port}`);
    });
  } catch (error) {
    console.error('Failed to connect to MongoDB:', error);
    process.exit(1); // exit process if DB connection fails
  }
};

startServer();

process.on('unhandledRejection', (reason) => {
  console.error('💥 Unhandled Promise Rejection:', reason);

  if (server) {
    server.close(() => {
      process.exit(1);
    });
  } else {
    process.exit(1);
  }
});

process.on('uncaughtException', (error) => {
  console.error('💥 Uncaught Exception:', error);
  process.exit(1);
});
