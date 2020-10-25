import { Server } from 'http';
import io, { Socket } from 'socket.io';
import sharedSession from 'express-socket.io-session';
import { session } from '../app';

export class SocketServer {
    private socket: SocketIO.Server;

    constructor(server: Server, onNewConnection?: (socket: Socket) => void) {
        this.socket = io(server);
        this.socket.use(sharedSession(session, { autoSave: true }));
        this.socket.on('connection', (socket: Socket) => {
            if (onNewConnection) onNewConnection(socket);
        });
    }

    send(socket: Socket, type: string, data: unknown): void {
        socket.emit(type, data);
    }

    broadcast(type: string, data: unknown): void {
        this.socket.emit(type, data);
    }
}
