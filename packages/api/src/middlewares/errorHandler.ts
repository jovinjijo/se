import { Req, Res, ErrorResponse, NextFn } from '../util/Datatypes';

export function errorHandler(err: ErrorResponse, req: Req, res: Res, next: NextFn): void {
    res.status(403).json({
        name: err.name,
        message: err.message,
        errors: err.errors,
    });
    next();
}
