import { Quantity, ID, Amount, Stock } from '../util/Datatypes';
import { User } from '../User/User';

export enum OrderType {
    'Buy' = 'Buy',
    'Sell' = 'Sell',
}

export enum OrderStatus {
    'Placed' = 'Placed',
    'PartiallyFilled' = 'PartiallyFilled',
    'Confirmed' = 'Confirmed',
}

export interface IOrder {
    id: ID;
    time?: Date;
    type: OrderType;
    quantity: Quantity;
    price: Amount;
    user: User;
    symbol: Stock;
}

export interface SettlementDetails {
    order: Order;
    quantity: Quantity;
    time: Date;
    price: Amount;
}

// export enum orderType {
//     "Market",
//     "Limit",
//     "SL",
//     "SL-M"
// }

export class Order implements IOrder {
    id: ID;
    time: Date;
    type: OrderType;
    quantity: Quantity;
    price: Amount;
    status: OrderStatus;
    symbol: Stock;
    user: User;
    settledBy: SettlementDetails[];

    constructor(id: ID, type: OrderType, quantity: Quantity, price: Amount, user: User, symbol: Stock) {
        if (quantity <= 0) {
            throw new Error("Quantity can't be less than 1.");
        }
        if (price <= 0) {
            throw new Error('Price should be more than 0.');
        }
        this.id = id;
        this.quantity = quantity;
        this.price = price;
        this.type = type;
        this.user = user;
        this.symbol = symbol;
        this.time = new Date();
        this.status = OrderStatus.Placed;
        this.settledBy = [];
    }

    getTime(): Date {
        return this.time;
    }

    getType(): OrderType {
        return this.type;
    }

    getQuantity(): number {
        return this.quantity;
    }

    getPrice(): number {
        return this.price;
    }

    getOrderType(): OrderType {
        return this.type;
    }

    getId(): ID {
        return this.id;
    }

    getStatus(): OrderStatus {
        return this.status;
    }

    getSymbol(): Stock {
        return this.symbol;
    }

    getLatestSettlement(): SettlementDetails {
        const settledBy = this.settledBy;
        if (settledBy.length === 0) {
            throw new Error('No settlement details available');
        }
        return settledBy[settledBy.length - 1];
    }

    /**
     * Settled time of a confirmed order would be the time of the last order in the settledBy array.
     */
    getSettledTime(): Date {
        if (this.status === OrderStatus.Confirmed && this.settledBy.length > 0) {
            return this.settledBy[this.settledBy.length - 1].time;
        }
        throw new Error('Order not confirmed');
    }

    /**
     * If an order is confirmed, return the average settled price of the order by checking the settledBy array.
     */
    getAvgSettledPrice(): Amount {
        if (this.status === OrderStatus.Confirmed) {
            return this.getAmountSettled() / this.quantity;
        }
        throw new Error('Order not confirmed');
    }

    getAmountSettled(): Amount {
        return this.settledBy.reduce((acc, settlement) => acc + settlement.price * settlement.quantity, 0);
    }

    getQuantitySettled(): Quantity {
        return this.settledBy.reduce((a, b) => a + b.quantity, 0);
    }

    getQuantityToSettle(): Quantity {
        return this.quantity - this.getQuantitySettled();
    }

    /**
     * Allow Order Status change from Placed -> PartiallyFilled or Confirmed
     *                                PartiallyFilled -> Confirmed
     * @param status New status
     */
    setStatus(status: OrderStatus): void {
        if (
            (this.status === OrderStatus.Placed &&
                (status === OrderStatus.Confirmed || status === OrderStatus.PartiallyFilled)) ||
            (this.status === OrderStatus.PartiallyFilled && status === OrderStatus.Confirmed)
        ) {
            this.status = status;
        } else throw new Error(`Status Change from ${this.status} to ${status} not allowed.`);
    }
}
