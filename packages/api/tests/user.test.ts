import * as newman from 'newman';
import collection from '../docs/se_api.postman_collection.json';

import server from '../server';

newman.run(
    {
        collection: collection,
        reporters: 'cli',
    },
    function (err, summary) {
        server.close();
        console.log('API Postman test complete');
        if (err || summary.run.failures.length > 0) {
            process.exit(1);
        }
        process.exit(0);
    },
);
