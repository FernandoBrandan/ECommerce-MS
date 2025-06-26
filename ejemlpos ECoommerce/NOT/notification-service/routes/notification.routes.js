import {Router} from 'express'
import { email } from '../controllers/notification.controller.js';

const router = new Router();

router.post('/send-email', email);

export default router;