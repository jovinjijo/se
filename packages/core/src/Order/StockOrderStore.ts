import { Order, OrderType, OrderStatus, OrderInput, AdditionalOrderType } from './Order';
import { Amount, SortOrder } from '../util/Datatypes';
import { OrderStore } from './OrderStore';
import { OrderMatcher } from './OrderMatcher';
import { Market } from '../Market/Market';

export class StockOrderStore extends OrderStore {
    private lastTradePrice: Amount;

    constructor(lastTradePrice?: Amount) {
        super();
        this.lastTradePrice = lastTradePrice || 0;
    }

    /**
     * Place a new order to the individual stock's store.
     * @param order Details for order to be placed
     */
    createOrder(order: OrderInput): Order {
        const newOrder = new Order(order);
        this.addOrder(newOrder);
        newOrder.user.notifyOrderAdd(newOrder);
        this.findMatchingOrdersAndSettle(newOrder);
        return newOrder;
    }

    /**
     * Main logic to match orders.
     * @param order New order to be placed
     */
    private findMatchingOrdersAndSettle(order: Order): void {
        if (order.getOrderType() === OrderType.Buy) {
            //Find matching Sell orders
            while (
                this.placedSellOrders[0] &&
                OrderMatcher.buySettlesSell(order, this.placedSellOrders[0]) &&
                order.getStatus() !== OrderStatus.Confirmed
            ) {
                //Repeat as long as the Sell order buffer has an order which can be settled with the current Buy order.
                this.settleOrders(order, this.placedSellOrders[0]);
            }
        } else {
            //Find matching Buy orders
            while (
                this.placedBuyOrders[0] &&
                OrderMatcher.buySettlesSell(this.placedBuyOrders[0], order) &&
                order.getStatus() !== OrderStatus.Confirmed
            ) {
                //Repeat as long as the Buy order buffer has an order which can be settled with the current Sell order.
                this.settleOrders(this.placedBuyOrders[0], order);
            }
        }
    }

    /**
     * Sort according to price for limit orders. Keep Market orders at the front of the queue.
     * Individual groups(Market orders, Limit orders with same limit price) in ascending order according to time.
     * @param orders Array of orders to sort
     * @param priceSortOrder Sorting order of price
     */
    private static sortOrders(orders: Order[], priceSortOrder: SortOrder): Order[] {
        orders.sort((a, b) => {
            if (
                a.getAdditionalOrderType() === AdditionalOrderType.Market &&
                b.getAdditionalOrderType() === AdditionalOrderType.Limit
            ) {
                return -1;
            }
            if (
                a.getAdditionalOrderType() === AdditionalOrderType.Limit &&
                b.getAdditionalOrderType() === AdditionalOrderType.Market
            ) {
                return 1;
            }
            return 0;
        });
        if (priceSortOrder === SortOrder.Ascending) {
            return orders.sort((a, b) => a.getPrice() - b.getPrice());
        } else {
            return orders.sort((a, b) => b.getPrice() - a.getPrice());
        }
    }

    /**
     * Override OrderStore's addOrder to keep the order buffer always sorted.
     * @param order Order to add to the store.
     */
    addOrder(order: Order): void {
        super.addOrder(order);
        if (order.getOrderType() === OrderType.Buy) {
            StockOrderStore.sortOrders(this.placedBuyOrders, SortOrder.Descending);
        } else {
            StockOrderStore.sortOrders(this.placedSellOrders, SortOrder.Ascending);
        }
    }

    /**
     * Settle a buy order with a sell order (partially/fully)
     * Precondition : Buy order's bid price is >= sell order's ask price.
     * @param buy Buy order
     * @param sell Sell order
     */
    private settleOrders(buy: Order, sell: Order): void {
        const buyQuantity = buy.getQuantityToSettle();
        const sellQuantity = sell.getQuantityToSettle();
        /**
         * Atleast one order would get fully settled.
         * Which order gets fully settled, depends on the quantity left to be filled for each order.
         * Once an order is fully settled, call confirmOrder for the settled order so that the buffers are updated.
         * Also, there might be a possibility that the other order could be filled with another order in the queue.
         * So call findMatchingOrdersAndSettle on the other order.
         */
        if (buyQuantity > sellQuantity) {
            OrderMatcher.settleOrders(sell, buy, this.lastTradePrice);
            this.confirmOrder(sell);
        } else if (sellQuantity > buyQuantity) {
            OrderMatcher.settleOrders(buy, sell, this.lastTradePrice);
            this.confirmOrder(buy);
        } else {
            //If the quantities are the same, both orders will get settled.
            OrderMatcher.settleOrders(buy, sell, this.lastTradePrice);
            this.confirmOrder(buy);
            this.confirmOrder(sell);
        }

        const sellLatestSettlement = sell.getLatestSettlement();
        if (this.lastTradePrice !== sellLatestSettlement.price) {
            this.lastTradePrice = sellLatestSettlement.price;
            Market.getInstance()
                .getNotification()
                ?.notifyLtpUpdate(sell.getSymbol(), this.lastTradePrice, sellLatestSettlement.time);
        }

        if (buyQuantity > sellQuantity) {
            this.findMatchingOrdersAndSettle(buy);
        } else if (sellQuantity > buyQuantity) {
            this.findMatchingOrdersAndSettle(sell);
        }
    }

    getMarginRequired(order: OrderInput): Amount {
        // As of now, short selling is not allowed
        if (order.type === OrderType.Sell) {
            return 0;
        }
        if (order.additionalType === AdditionalOrderType.Limit) {
            // For Limit Orders
            return order.price * order.quantity;
        } else {
            // For Market Orders
            // TODO : Better algorithm return the price required to settle order.quantity quantity using this.placedSellOrders
            return this.lastTradePrice * order.quantity;
        }
    }

    getLtp(): Amount {
        return this.lastTradePrice;
    }
}
