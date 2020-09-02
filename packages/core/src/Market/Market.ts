import { OrderStoreResponse } from '../Order/OrderStore';
import { Stock, OperationResponse, ID, OperationResponseStatus, Quantity, Amount } from '../util/Datatypes';
import { OrderType } from '../Order/Order';
import { User } from '../User/User';
import { StockOrderStore } from '../Order/StockOrderStore';

export type MarketResponse = OperationResponse<StockOrderStore>;

export class Market {
    nextOrderId: ID;
    orderStore: Map<Stock, StockOrderStore>;
    static instance: Market;

    private constructor() {
        this.nextOrderId = 1;
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

    getOrderStoreForStock(stock: Stock): StockOrderStore | undefined {
        return this.orderStore.get(stock);
    }

    /**
     * Place a new order in the exchange
     * @param user Reference of user who is placing the order
     * @param symbol Symbol for which order is placed
     * @param type Order Type - Buy / Sell
     * @param quantity Quantity of order
     * @param price Limit Price
     */
    placeOrder(user: User, symbol: Stock, type: OrderType, quantity: Quantity, price: Amount): OrderStoreResponse {
        const orderStore = this.getOrderStoreForStock(symbol);
        return orderStore
            ? {
                  data: orderStore.createOrder({
                      id: this.nextOrderId++,
                      price: price,
                      quantity: quantity,
                      type: type,
                      user: user,
                      symbol: symbol,
                  }),
                  status: OperationResponseStatus.Success,
              }
            : {
                  status: OperationResponseStatus.Error,
                  messages: [{ message: "Order Store for Symbol doesn't exist" }],
              };
    }
}
