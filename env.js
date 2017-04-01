
const prod = process.env.NODE_ENV === 'production';

module.exports = {
  'BACKEND_URL': prod ? 'https://api.vaniila.com' : 'http://localhost:4000'
};
