import { NextFunction } from 'express';
import { validationResult } from 'express-validator';
import { Req, Res } from '../util/Datatypes';

function handleValidationErrors(req: Req, res: Res, next: NextFunction): void {
    const validationErrors = validationResult(req);
    if (!validationErrors.isEmpty()) {
        return next(validationErrors.array());
    }
    return next();
}

export { handleValidationErrors };
