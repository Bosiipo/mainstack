import {Router} from 'express';
import authRoutes from './auth';
import productRoutes from './product';
import {authorize} from '../middlewares/authorize';

const router = Router();

// No auth required
router.use('/auth', authRoutes);

// Requires auth
router.use('/products', authorize, productRoutes);

export default router;
