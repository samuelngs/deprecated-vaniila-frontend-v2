
import url from 'url';

const regex = /^.*(youtu\.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;

const whitelist = [
  'youtu.be',
  'youtube.com',
  'www.youtube.com',
];

export default function (uri) {

  const parsed = url.parse(uri);

  if ( whitelist.indexOf(parsed.host) === -1 ) {
    return null;
  }

  const match = regex.exec(uri);
  if ( match === null ) {
    return null;
  }
  if ( match[2].length !== 11 ) {
    return null;
  }

  return {
    type: 'youtube',
    data: match[2],
  };

}

