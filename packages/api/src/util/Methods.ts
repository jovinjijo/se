import { Market, Stock } from '@se/core';

function initMarket(): void {
    Market.getInstance().addOrderStore(Stock.TSLA);
    Market.getInstance().addOrderStore(Stock.AMZN);
    Market.getInstance().addOrderStore(Stock.RIL);
}

export { initMarket };
