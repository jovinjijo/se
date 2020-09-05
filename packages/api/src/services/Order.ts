import { Req, Res, NextFn, ErrorResponse } from '../util/Datatypes';
import { RequestHandler } from 'express';
import { handleValidationErrors } from './Common';
import { Stock, Quantity, Amount, OrderType, OperationResponseStatus } from '@se/core';
import { body, ValidationChain } from 'express-validator';
import { OrderRepository } from '../models/Order';

const placeOrderValidations: ValidationChain[] = [
    body('symbol').custom((stock: Stock) => {
        if (!(stock in Stock)) {
            throw new Error('Stock has to be a valid one');
        }
        return true;
    }),
    body('orderType').custom((orderType: OrderType) => {
        if (!(orderType in OrderType)) {
            throw new Error('Order Type has to be a valid one');
        }
        return true;
    }),
    body('quantity').isInt({ gt: 0 }).toInt(),
    body('price').isFloat({ gt: 0 }).toFloat(),
];

function placeOrder(req: Req, res: Res, next: NextFn): void {
    const symbol = req.body.symbol as Stock;
    const orderType = req.body.orderType as OrderType;
    const quantity = req.body.quantity as Quantity;
    const price = req.body.price as Amount;

    const user = req.user?.user;
    if (!user) {
        return next(new Error('User not logged in'));
    }
    const response = OrderRepository.placeOrder(user, symbol, orderType, quantity, price);
    if (response.status === OperationResponseStatus.Error) {
        return next(
            new ErrorResponse(
                'Error while placing order',
                response.messages?.map((message) => message.message),
            ),
        );
    }
    res.json({
        data: response.data,
    });
}

const handlePlaceOrder: RequestHandler[] = [...placeOrderValidations, handleValidationErrors, placeOrder];

export { handlePlaceOrder };
