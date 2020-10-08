import app from './src/app';
import { initMarket } from './src/util/Methods';

initMarket();

/**
 * Start Express server.
 */
const server = app.listen(app.get('port'), () => {
    console.log('  App is running at http://localhost:%d in %s mode', app.get('port'), app.get('env'));
    console.log('  Press CTRL-C to stop\n');
});

export { server };
export { UserStoreItemDetails } from './src/models/User';
export { OrderStoreDetails } from './src/models/Order';
