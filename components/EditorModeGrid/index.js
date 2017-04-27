
import React from 'react';

export default ({ active = false }) => <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 40 40" className={active ? "icon icon-active" : "icon"}>
  <style jsx>{`
    .icon { height: 30px; width: 30px; fill: #8aa7b1; pointer-events: none; }
    .icon-active { fill: #185be7; }
  `}</style>
  <path d="M19 19h-9v-9h9v9zm-8-1h7v-7h-7v7zm19 7h-9V10h9v15zm-8-1h7V11h-7v13zm-12 0h9v1h-9zm0 5h20v1H10z"/>
</svg>
