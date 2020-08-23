import { User, Amount, HoldingItem, ID } from '@se/core';

export class UserStore {
    public static addUser(name: string, balance: Amount, holdings: HoldingItem[]): ID {
        const user = new User(name, balance, holdings);
        return user.id;
    }
}
