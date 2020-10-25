import { OrderStatus, OrderType, Order, AdditionalOrderType } from './Order';
import { Amount } from '../util/Datatypes';

class OrderMatcher {
    /**
     * Checks if a Buy Sell pair can be settled.
     * Does a simulation and checks if the new settlement is added, if both orders' limit prices are respected.
     * @param buy Buy order
     * @param sell Sell order
     */
    static buySettlesSell(buy: Order, sell: Order): boolean {
        if (buy.additionalType === AdditionalOrderType.Market || sell.additionalType === AdditionalOrderType.Market) {
            return true;
        }
        if (
            buy.getAmountSettled() + buy.getQuantityToSettle() * sell.getPrice() <=
            buy.getPrice() * buy.getQuantity()
        ) {
            return true;
        }
        return false;
    }

    static settlementPossible(order1: Order, order2: Order): boolean {
        const order1Quantity = order1.getQuantityToSettle();
        const order2Quantity = order2.getQuantityToSettle();
        if (
            order2Quantity >= order1Quantity &&
            (order1.getOrderType() === OrderType.Buy
                ? order2.getOrderType() === OrderType.Sell && this.buySettlesSell(order1, order2)
                : order2.getOrderType() === OrderType.Buy && this.buySettlesSell(order2, order1))
        ) {
            return true;
        } else {
            return false;
        }
    }

    static getSettlementPrice(order1: Order, order2: Order, lastTradePrice: Amount): Amount {
        if (
            order1.additionalType === AdditionalOrderType.Market &&
            order2.additionalType === AdditionalOrderType.Market
        ) {
            return lastTradePrice;
        } else if (
            order1.additionalType === AdditionalOrderType.Market &&
            order2.additionalType === AdditionalOrderType.Limit
        ) {
            return order2.getPrice();
        } else if (
            order1.additionalType === AdditionalOrderType.Limit &&
            order2.additionalType === AdditionalOrderType.Market
        ) {
            return order1.getPrice();
        } else {
            return (order1.getPrice() + order2.getPrice()) / 2;
        }
    }

    /**
     * Settle order1 with order2
     * Order status and settledBy is updated.
     * Corresponding users are notified about the update.
     * Precondition:
     *  - order2 should have higher or same quantity left to be settled so that order1 can be fully settled.
     *  - order1 and order2 should be a Buy, Sell pair which can be settled according to OrderMatcher::settlementPossible.
     * @param order Order with higher quantity
     */
    static settleOrders(order1: Order, order2: Order, lastTradePrice: Amount): void {
        const order1Quantity = order1.getQuantityToSettle();
        const order2Quantity = order2.getQuantityToSettle();
        if (this.settlementPossible(order1, order2)) {
            const time = new Date();
            const price = this.getSettlementPrice(order1, order2, lastTradePrice);
            order1.settledBy.push({
                order: order2,
                quantity: order1Quantity,
                time: time,
                price: price,
            });
            order1.setStatus(OrderStatus.Confirmed);
            order1.user.notifyOrderUpdate(order1);
            order2.settledBy.push({
                order: order1,
                quantity: order1Quantity,
                time: time,
                price: price,
            });
            if (order2Quantity === order1Quantity) {
                order2.setStatus(OrderStatus.Confirmed);
            } else if (order2.getStatus() === OrderStatus.Placed) {
                order2.setStatus(OrderStatus.PartiallyFilled);
            }
            order2.user.notifyOrderUpdate(order2);
        } else throw new Error('Preconditions not met to settle order.');
    }
}

export { OrderMatcher };
