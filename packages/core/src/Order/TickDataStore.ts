import { Amount, Quantity } from '../util/Datatypes';

export interface TradeTick {
    time: Date;
    price: Amount;
    quantity: Quantity;
}

interface FilterParams {
    from: Date;
    to: Date;
}

export class TickDataStore {
    private data: TradeTick[];

    constructor() {
        this.data = [];
    }

    addTick(time: Date, price: Amount, quantity: Quantity): void {
        const lastIndex = this.data.length - 1;
        if (lastIndex === -1 || (lastIndex >= 0 && this.data[lastIndex].time < time)) {
            this.data.push({ time, price, quantity });
        } else throw new Error('Tick is older than last tick stored in the store');
    }

    getTickData(filter?: FilterParams): TradeTick[] {
        if (filter) {
            return this.data.filter((tick) => tick.time >= filter.from && tick.time <= filter.to);
        } else {
            return this.data;
        }
    }
}
