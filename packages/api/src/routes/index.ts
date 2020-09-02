import express from 'express';
import { User as user } from './User';
import { Order as order } from './Order';

const router = express.Router();

router.use('/user', user);
router.use('/order', order);

export default router;
