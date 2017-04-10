
export default function deepClone(c, obj) {
   for ( let i in obj )
     c[i] = (typeof obj[i] == 'object') ? deepClone(obj[i].constructor(), obj[i]) : obj[i];
   return c;
}

