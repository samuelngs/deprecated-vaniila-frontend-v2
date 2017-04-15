
import React from 'react';

export default ({ active = false }) => <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 30 30" className={active ? "icon icon-active" : "icon"}>
  <style jsx>{`
    .icon { height: 30px; width: 30px; fill: #fff; pointer-events: none; }
    .icon-active { fill: #76FFB4; }
  `}</style>
  <path d="M10.2 21V9h5.9c2.2 0 3.4 1.4 3.4 3.1 0 1.5-1 2.5-2.1 2.8 1.3.2 2.3 1.5 2.3 3 0 1.9-1.2 3.2-3.5 3.2h-6zm7.2-8.6c0-.9-.6-1.6-1.7-1.6h-3.4V14h3.4c1.1 0 1.7-.7 1.7-1.6zm.2 5.1c0-.9-.6-1.7-1.8-1.7h-3.5v3.3h3.5c1.1 0 1.8-.6 1.8-1.6z" />
</svg>
