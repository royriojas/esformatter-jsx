var falafel = require('fresh-falafel');
var defaults = require('lodash.defaults');
// inject esprima to fresh-falafel
falafel.setParser(require('esprima-fb').parse);

module.exports = {

  setOptions: function (opts) {
    var me = this;
    opts = opts || {};

    var jsxOptions = opts['jsx'] || {};

    me.jsxOptions = defaults(jsxOptions, {
      formatJSX: true,
      attrsOnSameLineAsTag: true,
      maxAttrsOnTag: null,
      firstAttributeOnSameLine: false,
      alignWithFirstAttribute: true
    });

    if (me.jsxOptions.maxAttrsOnTag < 1) {
      me.jsxOptions.maxAttrsOnTag = 1;
    }

    var htmlOptions = jsxOptions.htmlOptions || {};
    me.htmlOptions = defaults(htmlOptions ,  {
      brace_style: "collapse",
      indent_char: " ",
      //indentScripts: "keep",
      indent_size: 2,
      max_preserve_newlines: 2,
      preserve_newlines: true
      //indent_handlebars: true
      //unformatted: ["a", "sub", "sup", "b", "i", "u" ],
      //wrapLineLength: 0
    });

    //}
  },

  _sections: [],
  stringBefore: function (code) {
    var me = this;
    // array of found jsx sections
    var sections = me._sections = [];

    // parse the code
    code = falafel(code,{ loc: true }, function (node) {
      // if a JSX node
      if (node.type === 'JSXElement' && node.parent.type !== 'JSXElement') {
        // save the source
        var source = node.source();
        sections.push( source );
        // replace it with a token like `void(0)/*$$$_XJS_ELEMENT_$$$*/`
        // the index is passed to void that way we can restore them later
        // we just want to temporary ignore those nodes because esformatter
        // does not play well yet with jsx syntax.
        // Actually rocambole already uses esprima-fb, but there is a bug in esprima-fb
        // that will make very risky to use it in esformatter at this time. basically if
        // a regex expression is present in the file to be beautified it will be duplicated
        // Really sad, really lame. check:
        //
        // https://github.com/millermedeiros/esformatter/issues/242
        // https://github.com/facebook/esprima/issues/74
        //
        node.update('void(' + (sections.length - 1) + '/*$$$_XJS_ELEMENT_$$$*/)');
      }
    });

    return code.toString();
  },

  _prepareToProcessTags: function (source) {
    var code = falafel(source, { loc: true }, function (node) {
      if (node.type === 'JSXElement') {
        if (node.children && node.children.length > 0) {
          node.openingElement.update(node.openingElement.source() + '\n');
          node.closingElement.update('\n' +node.closingElement.source());
        }
      }
    });
    return this._removeEmptyLines(code.toString());
  },

  _removeEmptyLines: function (code) {
    return code.split('\n').filter(function (line) {
      return (line.trim() !== '');
    }).join('\n');
  },

  _operateOnOpenTags: function (source) {
    var me = this;
    var code = falafel(source, { loc: true }, function (node) {
      if (node.type === 'JSXOpeningElement') {
        if (node.attributes && node.attributes.length > (me.jsxOptions.maxAttrsOnTag || 0)) {
          var first = node.attributes[0];
          var firstAttributeInSameLine = me.jsxOptions.firstAttributeOnSameLine;

          var alignWith = me.jsxOptions.alignWithFirstAttribute ? first.loc.start.column + 1 : node.loc.start.column + 3;
          var tabPrefix = (new Array(alignWith)).join(' ');


          var index = 0;
          node.attributes.forEach(function (cNode) {
            index++;
            if (firstAttributeInSameLine && index === 1) {
              //first = false;
              return cNode;
            }

            cNode.update('\n'+ tabPrefix + cNode.source());
          });
        }
      }
    });

    return code.toString();
  },

  stringAfter: function (code) {
    var me = this;
    var sections = me._sections || [];
    // no jsx content found in the file
    if (sections.length === 0) {
      // just return the code as is
      return code;
    }
    // otherwise
    return falafel(code, { loc: true },function (node) {
      // check for the node we added, it should be an UnaryExpression, void and have the
      // custom comment we have included
      if (node.type === 'UnaryExpression' &&
        node.operator === 'void' &&
        node.source().match(/void\s*\(\s*(\d+)\s*\/\*\$\$\$_XJS_ELEMENT_\$\$\$\*\/\s*\)/g)
        ) {
        // if it is a comment, get the argument passed
        var nodeIdx = parseInt(node.argument.source(), 10);
        // get the value from that node from the tokens we have stored before
        var source = sections[nodeIdx];

        var jsxOptions = me.jsxOptions;

        if (jsxOptions.formatJSX) {
          var beautifier = require('js-beautify');
          var first = false;

          source = me._prepareToProcessTags(source);

          source = beautifier.html(source, me.htmlOptions);

          if ( !jsxOptions.attrsOnSameLineAsTag ) {
            source = me._operateOnOpenTags(source);
          }

          source = me._removeEmptyLines(source).split('\n').map(function (line) {
            line = line.replace(/\s+$/g, '');
            if (!first) {
              first = true;
              return line;
            }
            var alingWith = (node.loc.start.column + 1);
            return ((new Array(alingWith)).join(' ')) + line;
          }).join('\n');
        }
        node.update(source);
      }
    }).toString();
  }
};
