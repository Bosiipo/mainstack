import {Router} from 'express';
import {AuthController} from '../controllers/auth.controller';

export const router = Router();
const authController = new AuthController();

router.post('/', authController.getToken);

export default router;
