import { Stock, Quantity } from "../../util/Datatypes";

export interface HoldingItem {
    stock: Stock;
    quantity: Quantity;
}

export class Holding {
    holdings: Map<Stock, Quantity>;

    constructor(holdings: HoldingItem[]) {
        this.holdings = new Map<Stock, Quantity>();
        holdings.forEach((item) => {
            if (item.quantity > 0) {
                this.holdings.set(item.stock, item.quantity);
            } else {
                throw new Error("Quantity can't be less than 1.");
            }
        });
    }

    getHoldings(): HoldingItem[] {
        const holdings: HoldingItem[] = [];
        this.holdings.forEach((v, k) => {
            holdings.push({ stock: k, quantity: v });
        });
        return holdings;
    }

    getHolding(stock: Stock): Quantity | undefined {
        return this.holdings.get(stock);
    }

    addHolding(item: HoldingItem): void {
        if (item.quantity <= 0) {
            throw new Error("Quantity can't be less than 1");
        }
        const currentQuantity: Quantity = this.holdings.get(item.stock) || 0;
        this.holdings.set(item.stock, currentQuantity + item.quantity);
    }

    releaseHolding(item: HoldingItem): void {
        if (item.quantity <= 0) {
            throw new Error("Quantity can't be less than 1");
        }
        const currentQuantity: Quantity = this.holdings.get(item.stock) || 0;
        if (currentQuantity < item.quantity) {
            throw new Error("For the given stock, holdings not available or available holdings less than the quantity requested to be released.");
        }
        this.holdings.set(item.stock, currentQuantity - item.quantity);
    }
}
