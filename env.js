
const prod = process.env.NODE_ENV === 'production';

module.exports = {
  'BACKEND_HOST'  : prod ? 'api.vaniila.com' : 'localhost:4000',
  'BACKEND_URL'   : prod ? 'https://api.vaniila.com' : 'http://localhost:4000',
  'CDN_URL'       : prod ? 'https://cdn-images.vaniila.com' : 'http://localhost:2000',
};
