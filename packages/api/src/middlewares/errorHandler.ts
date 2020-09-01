import { NextFunction } from 'express';
import { Req, Res, Errors } from '../util/Datatypes';

export function errorHandler(err: Errors, req: Req, res: Res, next: NextFunction): void {
    res.status(403).json({
        errors: err,
    });
}
