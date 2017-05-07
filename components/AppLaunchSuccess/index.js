
import React from 'react';

export default ({ modal, success, children }) => success ? <div className={ modal ? "base base-modal" : "base" }>
  <style jsx>{`
    .base { }
    .base-modal {
      display: flex;
      flex: 1;
      flex-direction: row;
      justify-content: center;
    }
  `}</style>
  { children }
</div> : null;
