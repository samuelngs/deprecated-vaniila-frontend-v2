
import React from 'react';

export default ({ unfold, toggle }) => <section>
  <button onClick={toggle}>Hearts and Mind: { unfold ? 'unfold' : 'fold' }</button>
</section>

