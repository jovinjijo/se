import { Req, Res, NextFn } from '../util/Datatypes';
import { RequestHandler } from 'express';
import { ValidationChain, body } from 'express-validator';
import { Amount, Stock, HoldingsData } from '@se/core';
import { UserStore } from '../models/User';
import { handleValidationErrors } from './Common';
import { authenticate, fillUserData } from '../middlewares/authenticator';

const signupValidations: ValidationChain[] = [
    body('username', 'Username has to be alphanumeric and atleast 3 characters')
        .isAlphanumeric()
        .isLength({ min: 3 })
        .trim(),
    body('password', 'Password has to be atleast 3 characters').isString().isLength({ min: 8 }),
    body('balance', 'Balance has to be a valid amount.').isFloat({ min: 0 }).toFloat(),
    body('holdings', 'Holdings has to be of format { "TSLA": "100", "AMZN": "123" }')
        .optional()
        .custom((holdings) => {
            if (typeof holdings !== 'object') {
                return false;
            }
            return true;
        })
        .bail()
        .customSanitizer((holdings) => {
            Object.entries(holdings).forEach(([stock, quantity]) => {
                holdings[stock] = parseInt(quantity as string);
            });
            return holdings;
        })
        .custom((holdings: HoldingsData) => {
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

async function signup(req: Req, res: Res, next: NextFn): Promise<void> {
    const username = req.body.username as string;
    const password = req.body.password as string;
    const balance = req.body.balance as Amount;
    const holdings = req.body.holdings as HoldingsData;
    try {
        await UserStore.addUser(username, password, balance, holdings);
        return next();
    } catch (ex) {
        return next(ex);
    }
}

const handleSignup: RequestHandler[] = [...signupValidations, handleValidationErrors, signup];

const loginValidations: ValidationChain[] = [
    body('username', 'Invalid username').isAlphanumeric().isLength({ min: 3 }).trim(),
    body('password', 'Invalid password').isLength({ min: 8 }),
];

function sendUserData(req: Req, res: Res, next: NextFn): void {
    if (req.user) {
        res.json({
            data: UserStore.getUserStoreItemDetails(req.user),
        });
    } else {
        next(new Error('Not logged in'));
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
