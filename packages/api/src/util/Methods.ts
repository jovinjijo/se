import { Market, Stock } from '@se/core';
import { NotificationService } from '../services/NotificationService';
import { SocketService } from '../services/SocketService';

function initMarket(socketService: SocketService): void {
    Market.getInstance().addOrderStore(Stock.TSLA, 500);
    Market.getInstance().addOrderStore(Stock.AMZN, 3000);
    Market.getInstance().addOrderStore(Stock.RIL, 2000);

    Market.getInstance().attachNotification(new NotificationService(socketService));
}

export { initMarket };
