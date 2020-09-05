import { User, Amount, HoldingsData, IUser } from '@se/core';
import * as bcrypt from 'bcrypt';
import { OrderRepository, OrderStoreDetails } from './Order';

const saltRounds = 10;

export interface UserDetails extends Omit<IUser, 'orders'> {
    orders: OrderStoreDetails;
}

export interface UserStoreItem {
    user: User;
    username: string;
}

export interface UserStoreItemDetails extends Omit<UserStoreItem, 'user'> {
    user: UserDetails;
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
        holdings: HoldingsData,
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
        return this.findUserByUsername(username);
    }

    public static findUserByUsername(username: string): UserStoreItem {
        const user = this.users.get(username);
        if (user) {
            return {
                user: user.user,
                username: user.username,
            };
        }
        throw new Error('User not found');
    }

    public static async findUserByUsernameAndAuthenticate(username: string, password: string): Promise<UserStoreItem> {
        const user = this.users.get(username);
        if (!user) {
            throw new Error('User not found');
        } else if (await bcrypt.compare(password, user.password)) {
            return this.findUserByUsername(username);
        } else {
            throw new Error('Wrong password');
        }
    }

    public static getUserDetails(user: User): UserDetails {
        return {
            ...user,
            orders: OrderRepository.getOrderStoreDetails(user.orders),
        };
    }

    public static getUserStoreItemDetails(user: UserStoreItem): UserStoreItemDetails {
        return {
            user: this.getUserDetails(user.user),
            username: user.username,
        };
    }
}
