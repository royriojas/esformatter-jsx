import React, { Component } from 'react';
import {injectProps, decorator1, decorator2} from '../../helpers/injectProps.js';

@injectProps
export default class PlusActionButton extends Component {

      @injectProps
  @decorator1
       @decorator2
  render({ style, children}) {
    return (
    <div className="fixed-action-btn" style={ style }>
      <a className="btn-floating btn-large blue"><i className="large material-icons">add</i></a>
      <ul>
        { children }
      </ul>
    </div>
    );
  }
}
