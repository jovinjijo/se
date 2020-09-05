import { Stock, OperationResponseStatus } from '../src/util/Datatypes';
import { Market } from '../src/Market/Market';

beforeEach(() => {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    Market.instance = new Market();
});

it('Adding Stock OrderStore', () => {
    const orderStore = Market.getInstance().addOrderStore(Stock.TSLA);
    expect(orderStore.status).toBe(OperationResponseStatus.Success);
});

it('Adding Stock OrderStore twice', () => {
    Market.getInstance().addOrderStore(Stock.TSLA);
    const orderStore = Market.getInstance().addOrderStore(Stock.TSLA);
    expect(orderStore.status).toBe(OperationResponseStatus.Error);
});
