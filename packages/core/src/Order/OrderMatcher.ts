import { OrderStatus, OrderType, Order } from './Order';

class OrderMatcher {
    /**
     * Checks if a Buy Sell pair can be settled.
     * Does a simulation and checks if the new settlement is added, if both orders' limit prices are respected.
     * @param buy Buy order
     * @param sell Sell order
     */
    static settlementPossible(buy: Order, sell: Order): boolean {
        if (
            buy.getAmountSettled() + buy.getQuantityToSettle() * sell.getPrice() <=
            buy.getPrice() * buy.getQuantity()
        ) {
            return true;
        }
        return false;
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
    static settleWithOrder(order1: Order, order2: Order): void {
        const order1Quantity = order1.getQuantityToSettle();
        const order2Quantity = order2.getQuantityToSettle();
        const order1Price = order1.getPrice();
        const order2Price = order2.getPrice();
        if (
            order2Quantity >= order1Quantity &&
            (order1.getOrderType() === OrderType.Buy
                ? order2.getOrderType() === OrderType.Sell && this.settlementPossible(order1, order2)
                : order2.getOrderType() === OrderType.Buy && this.settlementPossible(order2, order1))
        ) {
            const time = new Date();
            const price = (order1Price + order2Price) / 2;
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
            } else {
                order2.setStatus(OrderStatus.PartiallyFilled);
            }
            order2.user.notifyOrderUpdate(order2);
        } else throw new Error('Preconditions not met to settle order.');
    }
}

export { OrderMatcher };
