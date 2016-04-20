const ListComponent = React.createClass({
  render: function() {
    const value = this.props.data;
    return (<span>
             { value.toString() }
             </span>);
  }
});