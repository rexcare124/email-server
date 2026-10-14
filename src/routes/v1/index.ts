import { Router } from 'express';
import emailRoutes from './email.routes.js';

const router: Router = Router();

router.use('/email', emailRoutes);

export default router;
