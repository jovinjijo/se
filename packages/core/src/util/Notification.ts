import { Order } from '../Order/Order';
import { User } from '../User/User';
import { Amount, Quantity, Stock } from './Datatypes';

/**
 * Implement this interface and attach it to Market using attachNotification to get notified about updates
 */
export interface Notification {
    /**
     * Called when a stock's value is updated
     */
    notifyLtpUpdate(stock: Stock, lastTradePrice: Amount, time: Date, quantity: Quantity): void;

    /**
     * Called when an order gets Confirmed or Partially Filled
     * Other than user's 'orders' getting updated, there could also be updates to 'holdings', 'wallet'
     */
    notifyOrderUpdate(user: User, order: Order): void;
}
