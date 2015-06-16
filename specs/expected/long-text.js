var React = require('react');

var Hello = React.createClass({
  render: function() {
    return <div>
             <h1>The best text <a>ever</a></h1>
             <p>
               Some <strong>strong</strong> text here inside this awesome text
             </p>
             <p>
               A p tag that won't be in two lines
             </p>
           </div>
  }
});

React.render(<Hello message="world" />, document.body);