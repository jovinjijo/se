import { Router, Request, Response } from 'express';
import { body, validationResult } from 'express-validator';
import { HoldingItem, Stock, Amount } from '@se/core';
import { UserStore } from '../../models/User';

const router = Router();

router.post(
    '/user',
    [
        body('name').isString(),
        body('balance').isFloat({ gt: 0 }),
        body('holdings', 'Invalid structure for ')
            .optional()
            .isArray({ min: 0 })
            .custom((holdings) => {
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
    ],
    function (req: Request, res: Response) {
        const validationErrors = validationResult(req);
        if (!validationErrors.isEmpty()) {
            return res.status(400).json({ errors: validationErrors.array() });
        }
        const name = req.body.name as string;
        const balance = req.body.balance as Amount;
        const holdings = req.body.holdings as HoldingItem[];
        res.json({
            id: UserStore.addUser(name, balance, holdings),
        });
        //TODO : Integrate with passport
    },
);

router.get('/login', async function (req, res) {
    res.json({
        api: 'login',
    });
});

export const User = router;
