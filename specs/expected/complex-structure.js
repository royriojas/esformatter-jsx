var Cards = React.createClass({
  getInitialState: function() {
    return {
      allToggled: false
    };
  },
  onToggled: function(cardId, state) {
    var result = this.props.cards.filter(function(card) {
      return cardId === card.id;
    });
    if (result.length > 0) {
      result[0].toggled = state;
    }
    var allToggled = this.props.cards.reduce(function(prev, card) {
      console.log('prev', prev, card.toggled);
      return prev && card.toggled;
    }, true);

    console.log('>>>cards', this.props.cards, allToggled);

    this.setState({
      allToggled: allToggled
    });
  },
  render: function() {
    var footerClass = 'final message';
    if (this.state.allToggled) {
      footerClass += ' on';
    }
    var me = this;
    var cards = this.props.cards.map(function(card) {
      var pos = {
        top: 0,
        left: card.id * 310
      };

      return <Card card={ card } key={ card.id } pos={ pos } onToggled={ me.onToggled } />;
    });
    return <div>
             <div className="message">
               <p> Lo que te voy a decir no es un secreto...
                 <br /> Pero igual deberás descubrirlo </p>
               { this.state.allToggled ? <div>All Toggled</div> : null }
             </div>
             <div className="stage">
               { cards }
             </div>
             <div className={ footerClass }>
               <p> Y no me cansaré de repetírtelo...
                 <br /> Me haces muy feliz! </p>
             </div>
           </div>;
  }
});