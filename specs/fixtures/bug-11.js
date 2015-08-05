var React = require('react');

var Hello = React.createClass({
render: function () {
return <div className='classes' style={style} onClick={this.click} onMouseDown={this.start} onMouseMove={this.move} onMouseUp={this.stop} >Element</div>;
}
});

React.render(<Hello
  message="world"/>,      document.body);
