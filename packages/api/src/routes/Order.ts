import { Router } from 'express';
import { isAuthenticated } from '../middlewares/authenticator';
import { handlePlaceOrder } from '../services/Order';

const router = Router();

router.post('/place', isAuthenticated, handlePlaceOrder);

export const Order = router;
