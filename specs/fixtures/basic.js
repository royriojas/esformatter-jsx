var React = require('react');

var Hello = React.createClass({
render: function () {
return <div><div

className="hello-div"
>{this.props.message}</div></div>;
}
});

React.render(<Hello
  message="world"/>,      document.body);