
const express = require('express');
const cookieParser = require('cookie-parser');
const next = require('next');

const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev });
const port = process.env.PORT || 3000;
const handle = app.getRequestHandler();

const routes = {
  '/'                       : '/landing',
  '/signin'                 : '/signin',
  '/signout'                : '/signout',
  '/new'                    : '/new-moment',
  '/:username'              : '/list-moments',
  '/:username/:id'          : '/view-moment',
  '/:username/:id/edit'     : '/edit-moment',
};

const router = (() => {
  const paths = [ ];
  Object.keys(routes).forEach(route => {
    paths.push({
      uri   : route,
      view  : routes[route],
      params: route
        .split('/')
        .filter(r => r.indexOf(':') === 0)
        .map(r => r.substring(1)),
    });
  });
  return paths;
})();

app.prepare().then(() => {

  const server = express();

  server.use(cookieParser());

  server.use('/favicon.ico', (req, res) => res.status(404).end());

  for ( const { uri, view, params } of router ) {
    server.get(uri, (req, res) => {
      const query = Object.assign({}, req.params, req.query);
      if ( params.length > 0 ) {
        const _core = req.params[params[0]];
        if ( dev && (_core === '_webpack' || _core === '__webpack_hmr' || _core === '_next') ) {
          return handle(req, res, req._parsedUrl);
        }
      }
      return app.render(req, res, view, query);
    });
  }

  server.get('*', (req, res) => handle(req, res));

  server.listen(port, err => {
    if (err) throw err
    console.log(`> Ready on http://localhost:${port}`);
  });

});
