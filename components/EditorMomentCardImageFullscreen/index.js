
import React from 'react';

export default ({ active = false }) => <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 40 40" className={active ? "icon icon-active" : "icon"}>
  <style jsx>{`
    .icon { height: 36px; width: 36px; fill: #ccc; pointer-events: none; }
    .icon-active { fill: #76FFB4; }
  `}</style>
  <path d="M18.8 30h-8.3c-.3 0-.5-.2-.5-.5v-8.3c0-.3.2-.5.5-.5s.5.2.5.5v7.2l7-7c.2-.2.5-.2.6 0 .2.2.2.5 0 .6l-7 7h7.2c.3 0 .5.2.5.5s-.2.5-.5.5zm2.4 0c-.3 0-.5-.2-.5-.5s.2-.5.5-.5h7.2l-7-7c-.2-.2-.2-.5 0-.6.2-.2.5-.2.6 0l7 7v-7.2c0-.3.2-.5.5-.5s.5.2.5.5v8.3c0 .3-.2.5-.5.5h-8.3zM10.5 19.3c-.3 0-.5-.2-.5-.5v-8.3c0-.3.2-.5.5-.5h8.3c.3 0 .5.2.5.5s-.2.5-.5.5h-7.2l7 7c.2.2.2.5 0 .6-.2.2-.5.2-.6 0l-7-7v7.2c-.1.3-.3.5-.5.5zm19 0c-.3 0-.5-.2-.5-.5v-7.2l-7 7c-.2.2-.5.2-.6 0-.2-.2-.2-.5 0-.6l7-7h-7.2c-.3 0-.5-.2-.5-.5s.2-.5.5-.5h8.3c.3 0 .5.2.5.5v8.3c0 .3-.2.5-.5.5z"/>
</svg>


