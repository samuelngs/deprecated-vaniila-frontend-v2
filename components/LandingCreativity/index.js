
import React from 'react';

export default ({ unfold, toggle }) => <section>
  <button onClick={toggle}>Creativity: { unfold ? 'unfold' : 'fold' }</button>
</section>
