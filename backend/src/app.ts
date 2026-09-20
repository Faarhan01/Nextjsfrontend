import express from 'express';
import cors from 'cors';
import storeRoutes from './routes/store.ts';
import { errorHandler } from './middleware/errorHandler.ts';
import { optionalAuth } from './middleware/authMiddleware.ts';
import { getSyncStatus, performSyncAction } from './controllers/syncController.ts';

const app = express();
const router = express.Router();

app.use(cors({
  origin: true,
  credentials: true
}));
app.use(express.json());

app.use(optionalAuth);
app.use('/store', storeRoutes);
app.use('/api', storeRoutes);

app.get('/health', (_req, res) => {
  res.json({ status: 'healthy', timestamp: Date.now() });
});

app.use(errorHandler);

const PORT = process.env.PORT || 9001;

export { app, router, PORT };
export default router;

if (process.argv[1] && import.meta.url.endsWith(process.argv[1].replace(/\\/g, '/'))) {
  app.listen(PORT, () => {
    console.log(`Backend server running on http://localhost:${PORT}`);
  });
}
