import { ID, Amount, Stock, Quantity, OperationResponseStatus } from '../util/Datatypes';
import { Wallet } from './Wallet';
import { Holding, HoldingsData } from './Holding/Holding';
import { OrderType, Order, OrderStatus, AdditionalOrderType, OrderInput } from '../Order/Order';
import { Market } from '../Market/Market';
import { OrderStoreResponse, OrderStore } from '../Order/OrderStore';

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

    constructor(name: string, balance: Amount, holdings?: HoldingsData) {
        this.id = User.nextId++;
        this.name = name;
        this.wallet = new Wallet(balance);
        this.holdings = new Holding(holdings || {});
        this.orders = new OrderStore();
    }
    public placeOrder(
        symbol: Stock,
        type: OrderType,
        additionalType: AdditionalOrderType.Limit,
        quantity: Quantity,
        price: Amount,
    ): OrderStoreResponse;

    public placeOrder(
        symbol: Stock,
        type: OrderType,
        additionalType: AdditionalOrderType.Market,
        quantity: Quantity,
    ): OrderStoreResponse;

    public placeOrder(
        symbol: Stock,
        type: OrderType,
        additionalType: AdditionalOrderType,
        quantity: Quantity,
        price?: Amount,
    ): OrderStoreResponse {
        let order: OrderInput;
        if (additionalType === AdditionalOrderType.Market) {
            order = {
                quantity: quantity,
                symbol: symbol,
                type: type,
                additionalType: AdditionalOrderType.Market,
                user: this,
            };
        } else {
            order = {
                quantity: quantity,
                symbol: symbol,
                type: type,
                additionalType: AdditionalOrderType.Limit,
                user: this,
                price: price || 0,
            };
        }
        try {
            this.simulatePlaceOrder(order);
            return { data: Market.getInstance().placeOrder(order), status: OperationResponseStatus.Success };
        } catch (err) {
            return { status: OperationResponseStatus.Error, messages: [{ message: err.message }] };
        }
    }

    private simulatePlaceOrder(order: OrderInput): boolean {
        if (order.type === OrderType.Buy) {
            // For Buy Orders
            const marginRequired = Market.getInstance().getMarginRequired(order);
            if (this.wallet.getMargin() < marginRequired) {
                throw new Error('Not enough margin to do this operation');
            }
        } else {
            // For Sell Orders
            if (
                this.holdings.getHolding(order.symbol) <
                order.quantity + this.orders.getSellOrdersQuantityToSettle(order.symbol)
            ) {
                throw new Error('Not enough holdings to do this operation');
            }
        }
        return true;
    }

    getOrders(): OrderStore {
        return this.orders;
    }

    /**
     * When an order is updated(fully/partially filled), update Holdings, Wallet and User's OrderStore.
     * Call confirmorder so that the user can see that order has been updated in their orderstore.
     * Update user's wallet and holding.
     * @param order Order which has been updated.
     */
    notifyOrderUpdate(order: Order): void {
        if (order.user !== this) {
            throw new Error('Order is not placed by this user.');
        }
        const orderType = order.getOrderType();
        if (order.getStatus() === OrderStatus.Confirmed) {
            this.orders.confirmOrder(order);
            if (orderType === OrderType.Buy) {
                this.wallet.updateMargin(order.getQuantity() * order.getPrice() - order.getAmountSettled());
            }
        }
        const settlement = order.getLatestSettlement();
        if (orderType === OrderType.Buy) {
            this.holdings.addHolding({ stock: order.getSymbol(), quantity: settlement.quantity });
        } else if (orderType === OrderType.Sell) {
            this.holdings.releaseHolding({ stock: order.getSymbol(), quantity: settlement.quantity });
            this.wallet.updateMargin(settlement.quantity * settlement.price);
        }
        Market.getInstance().notification?.notifyOrderUpdate(this, order);
    }

    /**
     * When an order is added to the queue, this function is called.
     * @param order Order which is added.
     */
    notifyOrderAdd(order: Order): void {
        this.orders.addOrder(order);
        if (order.getOrderType() === OrderType.Buy) {
            this.wallet.updateMargin(-order.getQuantity() * order.getPrice());
        }
        Market.getInstance().notification?.notifyOrderUpdate(this, order);
    }
}
