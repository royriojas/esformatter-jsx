var extend = require( 'extend' );
var findParent = require( './find-parent' );
var falafel = require( './falafel-helper' );

module.exports = {
  setOptions: function ( opts ) {
    var me = this;
    opts = opts || { };
    me.opts = opts;

    var jsxOptions = opts.jsx || { };

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

    var htmlOptions = jsxOptions.htmlOptions || { };
    me.htmlOptions = extend( true, {
      brace_style: 'collapse', //eslint-disable-line
      indent_char: ' ', //eslint-disable-line
      //indentScripts: "keep",
      indent_size: 2, //eslint-disable-line
      max_preserve_newlines: 2, //eslint-disable-line
      preserve_newlines: true, //eslint-disable-line
      //indent_handlebars: true
      unformatted: require( './default-unformatted' ),
      wrap_line_length: 160 //eslint-disable-line
    }, htmlOptions );
  },

  stringBefore: function ( code ) {
    var me = this;
    me.jsxElements = [ ];

    if ( !me.jsxOptions.formatJSX ) {
      return code;
    }

    var ast = falafel( code, function ( node ) {
      if ( node.type === 'JSXElement'
        && !findParent( node, 'JSXElement' ) ) {
        var index = me.jsxElements.length;
        me.jsxElements.push( { loc: node.loc, code: node.source() } );
        node.update( '<__ESFORMATTER__JSX_NODE_0_' + index + ' />' );
      }
    } );
    return ast.toString();
  },

  _restoreJSXElements: function ( source ) {
    var me = this;
    //new RegExp( '<__JSXExpression_0_' + idx + '\\s\\/>' )
    var jsxElements = me.jsxElements || [ ];

    jsxElements.forEach( function ( entry, idx ) {
      var container = entry.code;
      var rx = new RegExp( '<__ESFORMATTER__JSX_NODE_0_' + idx + '\\s\\/>' );

      // this is causing bug#13 using split/join fixed the issue
      // source = source.replace( rx, container );
      source = source.split( rx ).join( container );
    } );
    return source;
  },
  stringAfter: function ( code ) {
    var me = this;

    if ( !me.jsxOptions.formatJSX ) {
      return code;
    }

    code = me._restoreJSXElements( code );

    var jsxOptions = me.jsxOptions;
    var htmlOptions = me.htmlOptions;

    var formatter = require( './format-jsx' ).create( htmlOptions, jsxOptions, me.opts );


    var ast = falafel( code, function ( node ) {
      if ( node.type !== 'JSXElement' ) {
        return;
      }
      var conditionalParent = findParent( node, 'ConditionalExpression' );
      if ( conditionalParent ) {
        var formatted = formatter.format( node );
        node.update( formatted );
        return;
      }
    } );

    code = ast.toString();

    ast = falafel( code, function ( node ) {
      if ( node.type !== 'JSXElement' ) {
        return;
      }

      var formatted;
      // if ( findParent( node, 'JSXExpressionContainer' )
      //   && (node.parent.type !== 'JSXElement') ) {
      //   formatted = formatter.format( node );
      //   node.update( formatted );
      //   return;
      // }

      if ( !findParent( node, 'JSXElement' ) ) {
        formatted = formatter.format( node );
        node.update( formatted );
      }
    } );


    return ast.toString();
  }
};
