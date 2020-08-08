import { Order, OrderType, OrderStatus, IOrder } from "./Order";
import { Amount, SortOrder } from "../util/Datatypes";
import { OrderStore, IOrderStore } from "./OrderStore";

export interface IStockOrderStore extends IOrderStore {
    lastTradePrice: Amount;
}

export class StockOrderStore extends OrderStore implements IStockOrderStore {
    lastTradePrice: Amount;

    constructor() {
        super();
        this.lastTradePrice = 0;
    }

    /**
     * Place a new order to the individual stock's store.
     * @param order Details for order to be placed
     */
    createOrder(order: IOrder): Order {
        const newOrder = new Order(order.id, order.type, order.quantity, order.price, order.user, order.symbol);
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
            while (this.placedSellOrders[0] && Order.settlementPossible(order, this.placedSellOrders[0]) && order.getStatus() !== OrderStatus.Confirmed) {
                //Repeat as long as the Sell order buffer has an order which can be settled with the current Buy order.
                this.settleOrders(order, this.placedSellOrders[0]);
            }
        } else {
            //Find matching Buy orders
            while (this.placedBuyOrders[0] && Order.settlementPossible(this.placedBuyOrders[0], order) && order.getStatus() !== OrderStatus.Confirmed) {
                //Repeat as long as the Buy order buffer has an order which can be settled with the current Sell order.
                this.settleOrders(this.placedBuyOrders[0], order);
            }
        }
    }

    /**
     * Sort according to descending order of price.
     * @param orders Array of orders to sort
     * @param priceSortOrder Sorting order of price
     */
    static sortOrders(orders: Order[], priceSortOrder: SortOrder): Order[] {
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
            sell.settleWithOrder(buy);
            this.confirmOrder(sell);
        } else if (sellQuantity > buyQuantity) {
            buy.settleWithOrder(sell);
            this.confirmOrder(buy);
        } else {
            //If the quantities are the same, both orders will get settled.
            buy.settleWithOrder(sell);
            this.confirmOrder(buy);
            this.confirmOrder(sell);
        }
        this.lastTradePrice = sell.getLatestSettlement().price;

        if (buyQuantity > sellQuantity) {
            this.findMatchingOrdersAndSettle(buy);
        } else if (sellQuantity > buyQuantity) {
            this.findMatchingOrdersAndSettle(sell);
        }
    }
}
