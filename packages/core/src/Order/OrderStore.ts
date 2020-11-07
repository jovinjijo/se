import { Order, OrderType, OrderStatus } from './Order';
import { OperationResponse, Stock, Quantity } from '../util/Datatypes';

export type OrderStoreResponse = OperationResponse<Order>;

export interface IOrderStore {
    placedBuyOrders: Order[];
    placedSellOrders: Order[];
    confirmedOrders: Order[];
}

export class OrderStore {
    protected placedBuyOrders: Order[];
    protected placedSellOrders: Order[];
    protected confirmedOrders: Order[];

    constructor() {
        this.placedBuyOrders = [];
        this.placedSellOrders = [];
        this.confirmedOrders = [];
    }

    /**
     * Moves the given order to the confirmed orders buffer.
     * @param order Order to confirm
     */
    confirmOrder(order: Order): void {
        if (!this.placedBuyOrders.includes(order) && !this.placedSellOrders.includes(order)) {
            throw new Error("Order doesn't exist in the store");
        }
        if (this.confirmedOrders.includes(order)) {
            throw new Error('Order is already confirmed.');
        }
        let index: number;
        if (order.getOrderType() === OrderType.Buy && (index = this.placedBuyOrders.indexOf(order)) !== -1) {
            this.placedBuyOrders.splice(index, 1);
            this.confirmedOrders.push(order);
        } else if (order.getOrderType() === OrderType.Sell && (index = this.placedSellOrders.indexOf(order)) !== -1) {
            this.placedSellOrders.splice(index, 1);
            this.confirmedOrders.push(order);
        } else throw new Error('Order not found in corresponding buffer.');
    }

    /**
     * Adds the given order to the corresponding orders buffer.
     * @param order Order to be added
     */
    addOrder(order: Order): void {
        if (
            this.placedBuyOrders.includes(order) ||
            this.placedSellOrders.includes(order) ||
            this.confirmedOrders.includes(order)
        ) {
            throw new Error('Order already exists in store');
        }
        if (order.getStatus() === OrderStatus.Confirmed) {
            // For confirmed orders, move to confirmedOrders buffer.
            this.confirmedOrders.push(order);
        } else if (order.getOrderType() === OrderType.Buy) {
            this.placedBuyOrders.push(order);
        } else {
            this.placedSellOrders.push(order);
        }
    }

    getSellOrdersQuantityToSettle(stock: Stock): Quantity {
        return this.placedSellOrders
            .filter((item) => item.getSymbol() === stock)
            .reduce((acc, item) => acc + item.getQuantityToSettle(), 0);
    }

    getData(): IOrderStore {
        return {
            placedBuyOrders: this.placedBuyOrders,
            placedSellOrders: this.placedSellOrders,
            confirmedOrders: this.confirmedOrders,
        };
    }
}
