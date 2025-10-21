import express, { Application, Request, Response } from 'express';
import cors from 'cors';
import notFound from './app/middlewares/notFound.js';
import globalErrorHandler from './app/middlewares/globalErrorHandler.js';
import router from './app/routes/index.js';
import cookieParser from 'cookie-parser';
const app: Application = express();

// middleware
app.use(cors({ origin: ['http://localhost:3000'], credentials: true }));
app.use(express.json());
// ✅ Use cookie-parser middleware
app.use(cookieParser());

app.get('/', async (req: Request, res: Response) => {
  res.send('Hello World!');
});

// student routes 👇
app.use('/api/v1', router);

app.use(notFound);
app.use(globalErrorHandler);
export default app;
