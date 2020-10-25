import { SocketServer } from '../util/SocketServer';
import { Server } from 'http';
import { Socket } from 'socket.io';
import { UserStore } from '../models/User';
import { Market } from '@se/core';

export class SocketService extends SocketServer {
    constructor(server: Server) {
        super(server, SocketService.onNewConnection);
    }

    static onNewConnection(socket: Socket): void {
        try {
            if (!socket.handshake.session) {
                throw new Error('User not logged in');
            } else {
                const username = socket.handshake.session.userId;
                if (username) {
                    UserStore.setSocketForUser(username, socket);
                    socket.emit('ltpMap', Market.getInstance().getLtpForOrderStores());
                }
            }
        } catch (ex) {
            socket.disconnect();
        }
    }
}
