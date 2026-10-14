import { Router } from 'express';
import v1Routes from './v1/index.js';

const router: Router = Router();

router.get('/health', (_req, res) => {
  res.json({ success: true, status: 'ok' });
});
router.use('/v1', v1Routes);

export default router;
