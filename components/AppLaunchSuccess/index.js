
import React from 'react';

export default ({ success, children }) => success ? <div>
  { children }
</div> : null;
