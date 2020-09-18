import { User } from '../src/User/User';
import { Stock, OperationResponseStatus } from '../src/util/Datatypes';
import { OrderType, AdditionalOrderType } from '../src/Order/Order';

it('Adding User', () => {
    const user = new User('John Doe', 0);
    expect(user).toBeDefined();
});

it('Adding User with invalid balance', () => {
    try {
        new User('John Doe', -100);
    } catch (ex) {
        expect(ex).toBeDefined();
    }
});

it('Adding User with holdings', () => {
    try {
        new User('John Doe', 0, { TSLA: -10 });
    } catch (ex) {
        expect(ex).toBeDefined();
    }
});

it('Check for enough Holdings, Margin', () => {
    const user1 = new User('John Doe', 100, { TSLA: 5 });

    const order1 = user1.placeOrder(Stock.TSLA, OrderType.Sell, AdditionalOrderType.Limit, 10, 20);
    expect(order1.status).toBe(OperationResponseStatus.Error);

    const order2 = user1.placeOrder(Stock.TSLA, OrderType.Buy, AdditionalOrderType.Limit, 10, 1000);
    expect(order2.status).toBe(OperationResponseStatus.Error);
});
