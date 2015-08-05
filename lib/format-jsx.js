var findParent = require( './find-parent' );
var falafel = require( './falafel-helper' );
var iterateReverse = require( './iterate-reverse' );

function replaceJSXExpressionContainer( source ) {
  var response = [ ];
  var index;

  var ast = falafel( source, function ( node ) {
    if ( node.type === 'JSXExpressionContainer' ) {
      var attribute = false;
      var replacement;
      index = response.length;

      if ( findParent( node, 'JSXAttribute' ) ) {
        attribute = true;
        replacement = '"__JSXattribute_0_' + index + '"';
      } else {
        replacement = '<__JSXExpression_0_' + index + ' />';
      }
      response.push( {
        jsxAttribute: attribute,
        code: node.source(),
        column: node.loc.start.column
      } );

      node.update( replacement );
    }
  } );



  return { containers: response, source: ast.toString() };
}

function removeEmptyLines( code ) {
  return code.split( '\n' ).filter( function ( line ) {
    return (line.trim() !== '');
  } ).join( '\n' );
}

function alingText( source, node ) {
  var jsxParent = findParent( node, 'JSXElement' );
  var column = node.loc.start.column;
  if ( jsxParent ) {
    column = node.loc.start.column - jsxParent.loc.start.column;
  }
  var jsxExpression = findParent( node, 'JSXExpressionContainer' );
  if ( jsxExpression ) {
    column += 2;
  }
  var first = false;
  return removeEmptyLines( source ).split( '\n' ).map( function ( line ) {
    line = line.replace( /\s+$/g, '' );
    if ( !first ) {
      first = true;
      return line;
    }
    var alingWith = (column + 1);

    return ( (new Array( alingWith )).join( ' ' )) + line;
  } ).join( '\n' );
}

function addSpaces( container, column ) {
  var parts = container.split( '\n' );
  var first = false;

  parts = parts.map( function ( line ) {
    if ( !first ) {
      first = true;
      return line;
    }
    return (new Array( column + 1 )).join( ' ' ) + line;
  } );

  return parts.join( '\n' );
}

function restoreContainers( source, containers, space ) {

  iterateReverse( containers, function ( entry, idx ) {
    var container = entry.code;
    var column = entry.column;
    var rx = entry.jsxAttribute ?
      new RegExp( '"__JSXattribute_0_' + idx + '"' )
      : new RegExp( '<__JSXExpression_0_' + idx + '\\s\\/>' );

    if ( !entry.jsxAttribute ) {
      container = addSpaces( container, column );
    }

    if ( typeof space !== 'string' ) {
      space = ' '; // 1 space by default
    }

    source = source.replace( rx, container.replace( /^\{\s*/, '{' + space ).replace( /\s*\}$/, space + '}' ) );
  } );
  return source;
}

module.exports = {
  create: function ( htmlOptions, jsxOptions ) {

    var ins = {
      htmlOptions: htmlOptions,
      jsxOptions: jsxOptions,
      _keepUnformatted: function ( tag ) {
        var me = this;
        var unformatted = me.htmlOptions.unformatted || [ ];

        return unformatted.indexOf( tag ) > -1;
      },
      prepareToProcessTags: function ( source ) {
        var me = this;
        var code = falafel( source, function ( node ) {
          if ( node.type === 'JSXElement' && !node.selfClosing ) {
            if ( node.children && node.children.length > 0 ) {
              if ( !me._keepUnformatted( node.openingElement.name.name ) ) {
                node.openingElement.update( node.openingElement.source() + '\n' );
                node.closingElement.update( '\n' + node.closingElement.source() );
              } else {

                var childrenSource = node.children.map( function ( n, idx ) {
                  var src = n.source().replace( /\n/g, ' ' ).replace( /\s+/g, ' ' );

                  var prev = node.children[ idx - 1 ] || { };
                  var next = node.children[ idx + 1 ] || { };

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
              }
            }
          }
        } );
        return removeEmptyLines( code.toString() );
      //        return removeEmptyLines( ast.toString() );
      },
      operateOnOpenTags: function ( source ) {
        var me = this;

        // make sure tags are in a single line
        var ast = falafel( source, function ( node ) {
          if ( node.type === 'JSXOpeningElement' ) {
            if ( node.attributes && node.attributes.length > (me.jsxOptions.maxAttrsOnTag || 0) ) {
              if ( node.selfClosing ) {
                node.update( node.source().split( /\n/ ).map( function ( line ) {
                  return line.trim();
                } ).join( ' ' ) );
              }
            }
          }
        } );

        ast = falafel( ast.toString(), function ( node ) {
          if ( node.type === 'JSXOpeningElement' ) {
            if ( node.attributes && node.attributes.length > (me.jsxOptions.maxAttrsOnTag || 0) ) {
              var first = node.attributes[ 0 ];
              var firstAttributeInSameLine = me.jsxOptions.firstAttributeOnSameLine;

              var alignWith = me.jsxOptions.alignWithFirstAttribute ? first.loc.start.column + 1 : node.loc.start.column + 3;
              var tabPrefix = (new Array( alignWith )).join( ' ' );

              var index = 0;
              //console.log( node.attributes );
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

        return ast.toString();
      },

      format: function ( ast ) {
        var me = this;
        var source = ast.source();
        var response = replaceJSXExpressionContainer( source );

        var containers = response.containers;
        source = response.source;

        if ( !jsxOptions.attrsOnSameLineAsTag ) {
          source = me.prepareToProcessTags( source );
        }

        var beautifier = require( 'js-beautify' );

        source = beautifier.html( source, htmlOptions );

        if ( !jsxOptions.attrsOnSameLineAsTag ) {
          source = me.operateOnOpenTags( source );
        }

        source = restoreContainers( source, containers, jsxOptions.spaceInJSXExpressionContainers );

        source = alingText( source, ast );

        return source;
      }
    };

    return ins;
  }
};
