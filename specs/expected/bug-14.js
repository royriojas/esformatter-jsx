var GroceryList = React.createClass({
  handleClick: function(i) {
    console.log('You clicked: ' + this.props.items[i]);
  },

  render: function() {
    this.props.items.map(function(item, i) {
      return (
        <div
             onClick={this.handleClick.bind(this, i)}
             key={i}>
          {item}
        </div>
        );
    }, this)

    return ( <div>
               {this.props.items.map(function(item, i) {
                  return (
                    <div
                         onClick={this.handleClick.bind(this, i)}
                         key={i}>
                      {item}
                    </div>
                    );
                }, this)}
               <div>
                 {this.state.allSaved ? <div>
                                          all Saved!
                                        </div> : null}
               </div>
             </div>
      );
  }
});

React.render(
  <GroceryList items={['Apple', 'Banana', 'Cranberry']} />, mountNode
);
