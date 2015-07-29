var filters = React.createClass( {
  render: function () {
    return <input placeholder={ searchPlaceholder }
     data-action="search"
   type="text"
               data-icon-type="1-2"
   data-diana-sfs=""
               className="txt"
data-widget-type="textentry"
               autoComplete="off" />
  }
} );

module.exports = filters;
