import { Router } from 'express';
import { isAuthenticated } from '../../middlewares/authenticator';
import { handleSignup, handleLogin, sendUserData } from '../../services/User';

const router = Router();

router.post('/signup', handleSignup, handleLogin);

router.post('/login', handleLogin);

router.get('/check', isAuthenticated, sendUserData);

export const User = router;
