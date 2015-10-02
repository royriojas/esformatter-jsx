var falafel = require( 'falafel' );

module.exports = function ( str, cb ) {
  var opts = require( './parser-options' );
  opts.parser = require( 'acorn-babel' );

  return falafel( str, opts, cb );
};
