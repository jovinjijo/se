import {
    Stock,
    OrderType,
    Quantity,
    Amount,
    User,
    Order,
    OrderInput,
    OperationResponse,
    IOrderStore,
    OrderStatus,
    OperationResponseStatus,
    AdditionalOrderType,
    ID,
} from '@se/core';

type TruncatedOrderDetails =
    | OrderInput
    | {
          id: ID;
          time: Date;
      };

type ConfirmedOrderDetails =
    | TruncatedOrderDetails
    | {
          status: OrderStatus.Confirmed;
          avgSettledPrice: Amount;
          settledTime: Date;
      };

type PlacedOrderDetails =
    | TruncatedOrderDetails
    | {
          status: OrderStatus.Placed;
      };

type PartiallyFilledOrderDetails =
    | TruncatedOrderDetails
    | {
          status: OrderStatus.PartiallyFilled;
          quantityFilled: Quantity;
      };

export type OrderDetails = ConfirmedOrderDetails | PlacedOrderDetails | PartiallyFilledOrderDetails;

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
        additionalOrderType: AdditionalOrderType,
        quantity: Quantity,
        price: Amount,
    ): OrderRepositoryResponse {
        const response =
            additionalOrderType === AdditionalOrderType.Limit
                ? user.placeOrder(symbol, type, AdditionalOrderType.Limit, quantity, price)
                : user.placeOrder(symbol, type, AdditionalOrderType.Market, quantity);
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

    public static getOrderDetails(order: Order): OrderDetails {
        const orderDetails: TruncatedOrderDetails = {
            id: order.id,
            price: order.price,
            quantity: order.quantity,
            symbol: order.symbol,
            type: order.type,
            time: order.time,
        };
        if (order.status === OrderStatus.Confirmed) {
            return {
                ...orderDetails,
                status: order.status,
                avgSettledPrice: order.getAvgSettledPrice(),
                settledTime: order.getSettledTime(),
            };
        } else if (order.status === OrderStatus.PartiallyFilled) {
            return {
                ...orderDetails,
                status: order.status,
                quantityFilled: order.getQuantitySettled(),
            };
        } else {
            return {
                ...orderDetails,
                status: order.status,
            };
        }
    }

    public static getOrderStoreDetails(orderStore: IOrderStore): OrderStoreDetails {
        return {
            placedBuyOrders: orderStore.placedBuyOrders.map((order) => this.getOrderDetails(order)),
            placedSellOrders: orderStore.placedSellOrders.map((order) => this.getOrderDetails(order)),
            confirmedOrders: orderStore.confirmedOrders.map((order) => this.getOrderDetails(order)),
        };
    }
}
