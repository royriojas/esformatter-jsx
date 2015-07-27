var rocambole = require( 'rocambole' );
var espree = require( 'espree' );

rocambole.parseFn = espree.parse;
rocambole.parseContext = espree;

module.exports = {
  parse: function ( str ) {
    return rocambole.parse( str, require( './espree-options.js' ) );
  },
  moonwalk: function () {
    return rocambole.moonwalk.apply( rocambole, arguments );
  }
};
