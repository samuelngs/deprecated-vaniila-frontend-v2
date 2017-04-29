
import React from 'react';

import EditorLiveStream from '../EditorLiveStream';

export default ({ headerHeight }) => <div className="header-nav-livestream" style={{ height: headerHeight }}>
  <style jsx>{`
    .header-nav-livestream {
      margin-top: 0;
      margin-bottom: 0;
      margin-left: 20px;
      margin-right: 20px;
      padding-top: 0;
      padding-bottom: 0;
      padding-left: 0;
      padding-right: 0;
      display: flex;
      flex-direction: row;
      align-items: center;
      background-color: transparent;
    }
    .header-nav-live-moment-h6 {
      margin-top: 1px;
      margin-bottom: 0;
      margin-left: 10px;
      margin-right: 0;
      padding-top: 0;
      padding-bottom: 0;
      padding-left: 0;
      padding-right: 0;
      font-size: 12px;
      font-weight: 500;
      color: #8aa7b1;
    }
  `}</style>
  <EditorLiveStream active={true} />
  <h6 className="header-nav-live-moment-h6">Live Moment</h6>
</div>

