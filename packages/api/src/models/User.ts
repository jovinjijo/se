import { User, Amount, HoldingItem } from '@se/core';
import * as bcrypt from 'bcrypt';

const saltRounds = 10;

export interface UserStoreItem {
    user: User;
    username: string;
}

export interface UserStoreItemSensitive extends UserStoreItem {
    password: string;
}
export class UserStore {
    static users: Map<string, UserStoreItemSensitive> = new Map<string, UserStoreItemSensitive>();

    public static async addUser(
        username: string,
        password: string,
        balance: Amount,
        holdings: HoldingItem[],
    ): Promise<UserStoreItem> {
        if (this.users.get(username)) {
            throw new Error('Username already exists');
        }
        const userStoreItem: UserStoreItemSensitive = {
            user: new User(username, balance, holdings),
            password: await bcrypt.hash(password, saltRounds),
            username: username,
        };
        this.users.set(username, userStoreItem);
        return {
            user: userStoreItem.user,
            username: username,
        };
    }

    public static findUserByUsername(username: string): UserStoreItem | undefined {
        const user = this.users.get(username);
        if (user) {
            return {
                user: user.user,
                username: user.username,
            };
        }
    }

    public static async findUserByUsernameAndAuthenticate(username: string, password: string): Promise<UserStoreItem> {
        const user = this.users.get(username);
        if (!user) {
            throw new Error('User not found');
        } else if (await bcrypt.compare(password, user.password)) {
            return {
                user: user.user,
                username: user.username,
            };
        } else {
            throw new Error('Wrong password');
        }
    }
}
