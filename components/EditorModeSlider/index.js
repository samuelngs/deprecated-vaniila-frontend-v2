
import React from 'react';

export default ({ active = false }) => <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 40 40" className={active ? "icon icon-active" : "icon"}>
  <style jsx>{`
    .icon { height: 30px; width: 30px; fill: #8aa7b1; pointer-events: none; }
    .icon-active { fill: #185be7; }
  `}</style>
  <path d="M24 10v20H10V10h14zm-1 19V11H11v18h12zm3 1V10h1v20zm3 0V10h1v20z"/>
</svg>
