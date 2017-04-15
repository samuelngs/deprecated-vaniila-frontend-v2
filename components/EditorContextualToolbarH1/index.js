
import React from 'react';

export default ({ active = false }) => <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 30 30" className={active ? "icon icon-active" : "icon"}>
  <style jsx>{`
    .icon { height: 30px; width: 30px; fill: #fff; pointer-events: none; }
    .icon-active { fill: #76FFB4; }
  `}</style>
   <path d="M14.5 20.3v-4.7H8.9v4.7H7V9.7h1.9V14h5.6V9.7h1.9v10.7h-1.9zm6.2 0v-7.7l-1.8 1.8-1.3-1.4L21 9.7h2v10.7h-2.3z" />
</svg>

