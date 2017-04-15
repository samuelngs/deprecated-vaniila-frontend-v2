
import React from 'react';

export default ({ active = false }) => <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 30 30" className={active ? "icon icon-active" : "icon"}>
  <style jsx>{`
    .icon { height: 30px; width: 30px; fill: #fff; pointer-events: none; }
    .icon-active { fill: #76FFB4; }
  `}</style>
   <path d="M11.9 14.2h11.2v1.7H11.9zm0-4.6h11.2v1.7H11.9zm0 9.1h11.2v1.7H11.9zm-3.7-6.6V9.7l-.6.6-.3-.5 1.1-1.1H9V12h-.8zm-1.1 4.5V16c1.4-1 1.8-1.4 1.8-1.8 0-.3-.3-.4-.5-.4-.4 0-.7.2-.9.4l-.5-.4c.3-.4.8-.5 1.3-.5.7 0 1.3.4 1.3 1.1 0 .6-.5 1.1-1.3 1.7h1.4v.6H7.1zM7 20.7l.4-.5c.2.2.6.4.9.4.4 0 .6-.2.6-.4 0-.3-.2-.4-.7-.4h-.4v-.6h.4c.4 0 .6-.1.6-.4 0-.3-.3-.4-.6-.4s-.6.1-.8.3l-.4-.4c.3-.3.7-.5 1.3-.5.8 0 1.3.4 1.3.9 0 .4-.4.7-.7.8.3 0 .8.3.8.8 0 .6-.5 1-1.3 1-.7-.1-1.2-.3-1.4-.6z" />
</svg>

