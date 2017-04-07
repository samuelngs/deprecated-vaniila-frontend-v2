
import React from 'react';

export default ({ err, children }) => !err ? <div>
  { children }
  <style jsx>{`div { height: 100vh; width: 100vw; display: flex; }`}</style>
</div> : null;
