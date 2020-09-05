import * as newman from 'newman';
import collection from '../docs/se_api.postman_collection.json';
import { Server } from 'http';

import app from '../src/app';
import { initMarket } from '../src/util/Methods';

let server: Server;

beforeAll((done) => {
    initMarket();
    server = app.listen(app.get('port'), () => {
        done();
    });
});

it('Run Newman tests', (done) => {
    newman.run(
        {
            collection: collection,
            reporters: 'cli',
        },
        function (err, summary) {
            expect(err).toBeNull();
            expect(summary.run.failures.length).toBe(0);
            done();
        },
    );
});

afterAll((done) => {
    server.close(() => {
        done();
    });
});
