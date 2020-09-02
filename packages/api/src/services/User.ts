import { Req, Res } from '../util/Datatypes';
import { NextFunction, RequestHandler } from 'express';
import { ValidationChain, body } from 'express-validator';
import { Amount, Stock, HoldingsData } from '@se/core';
import { UserStore } from '../models/User';
import { handleValidationErrors } from './Common';
import { authenticate, fillUserData } from '../middlewares/authenticator';

const signupValidations: ValidationChain[] = [
    body('username').isAlphanumeric().isLength({ min: 3 }).trim(),
    body('password').isLength({ min: 8 }),
    body('balance').isFloat({ gt: 0 }),
    body('holdings')
        .optional()
        .custom((holdings: HoldingsData) => {
            if (typeof holdings !== 'object') {
                throw new Error('Object expected');
            }
            Object.entries(holdings).forEach(([stock, quantity]) => {
                if (!quantity || (quantity && quantity <= 0)) {
                    throw new Error('Quantity has to be greater than 0');
                }
                if (!stock || (stock && !(stock in Stock))) {
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
    const holdings = req.body.holdings as HoldingsData;
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

function sendUserData(req: Req, res: Res, next: NextFunction): void {
    if (req.user) {
        res.json({
            data: UserStore.getUserStoreItemDetails(req.user),
        });
    } else {
        next(['Not logged in']);
    }
}

const handleLogin: RequestHandler[] = [
    ...loginValidations,
    handleValidationErrors,
    authenticate,
    fillUserData,
    sendUserData,
];

export { handleSignup, handleLogin, sendUserData };
