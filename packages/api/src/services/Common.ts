import { validationResult } from 'express-validator';
import { Req, Res, ErrorResponse, NextFn } from '../util/Datatypes';

function handleValidationErrors(req: Req, res: Res, next: NextFn): void {
    const validationErrors = validationResult(req);
    if (!validationErrors.isEmpty()) {
        return next(new ErrorResponse('Validation Error', validationErrors.array()));
    }
    return next();
}

export { handleValidationErrors };
