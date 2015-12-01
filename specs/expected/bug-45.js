import React, { Component } from 'react';
import injectProps from '../../helpers/injectProps';


export default class Form extends Component {

  @injectProps // esfmt-ignore-line
  render({memberTypes}) {

    return (
      <div style={ {  minWidth: '400px'} }>
        <h4>New Title</h4>
        { /* Modal Form With Fields */ }
      </div>
      );
  }
}