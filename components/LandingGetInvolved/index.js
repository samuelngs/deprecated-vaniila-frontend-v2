
import React from 'react';

export default ({ unfold, toggle }) => <section>
  <button onClick={toggle}>Get Involved: { unfold ? 'unfold' : 'fold' }</button>
</section>

