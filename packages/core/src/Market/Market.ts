import { Stock, OperationResponse, ID, OperationResponseStatus, Amount } from '../util/Datatypes';
import { StockOrderStore } from '../Order/StockOrderStore';
import { OrderInput, Order } from '../Order/Order';

export type MarketResponse = OperationResponse<StockOrderStore>;

export class Market {
    static nextOrderId: ID = 1;
    orderStore: Map<Stock, StockOrderStore>;
    static instance: Market;

    private constructor() {
        this.orderStore = new Map<Stock, StockOrderStore>();
    }

    static getInstance(): Market {
        if (!Market.instance) {
            Market.instance = new Market();
        }
        return Market.instance;
    }

    /**
     * Creates an order store for a given Symbol.
     * @param stock Symbol for which a store should be added
     */
    addOrderStore(stock: Stock): MarketResponse {
        const orderStore = this.orderStore.get(stock);
        if (orderStore) {
            return {
                status: OperationResponseStatus.Error,
                messages: [{ message: 'OrderStore already exists for stock.' }],
            };
        } else {
            const orderStore = new StockOrderStore();
            this.orderStore.set(stock, orderStore);
            return {
                data: orderStore,
                status: OperationResponseStatus.Success,
            };
        }
    }

    getOrderStoreForStock(stock: Stock): StockOrderStore {
        const orderStore = this.orderStore.get(stock);
        if (orderStore) {
            return orderStore;
        }
        throw new Error("Order Store for Symbol doesn't exist");
    }

    /**
     * Place a new order in the exchange
     * @param order Details of order
     */
    placeOrder(order: OrderInput): Order {
        return this.getOrderStoreForStock(order.symbol).createOrder(order);
    }

    getMarginRequired(order: OrderInput): Amount {
        return this.getOrderStoreForStock(order.symbol).getMarginRequired(order);
    }

    static getNextOrderId(): ID {
        return this.nextOrderId++;
    }
}
