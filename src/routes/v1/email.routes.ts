import { Router } from 'express';
import { sendWithBrevo, sendWithResend } from '../../controllers/email.controller.js';

const router: Router = Router();

router.post('/brevo', sendWithBrevo);
router.post('/resend', sendWithResend);

export default router;
