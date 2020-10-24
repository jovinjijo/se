import { Order } from '../Order/Order';
import { User } from '../User/User';
import { Wallet } from '../User/Wallet';
import { Amount, Stock } from './Datatypes';

/**
 * Implement this interface and attach it to Market using attachNotification to get notified about updates
 */
export interface Notification {
    /**
     * Called when a stock's value is updated
     */
    notifyLtpUpdate(stock: Stock, lastTradePrice: Amount, time: Date): void;

    /**
     * Called when an order gets Confirmed or Partially Filled
     * Other than user's 'orders' getting updated, there could also be updates to 'holdings', 'wallet'
     */
    notifyOrderUpdate(user: User, order: Order): void;

    /**
     * Called when user's wallet is updated. This is called when only user's wallet is updated.
     * If user's holdings, wallet, orders are updated together, notifyOrderUpdate would be called.
     */
    notifyWalletUpdate(user: User, wallet: Wallet): void;
}
