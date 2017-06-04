
import React from 'react';

export default ({ active }) => <svg className={ active ? "active" : "default" } xmlns="http://www.w3.org/2000/svg" viewBox="0 0 40 40">
  <style jsx>{`
    svg { width: 38px; height: 38px; fill: #82a3b7; padding: 4px; }
    svg.active { fill: #00d68f; }
    @media (min-width: 768px) {
      svg { padding: 9px; }
    }
  `}</style>
  <path d="M17.9 30.1c-.2 0-.4 0-.5-.1-.6-.3-1-.9-.8-1.6l1.5-5.9h-1.7c-.5 0-1-.3-1.2-.7-.2-.4-.2-1 0-1.4l5.8-9.7c.1-.1.1-.2.2-.3.4-.4 1-.5 1.5-.3.6.3 1 .9.8 1.6L22 17.8h1.7c.5 0 1 .3 1.2.7.2.4.2 1 0 1.4l-5.8 9.5c-.1.1-.1.2-.2.3-.3.2-.7.3-1 .4z"/>
</svg>
