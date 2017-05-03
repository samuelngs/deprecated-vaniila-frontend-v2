
import React from 'react';

export default ({ active = false }) => <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 40 40" className={active ? "icon icon-active" : "icon"}>
  <style jsx>{`
    .icon { height: 34px; width: 34px; fill: #888; pointer-events: none; }
    .icon-active { fill: #185be7; }
  `}</style>
  <path d="M10 19.5h20v1H10zm0 6.5h20v1H10zm0-13h20v1H10z"/>
</svg>

