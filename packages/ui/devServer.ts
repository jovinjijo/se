import { createProxyMiddleware } from 'http-proxy-middleware';
import Bundler from 'parcel-bundler';
import express from 'express';

const bundler = new Bundler('public/index.html', {
  cache: false,
});

const app = express();
const PORT = 3000;

app.use(
  ['/v1/**', '/socket.io/**'],
  createProxyMiddleware({
    target: 'http://localhost:3001',
  }),
);

// Pass the Parcel bundler into Express as middleware
app.use(bundler.middleware());

// Run your Express server
app.listen(PORT);
console.log(`UI Dev Server runing on port ${PORT}`);
