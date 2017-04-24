
import twitter from './Parse.Twitter';
import youtube from './Parse.Youtube';

const parser = [
  twitter,
  youtube,
];

function isValid(parse) {
  if ( typeof parse !== 'object' || parse === null ) return false;
  if ( typeof parse.type !== 'string' || !parse.type ) return false;
  if ( !parse.data ) return false;
  return true;
}

export default function (s) {
  for ( const parse of parser ) {
    const data = parse(s);
    if ( isValid(data) ) {
      return data;
    }
  }
  return null;
};
