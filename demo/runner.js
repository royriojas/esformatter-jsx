var esformatter = require( 'esformatter' );
esformatter.register( require( '../lib/plugin' ) );
var chalk = require('chalk');
var fs = require( 'fs' );
var path = require( 'path' );
var jsdiff = require('diff');

var files = fs.readdirSync( './entry/' );

files.forEach( function ( file ) {
  var codeStr = fs.readFileSync( './entry/' + file ).toString();
  var options = {
  "jsx": {
    "attrsOnSameLineAsTag": false,
    "maxAttrsOnTag": 1,
    "firstAttributeOnSameLine": false,
    "alignWithFirstAttribute": false
  },

};

  var formattedCode = esformatter.format( codeStr, options );

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
} );
