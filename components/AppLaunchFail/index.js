
import React from 'react';

export default ({ failure, children }) => failure ? <div>
  { children }
</div> : null;

