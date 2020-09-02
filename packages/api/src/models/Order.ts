import {
    Stock,
    OrderType,
    Quantity,
    Amount,
    User,
    IOrder,
    OperationResponse,
    IOrderStore,
    OperationResponseStatus,
} from '@se/core';

export type OrderDetails = Omit<IOrder, 'settledBy' | 'user'>;

export interface OrderStoreDetails
    extends Omit<IOrderStore, 'placedBuyOrders' | 'placedSellOrders' | 'confirmedOrders'> {
    placedBuyOrders: OrderDetails[];
    placedSellOrders: OrderDetails[];
    confirmedOrders: OrderDetails[];
}

export type OrderRepositoryResponse = OperationResponse<OrderDetails>;

export class OrderRepository {
    public static placeOrder(
        user: User,
        symbol: Stock,
        type: OrderType,
        quantity: Quantity,
        price: Amount,
    ): OrderRepositoryResponse {
        const response = user.placeOrder(symbol, type, quantity, price);
        if (response.status === OperationResponseStatus.Success) {
            return {
                status: response.status,
                data: this.getOrderDetails(response.data),
                messages: response.messages,
            };
        } else {
            return {
                status: response.status,
                messages: response.messages,
            };
        }
    }

    public static getOrderDetails(order: IOrder): OrderDetails {
        return {
            id: order.id,
            price: order.price,
            quantity: order.quantity,
            symbol: order.symbol,
            type: order.type,
            status: order.status,
            time: order.time,
        };
    }
}
