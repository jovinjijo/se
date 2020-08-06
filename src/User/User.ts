import { ID, Amount, Stock, Quantity, OperationResponseStatus } from "../util/Datatypes";
import { Wallet } from "./Wallet";
import { HoldingItem, Holding } from "./Holding/Holding";
import { OrderType, Order, OrderStatus } from "../Order/Order";
import { Market } from "../Market/Market";
import { OrderStoreResponse, OrderStore } from "../Order/OrderStore";

export interface IUser {
    id: ID;
    name: string;
    wallet: Wallet;
    holdings: Holding;
    orders: OrderStore;
}

export class User implements IUser {
    id: ID;
    name: string;
    wallet: Wallet;
    holdings: Holding;
    orders: OrderStore;
    static nextId: ID = 1;

    constructor(name: string, balance: Amount, holdings?: HoldingItem[]) {
        this.id = User.nextId++;
        this.name = name;
        this.wallet = new Wallet(balance);
        this.holdings = new Holding(holdings || []);
        this.orders = new OrderStore();
    }

    /**
     * Entry point to place an order
     * @param symbol Symbol to place order on
     * @param type Type of order - Buy / Sell
     * @param quantity Quantity of order
     * @param price Limit price
     */
    placeOrder(symbol: Stock, type: OrderType, quantity: Quantity, price: Amount): OrderStoreResponse {
        if (type === OrderType.Buy) {
            // For Buy Orders
            if (this.wallet.getMargin() > price * quantity) {
                return Market.getInstance().placeOrder(this, symbol, type, quantity, price);
            } else {
                return { status: OperationResponseStatus.Error, messages: [{ message: "Not enough margin to do this operation." }] };
            }
        } else {
            // For Sell Orders
            const currentHolding = this.holdings.getHolding(symbol);
            if (currentHolding && currentHolding >= quantity) {
                return Market.getInstance().placeOrder(this, symbol, type, quantity, price);
            } else {
                return { status: OperationResponseStatus.Error, messages: [{ message: "Not enough holdings to do this operation." }] };
            }
        }
    }

    getOrders(): OrderStore {
        return this.orders;
    }

    /**
     * When an order is updated(fully/partially filled), update Holdings, Wallet and User's OrderStore.
     * //call confirmorder so that the user can see that order has been updated in their orderstore.
     * //for settled order, update user's wallet and holding.
     * @param order Order which has been updated.
     */
    notifyOrderUpdate(order: Order): void {
        if (order.user !== this) {
            throw new Error("Order is not placed by this user.");
        }
        if (order.getStatus() === OrderStatus.Confirmed) {
            this.orders.confirmOrder(order);
        }
        const settlement = order.getLatestSettlement();
        if (order.getOrderType() === OrderType.Buy) {
            this.holdings.addHolding({ stock: order.getSymbol(), quantity: settlement.quantity });
            this.wallet.updateMargin(-settlement.quantity * settlement.price);
        } else if (order.getOrderType() === OrderType.Sell) {
            this.holdings.releaseHolding({ stock: order.getSymbol(), quantity: settlement.quantity });
            this.wallet.updateMargin(settlement.quantity * settlement.price);
        }
    }

    notifyOrderAdd(order: Order): void {
        this.orders.addOrder(order);
    }
}
