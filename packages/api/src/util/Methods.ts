import { Market, Stock } from '@se/core';

function initMarket(): void {
    Market.getInstance().addOrderStore(Stock.TSLA, 500);
    Market.getInstance().addOrderStore(Stock.AMZN, 3000);
    Market.getInstance().addOrderStore(Stock.RIL, 2000);
}

export { initMarket };
