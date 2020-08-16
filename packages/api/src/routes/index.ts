import express from 'express';
import { User as user } from './User/User';

const router = express.Router();
router.use('/user', user);

export default router;
