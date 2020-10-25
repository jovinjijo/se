import express from 'express';
import compression from 'compression';
import bodyParser from 'body-parser';
import expressSession from 'express-session';
import path from 'path';
import methodOverride from 'method-override';

// Controllers (route handlers)
import routes from './routes';

import { errorHandler } from './middlewares/errorHandler';
import { fillUserData } from './middlewares/authenticator';

// Create Express server
const app = express();

// Express configuration
app.set('port', process.env.PORT || 3001);
app.use(compression());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const session = expressSession({
    resave: true,
    saveUninitialized: true,
    secret: process.env['SESSION_SECRET'] || '12345678',
});
app.use(session);

// If a user is logged in, fill up req.user with user details
app.use(fillUserData);

const isProd = process.env.NODE_ENV === 'production';
if (isProd) {
    // Compute the build path and index.html path
    const buildPath = path.resolve(__dirname, '../../../ui/dist');
    const indexHtml = path.join(buildPath, 'index.html');

    // Setup build path as a static assets path
    app.use(express.static(buildPath));
    // Serve index.html on unmatched routes
    app.get('*', (req, res) => res.sendFile(indexHtml));
}

app.use('/v1/', routes);

/**
 * Error Handler to respond in JSON
 */
app.use(methodOverride());
app.use(errorHandler);

export default app;
export { session };
