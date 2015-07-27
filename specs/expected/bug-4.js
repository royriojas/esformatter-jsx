var React = require('react');

var Hello = React.createClass({
  render: function() {

    return <Input
                  ref='inputElement'
                  value={ this.state.urlValue }
                  type={ 'text' }
                  label={ this.props.label }
                  placeholder={ 'Enter value' }
                  addonBefore={ 'URL:' }
                  onChange={ this._handleChangeUrlValue }
                  buttonAfter={ <Button
                                        onClick={ this._handleClearUrlValue }
                                        bsStyle={ 'default' }>
                                  <span className={ 'fa fa-times' }></span>
                                </Button> }>
           <Grid>
             <Row>
               <Col/>
             </Row>
           </Grid>
           </Input>
  }
});

React.render(<Hello message="world" />, document.body);
