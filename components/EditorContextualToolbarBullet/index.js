
import React from 'react';

export default ({ active = false }) => <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 30 30" className={active ? "icon icon-active" : "icon"}>
  <style jsx>{`
    .icon { height: 30px; width: 30px; fill: #fff; pointer-events: none; }
    .icon-active { fill: #76FFB4; }
  `}</style>
   <path d="M8.2 13.6c-.8 0-1.4.6-1.4 1.4s.6 1.4 1.4 1.4 1.4-.6 1.4-1.4-.6-1.4-1.4-1.4zm3.8.6h11.2v1.7H12zM8.2 9c-.8 0-1.4.6-1.4 1.4 0 .8.6 1.4 1.4 1.4s1.4-.6 1.4-1.4C9.7 9.6 9 9 8.2 9zm3.8.6h11.2v1.7H12zm-3.8 8.5c-.8 0-1.4.6-1.4 1.4 0 .8.6 1.4 1.4 1.4s1.4-.6 1.4-1.4c.1-.8-.6-1.4-1.4-1.4zm3.8.6h11.2v1.7H12z" />
</svg>

