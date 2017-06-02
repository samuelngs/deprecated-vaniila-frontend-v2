
import React from 'react';
import PropTypes from 'prop-types';
import UUID from 'uuid';

import If from '../If';

export default class AppAutoComplete extends React.PureComponent {

  static propTypes = {
    placeholder: PropTypes.string,
    search: PropTypes.func,
    select: PropTypes.func,
    render: PropTypes.func,
  }

  static defaultProps = {
    placeholder: '',
    search: e => null,
    select: e => null,
    render: e => null,
  }

  state = {
    term: '',
    matches: [ ],
  }

  async onChange(e) {

    const t = this._t = UUID.v4();

    const { target: { value } } = e;

    this.setState({ term: value });

    const { search } = this.props;
    const res = await search(value);

    if ( this._t === t && Array.isArray(res) ) {
      this.setState({ matches: res });
    }
  }

  onSelect = e => {
    const { select } = this.props;
    this.setState({ term: '', matches: [] }, _ => select(e));
  }

  onClear = e => {
    this.setState({ term: '', matches: [] });
  }

  render() {
    const { placeholder, render } = this.props;
    const { term, matches } = this.state;
    return <div className="base">
      <style jsx>{`
        .base {
          display: flex;
          flex-direction: column;
          margin-top: 0;
          margin-bottom: 0;
          margin-left: 0;
          margin-right: 0;
          padding-top: 0;
          padding-bottom: 0;
          padding-right: 0;
          padding-left: 0;
          position: relative;
        }
        .input {
          margin-top: 0;
          margin-bottom: 0;
          margin-left: 0;
          margin-right: 0;
          padding-top: 0;
          padding-bottom: 0;
          padding-right: 40px;
          padding-left: 10px;
          height: 38px;
          border: 1px solid #ededed;
          box-shadow: 0 1px 0px #f7f7f7;
          border-radius: 4px;
          font-size: 16px;
          font-weight: 400;
          color: #555;
          outline: none;
        }
        .input::placeholder {
          color: #bbb;
        }
        .input:hover {
          border-color: #e0e0e0;
        }
        .input:focus {
          border-color: #08d695;
        }
        .clear {
          position: absolute;
          top: 11px;
          right: 11px;
          width: 24px;
          height: 24px;
          margin-top: 0;
          margin-bottom: 0;
          margin-left: 0;
          margin-right: 0;
          padding-top: 0;
          padding-bottom: 0;
          padding-right: 0;
          padding-left: 0;
          border: none;
          border-radius: 12px;
          background-color: #ededed;
          font-size: 13px;
          font-weight: 400;
          color: #b7b7b7;
          cursor: pointer;
          outline: none;
        }
        .results {
          position: absolute;
          top: calc(100% + 10px);
          left: 0px;
          right: 0px;
          max-height: 300px;
          margin-top: 0;
          margin-bottom: 0;
          margin-left: 0;
          margin-right: 0;
          padding-top: 0;
          padding-bottom: 0;
          padding-right: 0;
          padding-left: 0;
          border: 1px solid #ededed;
          border-radius: 3px;
          background-color: #fff;
          list-style: none;
          overflow: auto;
        }
        @media (min-width: 768px) {
          .input {
            height: 44px;
            font-size: 18px;
          }
        }
      `}</style>
      <input className="input" type="text" value={term} placeholder={placeholder} onChange={::this.onChange} />
      <If condition={term.length > 0}>
        <button className="clear" onClick={this.onClear}>✕</button>
      </If>
      <If condition={matches.length > 0}>
        <ul className="results">
          { matches.map((props, i) => render({ ...props, select: this.onSelect }, i)) }
        </ul>
      </If>
    </div>;
  }

}
