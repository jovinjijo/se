import { User, Amount, HoldingsData, IUser } from '@se/core';
import * as bcrypt from 'bcrypt';
import { Socket } from 'socket.io';
import { OrderRepository, OrderStoreDetails } from './Order';

const saltRounds = 10;

export interface WalletDetails {
    margin: Amount;
}

export interface UserDetails extends Omit<IUser, 'orders' | 'holdings' | 'name' | 'wallet'> {
    orders: OrderStoreDetails;
    holdings: HoldingsData;
    wallet: WalletDetails;
}

export interface UserStoreItem {
    user: User;
    username: string;
    socket?: Socket;
}

export interface UserStoreItemDetails extends UserDetails {
    username: string;
}

export interface UserStoreItemSensitive extends UserStoreItem {
    password: string;
}
export class UserStore {
    private static users: Map<string, UserStoreItemSensitive> = new Map<string, UserStoreItemSensitive>();

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
                socket: user.socket,
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
            id: user.id,
            wallet: user.wallet,
            orders: OrderRepository.getOrderStoreDetails(user.orders),
            holdings: user.holdings.getHoldings(),
        };
    }

    public static getUserStoreItemDetails(user: UserStoreItem): UserStoreItemDetails {
        return {
            ...this.getUserDetails(user.user),
            username: user.username,
        };
    }

    public static setSocketForUser(username: string, socket: Socket): void {
        const user = this.users.get(username);
        if (user) {
            user.socket = socket;
        } else {
            throw new Error('User not found');
        }
    }
}
