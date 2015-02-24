var React = require('react');

var Hello = React.createClass({
  render: function() {
    return <div className="hello-div">{this.props.message}</div>;
  }
});

React.render(<Hello message="world"/>, document.body);