import { Request, Response } from 'express';
import { UserStoreItem } from '../models/User';
import { ValidationError } from 'express-validator';

export interface ResponseObject {
    errors?: string[] | ValidationError[];
    data?: UserStoreItem;
}

export interface Req extends Request {
    user?: UserStoreItem;
}

export type Res = Response<ResponseObject>;

export type Errors = string[] | ValidationError[];
