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

export interface OperationResponse {
    status: OperationResponseStatus;
    messages?: Message[];
}

export enum SortOrder {
    'Ascending',
    'Descending',
}

export type Quantity = number;
export type Amount = number;
export type ID = number;
