var esformatter = require( 'esformatter' );
esformatter.register( require( '../lib/plugin' ) );

var fs = require( 'fs' );
var path = require( 'path' );

var files = fs.readdirSync( './entry/' );

files.forEach( function ( file ) {
  var codeStr = fs.readFileSync( './entry/' + file ).toString();
  var formattedCode = esformatter.format( codeStr, {
    'whiteSpace': {
      'value': ' ',
      'removeTrailing': 1,
      'before': {
        ObjectPatternClosingBrace: 1
      },
      'after': {
        ObjectPatternOpeningBrace: 1
      },
    },
    'jsx': {
      'formatJSX': true,
      'attrsOnSameLineAsTag': true,
      'maxAttrsOnTag': 3,
      'firstAttributeOnSameLine': true,
      'spaceInJSXExpressionContainers': ' ',
      'alignWithFirstAttribute': false,
      'formatJSXExpressions': false,
      'htmlOptions': {
        'brace_style': 'collapse',
        'indent_char': ' ',
        'indent_size': 2,
        'max_preserve_newlines': 2,
        'preserve_newlines': true
      }
    }
  } );

  fs.writeFileSync( './result/' + path.basename( file ), formattedCode );

} );
