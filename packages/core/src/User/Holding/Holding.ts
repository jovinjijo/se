import { Stock, Quantity } from '../../util/Datatypes';

export type HoldingsData = Partial<Record<Stock, Quantity>>;

export interface HoldingItem {
    stock: Stock;
    quantity: Quantity;
}

export class Holding {
    holdings: HoldingsData;

    constructor(holdings: HoldingsData) {
        this.holdings = holdings;
    }

    getHoldings(): HoldingsData {
        return this.holdings;
    }

    getHolding(stock: Stock): Quantity {
        const holding = this.holdings[stock];
        if (holding) {
            return holding;
        }
        throw new Error('Holding not available');
    }

    addHolding(item: HoldingItem): void {
        if (item.quantity <= 0) {
            throw new Error("Quantity can't be less than 1");
        }
        const currentQuantity: Quantity = this.holdings[item.stock] || 0;
        this.holdings[item.stock] = currentQuantity + item.quantity;
    }

    releaseHolding(item: HoldingItem): void {
        if (item.quantity <= 0) {
            throw new Error("Quantity can't be less than 1");
        }
        const currentQuantity: Quantity = this.holdings[item.stock] || 0;
        if (currentQuantity < item.quantity) {
            throw new Error(
                'For the given stock, holdings not available or available holdings less than the quantity requested to be released.',
            );
        }
        this.holdings[item.stock] = currentQuantity - item.quantity;
    }
}
