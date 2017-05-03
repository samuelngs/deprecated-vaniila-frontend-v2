
import React from 'react';

export default ({ width, height, children }) => <div className="base" style={{ width, height }}>
  <style jsx>{`
    .base {
      margin: 0;
      padding: 0;
      background-color: #fff;
      border-radius: 4px;
      box-shadow: 0 1px 9px rgba(0, 0, 0, 0.05);
    }
  `}</style>
  { children }
</div>

