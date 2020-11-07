import { Amount } from '../util/Datatypes';

export class Wallet {
    private margin: Amount;

    constructor(margin: Amount) {
        if (margin >= 0) {
            this.margin = margin;
        } else {
            throw new Error("Balance can't be negative.");
        }
    }

    updateMargin(delta: Amount): Amount {
        if (this.margin + delta < 0) {
            throw new Error('Not enough margin to do this operation.');
        } else {
            return (this.margin = this.margin + delta);
        }
    }

    getMargin(): Amount {
        return this.margin;
    }
}
