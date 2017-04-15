
import React from 'react';

export default ({ active = false }) => <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 30 30" className={active ? "icon icon-active" : "icon"}>
  <style jsx>{`
    .icon { height: 30px; width: 30px; fill: #fff; pointer-events: none; }
    .icon-active { fill: #76FFB4; }
  `}</style>
   <path d="M12.9 19.7v-3.9H8.5v3.9h-2v-9.3h2v3.7h4.4v-3.7h2v9.3h-2zm3.6 0v-1.6c3.8-2.8 4.9-3.8 4.9-4.9 0-.8-.7-1.2-1.5-1.2-1.1 0-1.9.4-2.5 1.1l-1.1-1.3c.9-1.1 2.3-1.5 3.6-1.5 2 0 3.6 1.1 3.6 3 0 1.6-1.3 3-3.7 4.7h3.8v1.8h-7.1z" />
</svg>

