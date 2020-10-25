import { Amount, Notification, Order, Stock, User } from '@se/core';
import { OrderDetails, OrderRepository } from '../models/Order';
import { UserDetails, UserStore } from '../models/User';
import { SocketService } from './SocketService';

export interface LtpUpdate {
    stock: Stock;
    lastTradePrice: Amount;
    time: Date;
}

export interface OrderUpdate {
    user: UserDetails;
    order: OrderDetails;
}

export class NotificationService implements Notification {
    socketService: SocketService;
    constructor(socketService: SocketService) {
        this.socketService = socketService;
    }

    notifyLtpUpdate(stock: Stock, lastTradePrice: Amount, time: Date): void {
        this.socketService.broadcast('ltpUpdate', { stock, lastTradePrice, time });
    }

    notifyOrderUpdate(user: User, order: Order): void {
        const socket = UserStore.findUserByUsername(user.name)?.socket;
        if (socket) {
            this.socketService.send(socket, 'orderUpdate', {
                user: UserStore.getUserDetails(user),
                order: OrderRepository.getOrderDetails(order),
            });
        }
    }
}
