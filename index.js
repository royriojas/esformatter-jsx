var falafel = require( 'falafel-espree' );
var extend = require( 'extend' );
var parserOpts = {
  // attach range information to each node
  range: true,

  // attach line/column location information to each node
  loc: true,

  // create a top-level comments array containing all comments
  comments: true,

  // attach comments to the closest relevant node as leadingComments and
  // trailingComments
  attachComment: true,

  // create a top-level tokens array containing all tokens
  tokens: true,

  // try to continue parsing if an error is encountered, store errors in a
  // top-level errors array
  tolerant: true,

  // specify parsing features (default only has blockBindings: true)
  // setting this option replaces the default values
  ecmaFeatures: {
    // enable parsing of arrow functions
    arrowFunctions: true,

    // enable parsing of let/const
    blockBindings: true,

    // enable parsing of destructured arrays and objects
    destructuring: true,

    // enable parsing of regular expression y flag
    regexYFlag: true,

    // enable parsing of regular expression u flag
    regexUFlag: true,

    // enable parsing of template strings
    templateStrings: true,

    // enable parsing of binary literals
    binaryLiterals: true,

    // enable parsing of ES6 octal literals
    octalLiterals: true,

    // enable parsing unicode code point escape sequences
    unicodeCodePointEscapes: true,

    // enable parsing of default parameters
    defaultParams: true,

    // enable parsing of rest parameters
    restParams: true,

    // enable parsing of for-of statement
    forOf: true,

    // enable parsing computed object literal properties
    objectLiteralComputedProperties: true,

    // enable parsing of shorthand object literal methods
    objectLiteralShorthandMethods: true,

    // enable parsing of shorthand object literal properties
    objectLiteralShorthandProperties: true,

    // Allow duplicate object literal properties (except '__proto__')
    objectLiteralDuplicateProperties: true,

    // enable parsing of generators/yield
    generators: true,

    // enable parsing spread operator
    spread: true,

    // enable parsing classes
    classes: true,

    // enable parsing of modules
    modules: true,

    // enable React JSX parsing
    jsx: true,

    // enable return in global scope
    globalReturn: true
  }
};

function hasXJSElementAsParent( node ) {
  while (node.parent) {
    if ( node.parent.type === 'JSXElement' ) {
      return true;
    }
    node = node.parent;
  }
  return false;
}

module.exports = {
  setOptions: function ( opts ) {
    var me = this;
    opts = opts || {};

    var jsxOptions = opts.jsx || {};

    me.jsxOptions = extend( true, {
      formatJSX: true,
      attrsOnSameLineAsTag: true,
      maxAttrsOnTag: null,
      firstAttributeOnSameLine: false,
      alignWithFirstAttribute: true
    }, jsxOptions );

    if ( me.jsxOptions.maxAttrsOnTag < 1 ) {
      me.jsxOptions.maxAttrsOnTag = 1;
    }

    var htmlOptions = jsxOptions.htmlOptions || {};
    me.htmlOptions = extend( true, {
      brace_style: 'collapse', //eslint-disable-line
      indent_char: ' ', //eslint-disable-line
      //indentScripts: "keep",
      indent_size: 2, //eslint-disable-line
      max_preserve_newlines: 2, //eslint-disable-line
      preserve_newlines: true, //eslint-disable-line
      //indent_handlebars: true
      unformatted: [
        'a',
        'span',
        'img',
        'bdo',
        'em',
        'strong',
        'dfn',
        'code',
        'samp',
        'kbd',
        'var',
        'cite',
        'abbr',
        'acronym',
        'q',
        'sub',
        'sup',
        'tt',
        'i',
        'b',
        'big',
        'small',
        'u',
        's',
        'strike',
        'font',
        'ins',
        'del',
        'pre',
        'address',
        'dt',
        'h1',
        'h2',
        'h3',
        'h4',
        'h5',
        'h6'
      ]
      //wrapLineLength: 0
    }, htmlOptions );
  },

  _keepUnformatted: function ( tag ) {
    var me = this;
    var unformatted = me.htmlOptions.unformatted || [];

    return unformatted.indexOf( tag ) > -1;
  },
  _prepareToProcessTags: function ( source ) {
    var me = this;
    var code = falafel( source, parserOpts, function ( node ) {
      if ( node.type === 'JSXElement' && !node.selfClosing ) {
        if ( node.children && node.children.length > 0 ) {
          if ( !me._keepUnformatted( node.openingElement.name.name ) ) {
            node.openingElement.update( node.openingElement.source() + '\n' );
            node.closingElement.update( '\n' + node.closingElement.source() );
          } else {
            //console.log('source before', );
            var childrenSource = node.children.map( function ( n, idx ) {
              var src = n.source().replace( /\n/g, ' ' ).replace( /\s+/g, ' ' );

              var prev = node.children[ idx - 1 ] || {};
              var next = node.children[ idx + 1 ] || {};

              if ( src.trim() === ''
                && prev.type === 'JSXExpressionContainer'
                && next.type === 'JSXExpressionContainer' ) {
                src = '';
              }
              return src;
            } ).join( '' ).trim();

            var openTag = node.openingElement.source().replace( /\n/g, ' ' ).replace( /\s+/g, ' ' ).trim();
            var closeTag = node.closingElement.source().replace( /\n/g, ' ' ).replace( /\s+/g, ' ' ).trim();
            var nSource = openTag + childrenSource + closeTag;

            node.update( nSource );
            //console.log('source after', node.children.map(function (n) { return n.source() } ).join(''));
          }
        }
      }
    } );
    return this._removeEmptyLines( code.toString() );
  },
  _removeEmptyLines: function ( code ) {
    return code.split( '\n' ).filter( function ( line ) {
      return (line.trim() !== '');
    } ).join( '\n' );
  },
  _operateOnOpenTags: function ( source ) {
    var me = this;
    var code = falafel( source, parserOpts, function ( node ) {
      if ( node.type === 'JSXOpeningElement' ) {
        if ( node.attributes && node.attributes.length > (me.jsxOptions.maxAttrsOnTag || 0) ) {
          var first = node.attributes[ 0 ];
          var firstAttributeInSameLine = me.jsxOptions.firstAttributeOnSameLine;

          var alignWith = me.jsxOptions.alignWithFirstAttribute ? first.loc.start.column + 1 : node.loc.start.column + 3;
          var tabPrefix = (new Array( alignWith )).join( ' ' );

          var index = 0;
          node.attributes.forEach( function ( cNode ) {
            index++;
            if ( firstAttributeInSameLine && index === 1 ) {
              //first = false;
              return cNode;
            }

            cNode.update( '\n' + tabPrefix + cNode.source() );
          } );
        }
      }
    } );

    return code.toString();
  },
  stringAfter: function ( code ) {
    var me = this;
    //    var sections = me._sections || [];
    //    // no jsx content found in the file
    //    if ( sections.length === 0 ) {
    //      // just return the code as is
    //      return code;
    //    }
    // otherwise
    return falafel( code, parserOpts, function ( node ) {
      // check for the node we added, it should be an UnaryExpression, void and have the
      // custom comment we have included
      if ( node.type === 'JSXElement' && !hasXJSElementAsParent( node ) ) {
        // if it is a comment, get the argument passed
        //var nodeIdx = parseInt( node.argument.source(), 10 );
        // get the value from that node from the tokens we have stored before
        var source = node.source(); //sections[ nodeIdx ];

        var jsxOptions = me.jsxOptions;

        if ( jsxOptions.formatJSX ) {

          var beautifier = require( 'js-beautify' );
          var first = false;

          if ( !jsxOptions.attrsOnSameLineAsTag ) {
            source = me._prepareToProcessTags( source );
          }

          source = beautifier.html( source, me.htmlOptions );

          if ( !jsxOptions.attrsOnSameLineAsTag ) {
            source = me._operateOnOpenTags( source );
          }
          //console.log('\nnode\n',source, node.parent.type, '\nnode-end\n');
          source = me._removeEmptyLines( source ).split( '\n' ).map( function ( line ) {
            line = line.replace( /\s+$/g, '' );
            if ( !first ) {
              first = true;
              return line;
            }
            var alingWith = (node.loc.start.column + 1);
            //            console.log('>> line', line, alingWith);
            return ( (new Array( alingWith )).join( ' ' )) + line;
          } ).join( '\n' );

          //console.log( '>>>', node.parent.type );
          if ( node.parent && node.parent.type === 'ConditionalExpression' ) {
            source = source.split( '\n' ).map( function ( line ) {
              return line.trim();
            } ).join( '' );
          }
        }
        node.update( source );
      }
    } ).toString();
  }
};
