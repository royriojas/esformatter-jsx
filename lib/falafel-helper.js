var falafel = require( 'fresh-falafel' );

module.exports = function ( str, cb ) {
  var opts = require( './parser-options' );


  var babylon = require( 'babylon' );

  opts.parser = {
    parse: function ( code, opts_ ) {
      opts_ = opts_ || { };
      opts_.allowHashBang = true;
      opts_.sourceType = 'module';
      opts_.ecmaVersion = Infinity;
      opts_.plugins = [
        'jsx',
        'flow',
        'asyncFunctions',
        'classConstructorCall',
        'doExpressions',
        'trailingFunctionCommas',
        'objectRestSpread',
        'decorators',
        'classProperties',
        'exportExtensions',
        'exponentiationOperator',
        'asyncGenerators',
        'functionBind'
      ];

      opts_.features = { };

      return babylon.parse( code, opts_ );
    }
  };

  return falafel( str, opts, cb );
};
