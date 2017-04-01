
import React from 'react';

export default ({ unfold, toggle }) => <section className="section">
  <style jsx>{`
    .section {
      margin-top: 0;
      margin-bottom: 0;
      margin-left: auto;
      margin-right: auto;
      padding-top: 25px;
      padding-bottom: 25px;
      padding-left: 0;
      padding-right: 0;
      width: 1195px;
      max-width: calc(100% - 40px);
      min-height: 500px;
      display: flex;
      flex-direction: column;
    }
    .cell {

    }
    @media (min-width: 900px) {
      .section {
        flex-direction: row;
      }
    }
  `}</style>
  <button onClick={toggle}>Wordsout: { unfold ? 'unfold' : 'fold' }</button>
</section>

