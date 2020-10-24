import { UserDetails, OrderUpdate, WalletUpdate } from '@se/api';
import { LtpUpdate } from '@se/api/src/services/NotificationService';
import { LtpMap } from '@se/core';
import io from 'socket.io-client';

export class SocketClient {
  private socket: SocketIOClient.Socket;

  constructor(updateUserDetails: (user: Partial<UserDetails>) => void, updateLtp: (ltpMap: LtpMap) => void) {
    this.socket = io();
    this.socket.on('ltpUpdate', (ltpUpdate: LtpUpdate) => {
      updateLtp({ [ltpUpdate.stock]: ltpUpdate.lastTradePrice });
    });
    this.socket.on('orderUpdate', (orderUpdate: OrderUpdate) => {
      debugger;
      updateUserDetails(orderUpdate.user);
    });
    this.socket.on('walletUpdate', (wallet: WalletUpdate) => {
      updateUserDetails({ ...wallet });
    });
    this.socket.on('ltpMap', (ltpMap: LtpMap) => {
      updateLtp(ltpMap);
    });
  }

  public send(message: string): void {
    this.socket.emit('message', message);
  }
}
