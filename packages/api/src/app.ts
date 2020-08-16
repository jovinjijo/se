import express from 'express';
import compression from 'compression';
import bodyParser from 'body-parser';
import session from 'express-session';
import path from 'path';
import passport from 'passport';

// Controllers (route handlers)
import routes from './routes';

// Create Express server
const app = express();

// Express configuration
app.set('port', process.env.PORT || 3001);
app.use(compression());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(
    session({
        resave: false,
        saveUninitialized: false,
        secret: process.env['SESSION_SECRET'] || '12345678',
    }),
);

app.use(passport.initialize());
app.use(passport.session());

const isProd = process.env.NODE_ENV === 'production';
if (isProd) {
    // Compute the build path and index.html path
    const buildPath = path.resolve(__dirname, '../../../ui/build');
    const indexHtml = path.join(buildPath, 'index.html');

    // Setup build path as a static assets path
    app.use(express.static(buildPath));
    // Serve index.html on unmatched routes
    app.get('*', (req, res) => res.sendFile(indexHtml));
}

app.use('/v1/', routes);

export default app;
