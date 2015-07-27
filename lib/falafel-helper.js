var falafel = require( 'falafel-espree' );
module.exports = function ( str, cb ) {
  return falafel( str, require( './espree-options' ), cb );
};
