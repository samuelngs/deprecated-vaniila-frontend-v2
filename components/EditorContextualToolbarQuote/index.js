
import React from 'react';

export default ({ active = false }) => <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 30 30" className={active ? "icon icon-active" : "icon"}>
  <style jsx>{`
    .icon { height: 30px; width: 30px; fill: #fff; pointer-events: none; }
    .icon-active { fill: #76FFB4; }
  `}</style>
   <path d="M13.7 10c-1 .9-2.9 2.9-2.9 5.2 0 .6.4 1.1.7 1.3.4.2 2.4.6 2.4 2.6 0 1.1-.9 2-2.3 2s-3.5-1.4-3.5-3.9c0-4.3 4-7.2 4.8-7.7.1-.3.3-.5.7-.5.3 0 .5.1.5.4 0 .2 0 .3-.4.6zm8 0c-1 .9-2.9 2.9-2.9 5.2 0 .6.4 1.1.7 1.3.4.2 2.4.6 2.4 2.6 0 1.1-.9 2-2.3 2s-3.5-1.4-3.5-3.9c0-4.3 4-7.2 4.8-7.7.1-.3.3-.5.7-.5.3 0 .5.1.5.4 0 .2 0 .3-.4.6z" />
</svg>

