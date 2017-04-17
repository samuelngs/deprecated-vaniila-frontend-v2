
import React from 'react';

export default ({ active = false }) => <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" className={active ? "icon icon-active" : "icon"} >
  <style jsx>{`
    .icon { height: 18px; width: 18px; fill: #a8a8a8; pointer-events: none; }
    .icon-active { fill: #76FFB4; }
  `}</style>
    <path d="M5 2.73782c-.3 0-.4.2-.4.5s.2.4.5.4h10c.3 0 .5-.2.5-.4 0-.3-.2-.5-.4-.5H5zm-4.6 3.2c-.3 0-.4.2-.4.5s.2.4.5.4h19.1c.3 0 .5-.2.5-.4 0-.3-.2-.5-.4-.5H.4c.1 0 0 0 0 0zm0 3.6c-.3 0-.4.2-.4.5s.2.4.5.4h19.1c.3 0 .5-.2.5-.4 0-.3-.2-.5-.4-.5H.4c.1 0 0 0 0 0zm0 3.6c-.3 0-.4.2-.4.5s.2.4.5.4h19.1c.3 0 .5-.2.5-.4 0-.3-.2-.5-.4-.5H.4c.1 0 0 0 0 0zm4.6 3.2c-.3 0-.4.2-.4.5s.2.4.5.4h10c.3 0 .5-.2.5-.4 0-.3-.2-.5-.4-.5H5z"/>
</svg>
