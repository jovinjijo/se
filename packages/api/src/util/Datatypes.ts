import { Request, Response, NextFunction } from 'express';
import { UserStoreItem, UserStoreItemDetails } from '../models/User';
import { ValidationError } from 'express-validator';
import { OrderDetails } from '../models/Order';

/**
 * Error class compatible with standard Error class adding functionality for sending multiple error messages.
 */
export class ErrorResponse extends Error {
    errors?: string[] | ValidationError[];

    /**
     * Used when multiple error messages have to be sent to the user.
     * @param message 'message' of standard Error class
     * @param errors For multiple error messages
     */
    constructor(message: string, errors?: string[] | ValidationError[]) {
        super(message);
        if (errors) {
            this.errors = errors;
        }
    }
}

interface SuccessResponseObject<T> {
    data: T;
}

export type UserResponse = SuccessResponseObject<UserStoreItemDetails>;

export type OrderResponse = SuccessResponseObject<OrderDetails>;

export interface Req extends Request {
    user?: UserStoreItem;
}

export type Res = Response<ErrorResponse | UserResponse | OrderResponse>;

export interface NextFn extends Omit<NextFunction, 'err'> {
    (err?: ErrorResponse): void;
}
