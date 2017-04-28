
import React from 'react';

import Tooltip from '../Tooltip';
import EditorModeGrid from '../EditorModeGrid';
import EditorModeSlider from '../EditorModeSlider';

export default ({ headerHeight, onPress, gridview }) => <div className="header-nav-mode" style={{ height: headerHeight }}>
  <style jsx>{`
    .header-nav-mode {
      margin-top: 0;
      margin-bottom: 0;
      margin-left: 10px;
      margin-right: 10px;
      padding-top: 0;
      padding-bottom: 0;
      padding-left: 0;
      padding-right: 0;
      display: flex;
      flex-direction: row;
      align-items: center;
      background-color: transparent;
    }
  `}</style>
  <style jsx global>{`
    .header-nav-mode-button {
      display: block;
      margin: 0;
      padding: 0;
      height: 30px;
      width: 30px;
      background-color: transparent;
      border: none;
      outline: none;
      cursor: pointer;
    }
  `}</style>
  <Tooltip tag="button" className="header-nav-mode-button" title="Your Moments" position="bottom" data-contextual-menu onClick={e => onPress(true)}>
    <EditorModeGrid active={gridview} />
  </Tooltip>
  <Tooltip tag="button" className="header-nav-mode-button" title="What's happening?" position="bottom" data-contextual-menu onClick={e => onPress(false)}>
    <EditorModeSlider active={!gridview} />
  </Tooltip>
</div>

