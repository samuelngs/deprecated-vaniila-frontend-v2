
import url from 'url';

const regex = /\/status(es)?\/(\d+)/;

export default function (uri) {

  const parsed = url.parse(uri);

  if ( parsed.host !== 'twitter.com' ) {
    return null;
  }

  if ( parsed.path.indexOf('status') === -1 ) {
    return null;
  }

  const match = regex.exec(parsed.path);
  if ( match === null ) {
    return null;
  }

  return {
    type: 'twitter',
    data: match[2],
  };

}
