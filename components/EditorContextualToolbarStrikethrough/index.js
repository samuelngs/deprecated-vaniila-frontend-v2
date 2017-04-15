
import React from 'react';

export default ({ active = false }) => <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 30 30" className={active ? "icon icon-active" : "icon"}>
  <style jsx>{`
    .icon { height: 30px; width: 30px; fill: #fff; pointer-events: none; }
    .icon-active { fill: #76FFB4; }
    .strike-line { stroke:#1B2734; stroke-miterlimit:10; }
  `}</style>
  <path d="M10.2 19.3l1.2-1.6c.8.9 2.1 1.7 3.8 1.7 1.7 0 2.4-.8 2.4-1.6 0-2.5-7-1-7-5.4 0-2 1.7-3.5 4.4-3.5 1.9 0 3.4.6 4.5 1.7L18.3 12c-.9-.9-2.2-1.4-3.5-1.4-1.2 0-2 .6-2 1.5 0 2.2 7 .8 7 5.3 0 2-1.4 3.7-4.6 3.7-2.3.1-3.9-.7-5-1.8z" />
  <path d="M7 14h16v2H7z" className="strike-line"/>
</svg>
