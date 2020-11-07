import { UserDetails, OrderUpdate, LtpUpdate } from '@se/api';
import { LtpMap, Stock, TradeTick } from '@se/core';
import io from 'socket.io-client';

export class SocketClient {
  private socket: SocketIOClient.Socket;

  constructor(updateUserDetails: (user: Partial<UserDetails>) => void, updateLtp: (ltpMap: LtpMap) => void) {
    this.socket = io();
    this.socket.on('ltpUpdate', (ltpUpdate: LtpUpdate) => {
      updateLtp({ [ltpUpdate.stock]: ltpUpdate.lastTradePrice });
    });
    this.socket.on('orderUpdate', (orderUpdate: OrderUpdate) => {
      updateUserDetails(orderUpdate.user);
    });
    this.socket.on('ltpMap', (ltpMap: LtpMap) => {
      updateLtp(ltpMap);
    });
  }

  public getTickData(stock: Stock): Promise<TradeTick[]> {
    return new Promise((resolve, reject) => {
      const timeout = setTimeout(() => {
        reject('Timeout');
      }, 20000);
      this.socket.send('tickData', stock, (data: TradeTick[]) => {
        clearTimeout(timeout);
        resolve(data);
      });
    });
  }

  public send(message: string): void {
    this.socket.emit('message', message);
  }

  public disconnect(): void {
    this.socket.disconnect();
  }
}
