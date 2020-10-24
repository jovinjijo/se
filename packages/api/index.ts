import app from './src/app';
import { SocketService } from './src/services/SocketService';
import { initMarket } from './src/util/Methods';
import { createServer } from 'http';

const server = createServer(app);
const socketService = new SocketService(server);

initMarket(socketService);

/**
 * Start Express server.
 */
server.listen(app.get('port'), () => {
    console.log('  App is running at http://localhost:%d in %s mode', app.get('port'), app.get('env'));
    console.log('  Press CTRL-C to stop\n');
});

export { UserStoreItemDetails, UserDetails } from './src/models/User';
export { OrderStoreDetails } from './src/models/Order';
export { LtpUpdate, OrderUpdate, WalletUpdate } from './src/services/NotificationService';
