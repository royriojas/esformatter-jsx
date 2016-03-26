var React = require('react');
var Button = require('react-bootstrap');
var Testing = React.createClass({

  getDefaultProps: function() {
    return {};
  },

  render: function() {

    return (
      <div {...this.props}>
        <h3
            style={ { padding: "1em", textAlign: "center" } }
            other={ [1231, 1, 232] }><span >This is an empty page. To add new component select needed element on left-side panel and click on an element on the page where you want to put new component.</span></h3>
        <Button bsStyle={ 'primary' }>
          <span>Text</span>
        </Button>
      </div>
      );
  }
});

module.exports = Testing;
