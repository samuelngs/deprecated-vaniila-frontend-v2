
import React from 'react';

export default ({ active = false }) => <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 30 30" className={active ? "icon icon-active" : "icon"}>
  <style jsx>{`
    .icon { height: 30px; width: 30px; fill: #fff; pointer-events: none; }
    .icon-active { fill: #76FFB4; }
  `}</style>
   <path d="M12.4 21L15 9h2.6L15 21h-2.6z" />
</svg>
