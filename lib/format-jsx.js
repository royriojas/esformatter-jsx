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

      var loc = node.loc || node.node.loc;

      response.push( {
        jsxAttribute: attribute,
        code: node.source(),
        column: loc.start.column
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

function alingText( source, node, htmlOptions ) {
  var jsxParent = findParent( node, 'JSXElement' );
  var column = node.loc.start.column;
  if ( jsxParent ) {
    column = node.loc.start.column - jsxParent.loc.start.column;
  }

  var first = false;
  return removeEmptyLines( source ).split( '\n' ).map( function ( line ) {
    line = line.replace( /\s+$/g, '' );
    if ( !first ) {
      first = true;
      return line;
    }
    var alingWith = (column + 1);
    if ( alingWith < 0 ) {
      return line;
    }
    return ( (new Array( alingWith )).join( htmlOptions.indent_char )) + line;
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

function restoreContainers( source, containers, space, removeSpace ) {

  iterateReverse( containers, function ( entry, idx ) {
    var container = entry.code;
    var column = entry.column;
    var rx = entry.jsxAttribute ?
      new RegExp( '[\'"]__JSXattribute_0_' + idx + '[\'"]' )
      : new RegExp( '<__JSXExpression_0_' + idx + '\\s\\/>' );

    if ( !entry.jsxAttribute ) {
      container = addSpaces( container, column );
    }

    if ( typeof space !== 'string' ) {
      space = ' '; // 1 space by default
    }
    // this line was causing bug#13
    // source = source.replace( rx, container.replace( /^\{\s*/, '{' + space ).replace( /\s*\}$/, space + '}' ) );
    source = source.split( rx ).join( container.replace( /^\{\s*/, '{' + space ).replace( /\s*\}$/, space + '}' ) );
  } );

  if ( removeSpace === true ) {
    source = source.replace( /\s+\/>/g, '/>' );
  }

  return source;
}

module.exports = {
  replaceJSXExpressionContainers: replaceJSXExpressionContainer,
  restoreJSXExpressionContainers: restoreContainers,
  create: function ( htmlOptions, jsxOptions, options, esformatter ) {

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
      },
      operateOnOpenTags: function ( source, _htmlOptions ) {
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

              var indentSize = _htmlOptions.indent_size || 4;
              var indentChar = _htmlOptions.indent_char || ' ';

              var alignWith = me.jsxOptions.alignWithFirstAttribute ? first.loc.start.column : node.loc.start.column + indentSize;
              var tabPrefix = (new Array( alignWith + 1 )).join( indentChar );

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

              if ( me.jsxOptions.closingTagOnNewLine ) {
                // If you find a closing tag (including a self-closing tag like />), add a new line, matching the current alignWith
                var closingTagTabPrefix = (new Array( node.loc.start.column + 1 )).join( indentChar );
                node.update( node.source().replace( /(\/?\>)$/, '\n' + closingTagTabPrefix + '$1' ) );
              }
            }
          }

        } );

        return ast.toString();
      },

      _recursiveFormat: function ( node ) {
        var originalSource = node.source();

        var source = originalSource;

        var code;

        try {
          if ( node.type === 'ObjectExpression' || node.type === 'ArrayExpression' ) {
            source = 'var __OE_AE_VAR_TOKEN__ = ' + source;
          }
          var hadBindShorthand = false;
          if ( (node.type === 'BindExpression' || node.type === 'CallExpression') && source.match( /^::/ ) ) {
            source = source.replace( '::', '' );
            hadBindShorthand = true;
          }

          code = esformatter.format( source, options ).trim();

          if ( node.type === 'BindExpression' || node.type === 'CallExpression' && hadBindShorthand ) {
            code = '::' + code;
          }

          falafel( code, function ( _node ) {
            // this deals with the expressions that can be either object expressions or arrays
            if ( _node.type === 'VariableDeclarator' && _node.id.name === '__OE_AE_VAR_TOKEN__' ) {
              if ( _node.init.type === 'ObjectExpression' || _node.init.type === 'ArrayExpression' ) {
                code = _node.init.source();
                if ( jsxOptions.JSXExpressionsSingleLine ) {
                  code = code.replace( /\n\s+/g, ' ' );
                  code = code.replace( /\n/g, ' ' );
                }
              // code = code.replace( /\n/g, '' );
              }
            }
          } );
        } catch (ex) {
          code = originalSource;
        }
        return code;
      },

      format: function ( ast, noAlign ) {
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
          source = me.operateOnOpenTags( source, htmlOptions );
        }

        if ( !noAlign ) {
          source = alingText( source, ast, htmlOptions );
        }

        source = restoreContainers( source, containers, jsxOptions.spaceInJSXExpressionContainers, jsxOptions.removeSpaceBeforeClosingJSX );

        if ( containers.length > 0 ) {
          var expressionContainers = { };
          var ast2 = falafel( source, function ( node ) {

            if ( node.type === 'JSXExpressionContainer' && !findParent( node, 'JSXExpressionContainer' ) ) {
              if ( node.expression.type === 'Literal' || node.expression.type === 'Identifier' ) {
                return;
              }
              var idx = Object.keys( expressionContainers ).length;
              var token = '__TT__TOKEN__TT__' + idx + '_T_';
              var formatted = node.expression.source();

              if ( node.expression.type === 'JSXElement' ) {
                formatted = me.format( node.expression, true );
              } else if (
                node.expression.type !== 'JSXEmptyExpression'
                && node.expression.type !== 'StringLiteral'
                && node.expression.type !== 'TemplateLiteral'
                && jsxOptions.formatJSXExpressions ) {
                formatted = me._recursiveFormat( node.expression );
              }

              expressionContainers[ token ] = {
                token: token,
                formatted: formatted,
                index: idx,
                type: node.expression.type
              };

              node.expression.update( token );

            }
          } );

          source = ast2.toString().split( '\n' );

          source = source.map( function ( line ) {
            var keys = Object.keys( expressionContainers );
            keys.forEach( function ( key ) {
              var index = line.indexOf( key );
              if ( index > -1 ) {
                var theExpression = expressionContainers[ key ];
                var parts = theExpression.formatted.split( '\n' ).map( function ( part, i ) {
                  if ( i === 0 ) {
                    return part;
                  }
                  if ( theExpression.type === 'TemplateLiteral' ) {
                    return part;
                  }
                  return new Array( index + 1 ).join( ' ' ) + part;
                } );

                // had to use split/join instead of plain replace because
                // '$' symbols in code were some how eaten by the replace op.
                line = line.split( key ).join( parts.join( '\n' ) );
                line = line.replace( /\s+$/, '' );

                delete expressionContainers[ key ];
              }
            } );
            return line.replace( /\s+$/, '' );
          } ).join( '\n' );

        }
        return source;
      }
    };

    return ins;
  }
};
