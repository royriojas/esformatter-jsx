var esformatter = require( 'esformatter' );
esformatter.register( require( '../lib/plugin' ) );
esformatter.register( require('esformatter-quotes') );
var chalk = require( 'chalk' );
var fs = require( 'fs' );
var mkdirp = require( 'mkdirp' );
var path = require( 'path' );
var jsdiff = require('diff');

var files = fs.readdirSync( './entry/' );

files.forEach( function ( file ) {
  var codeStr = fs.readFileSync( './entry/' + file ).toString();
  var options = {
    "jsx": {
      "formatJSX": true,
      "attrsOnSameLineAsTag": true,
      "maxAttrsOnTag": 3,
      "firstAttributeOnSameLine": true,
      "spaceInJSXExpressionContainers": " ",
      "alignWithFirstAttribute": false,
      "formatJSXExpressions": true,
      "htmlOptions": {
        "brace_style": "collapse",
        "indent_char": " ",
        "indent_size": 2,
        "max_preserve_newlines": 2,
        "preserve_newlines": true
      }
    },
    "quotes": {
      "type": "single",
      "avoidEscape": true
    }
  };

  var formattedCode = esformatter.format( codeStr, options );

  mkdirp.sync('./result/');

  fs.writeFileSync( './result/' + path.basename( file ), formattedCode );

  var reformattedCode = esformatter.format( formattedCode, options );
  if (formattedCode !== reformattedCode) {
    var diff = jsdiff.diffLines(formattedCode, reformattedCode);
    var parts = [];
    diff.forEach(function(part){
      // green for additions, red for deletions
      // grey for common parts
      var color = part.added ? 'green' :
        part.removed ? 'red' : 'grey';

      parts.push(chalk[color](part.value));
    });

    throw new Error( 'Expected ' + file + ' to reformat to the same result' + '\n\n' + parts.join('') );
  }
  console.log(formattedCode);
} );
