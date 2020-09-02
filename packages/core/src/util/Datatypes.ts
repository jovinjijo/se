/**
 * Hardcoded list of symbols
 */
export enum Stock {
    'RIL' = 'RIL',
    'TSLA' = 'TSLA',
    'AMZN' = 'AMZN',
}

export enum OperationResponseStatus {
    'Success',
    'Error',
}

export interface Message {
    message: string;
}

interface OperationSuccessResponse<T> {
    status: OperationResponseStatus.Success;
    messages?: Message[];
    data: T;
}

interface OperationErrorResponse {
    status: OperationResponseStatus.Error;
    messages: Message[];
}

export type OperationResponse<T> = OperationErrorResponse | OperationSuccessResponse<T>;

export enum SortOrder {
    'Ascending',
    'Descending',
}

export type Quantity = number;
export type Amount = number;
export type ID = number;
