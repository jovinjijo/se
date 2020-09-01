import { Req, Res } from '../util/Datatypes';
import { NextFunction, RequestHandler } from 'express';
import { ValidationChain, body } from 'express-validator';
import { Amount, HoldingItem, Stock } from '@se/core';
import { UserStore } from '../models/User';
import { handleValidationErrors } from './Common';
import { authenticate, fillUserData } from '../middlewares/authenticator';

const signupValidations: ValidationChain[] = [
    body('username').isAlphanumeric().isLength({ min: 3 }).trim(),
    body('password').isLength({ min: 8 }),
    body('balance').isFloat({ gt: 0 }),
    body('holdings', 'Invalid structure for ')
        .optional()
        .isArray({ min: 0 })
        .custom((holdings: HoldingItem[]) => {
            holdings.forEach((holding: HoldingItem) => {
                if (!holding.quantity || (holding.quantity && holding.quantity <= 0)) {
                    throw new Error('Quantity has to be greater than 0');
                }
                if (!holding.stock || (holding.stock && !(holding.stock in Stock))) {
                    throw new Error('Stock has to be a valid one');
                }
            });
            return true;
        }),
];

async function signup(req: Req, res: Res, next: NextFunction): Promise<void> {
    const username = req.body.username as string;
    const password = req.body.password as string;
    const balance = req.body.balance as Amount;
    const holdings = req.body.holdings as HoldingItem[];
    try {
        await UserStore.addUser(username, password, balance, holdings);
        return next();
    } catch (ex) {
        return next([ex.message]);
    }
}

const handleSignup: RequestHandler[] = [...signupValidations, handleValidationErrors, signup];

const loginValidations: ValidationChain[] = [
    body('username').isAlphanumeric().isLength({ min: 3 }).trim(),
    body('password').isLength({ min: 8 }),
];

function sendUserData(req: Req, res: Res): void {
    res.json({
        data: req.user,
    });
}

const handleLogin: RequestHandler[] = [
    ...loginValidations,
    handleValidationErrors,
    authenticate,
    fillUserData,
    sendUserData,
];

export { handleSignup, handleLogin, sendUserData };
