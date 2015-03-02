var React = require('react');

var Hello = React.createClass({
  render: function() {
    return <ReactElement
             className='classes'
             style={style}
             onClick={this.click}
             onMouseDown={this.start}
             onMouseMove={this.move}
             onMouseUp={this.stop}>
             <div>
               Element
             </div>
           </ReactElement>;
  }
});

React.render(<Hello message="world" />, document.body);