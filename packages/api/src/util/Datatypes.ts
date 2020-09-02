import { Request, Response } from 'express';
import { UserStoreItem, UserStoreItemDetails } from '../models/User';
import { ValidationError } from 'express-validator';
import { OrderDetails } from '../models/Order';

export interface ErrorResponseObject {
    errors: string[] | ValidationError[];
}

export interface SuccessResponseObject<T> {
    data: T;
}

export type UserResponse = SuccessResponseObject<UserStoreItemDetails>;

export type OrderResponse = SuccessResponseObject<OrderDetails>;

export interface Req extends Request {
    user?: UserStoreItem;
}

export type Res = Response<ErrorResponseObject | UserResponse | OrderResponse>;

export type Errors = string[] | ValidationError[];
