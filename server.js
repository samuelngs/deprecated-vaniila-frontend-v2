
const express = require('express');
const cookieParser = require('cookie-parser');
const next = require('next');

const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev });
const handle = app.getRequestHandler();

const routes = {
  '/'           : '/landing',
  '/signin'     : '/signin',
  '/new'        : '/new-moment',
};

app.prepare().then(() => {

  const server = express();

  server.use(cookieParser());

  Object.keys(routes).forEach(route => {
    const path = route;
    const page = routes[route];
    server.get(path, (req, res) => app.render(req, res, page, req.query));
  });

  server.get('*', (req, res) => handle(req, res));

  server.listen(3000, err => {
    if (err) throw err
    console.log('> Ready on http://localhost:3000')
  });

});
