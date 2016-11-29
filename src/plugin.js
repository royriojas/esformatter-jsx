const extend = require('extend');
const findParent = require('./find-parent');
const falafel = require('./falafel-helper');
const libFormat = require('./format-jsx');
const ignore = require('esformatter-ignore');
const unformatted = require('./default-unformatted');

module.exports = {
  setOptions(opts, esformatter) {
    const me = this;
    opts = opts || { };
    me.opts = opts;
    me._esformatter = esformatter;

    const jsxOptions = opts.jsx || { };

    me.jsxOptions = extend(true, {
      formatJSX: true,
      attrsOnSameLineAsTag: true,
      maxAttrsOnTag: null,
      firstAttributeOnSameLine: false,
      alignWithFirstAttribute: true,
      JSXExpressionsSingleLine: true,
      formatJSXExpressions: true,
      JSXAttributeQuotes: '', // empty means "as is"", 'single' or 'double' will use single or double quotes for JSX attributes
    }, jsxOptions);

    if (me.jsxOptions.maxAttrsOnTag < 1) {
      me.jsxOptions.maxAttrsOnTag = 1;
    }

    const htmlOptions = jsxOptions.htmlOptions || { };
    me.htmlOptions = extend(true, {
      brace_style: 'collapse', //eslint-disable-line
      indent_char: ' ', //eslint-disable-line
      // indentScripts: "keep",
      indent_size: 2, //eslint-disable-line
      max_preserve_newlines: 2, //eslint-disable-line
      preserve_newlines: true, //eslint-disable-line
      // indent_handlebars: true
      unformatted,
      wrap_line_length: 160 //eslint-disable-line
    }, htmlOptions);
  },

  stringBefore(code) {
    const me = this;
    if (!me.jsxOptions.formatJSX) {
      return code;
    }

    me._ignore = me._ignore || [];

    const _ignore = Object.create(ignore);
    me._ignore.push(_ignore);

    code = _ignore.stringBefore(code);

    me._templateLiterals = me._templateLiterals || [];

    const templateLiterals = [];

    code = falafel(code, (node) => {
      if (node.type === 'ClassProperty') {
        if (node.value) {
          const oldSource = node.source();

          const formattedProp = `${node.static ? 'static ' : ''
               }${node.key.source()  } = ${  node.value.source()
               }${oldSource.match(/;$/) ? ';' : ''}`;

          node.update(formattedProp);

        }
      }

      if (node.type === 'TemplateLiteral' && (!findParent(node, 'JSXAttribute') && !findParent(node, 'TemplateLiteral'))) {

        const idx = templateLiterals.length;
        const replaceString = `__TEMPORARY_VARIABLE__PLACEHOLDER___NODE__${  idx  }_`;

        templateLiterals.push({
          code: node.source(),
          replacedWith: replaceString,
        });

        node.update(replaceString);
      }

      if (node.type === 'ArrowFunctionExpression'
        || node.type === 'FunctionDeclaration'
        || node.type === 'ClassMethod'
        || node.type === 'FunctionExpression'
        || node.type === 'ObjectMethod') {

        node.update(node.source().replace(/^async\s+function/, 'async function'));
        node.update(node.source().replace(/^async\s+\(\)/, 'async ()'));
      }

      if (node.type === 'Decorator') {
        if (node.parent.type !== 'ClassMethod' && node.parent.type !== 'ClassProperty') {
          node.update(`${node.source().replace(/^\s*@/, '____decorator__at_sign___')  };/*__decorator__semi__open*/\n/*__decorator__semi__end*/`);
        }
      }

      if (node.type === 'SpreadProperty') {
        const _source = node.source().replace(/^\s*\.\.\./, '____esfmt_spread_sign___:');
        node.update(_source);
      }

    }).toString();

    const response = libFormat.replaceJSXExpressionContainers(code);
    me._jsxExpressionContainers = response.containers;
    me._templateLiterals.push(templateLiterals);
    return response.source;
  },
  _restoreTemplateLiterals(source) {
    const me = this;

    let templateLiterals = me._templateLiterals.pop();
    templateLiterals = templateLiterals || [];

    templateLiterals.forEach((entry) => {
      const code = entry.code;
      const replacedWith = entry.replacedWith;

      source = source.split(replacedWith).join(code);
    });

    return source;
  },
  stringAfter(code) {
    const me = this;

    if (!me.jsxOptions.formatJSX) {
      return code;
    }

    const jsxOptions = me.jsxOptions;

    code = libFormat.restoreJSXExpressionContainers(
      code,
      me._jsxExpressionContainers,
      jsxOptions.spaceInJSXExpressionContainers,
      jsxOptions.removeSpaceBeforeClosingJSX,
    );

    const htmlOptions = me.htmlOptions;

    const formatter = libFormat.create(htmlOptions, jsxOptions, me.opts, me._esformatter);

    let ast = falafel(code, (node) => {
      if (node.type !== 'JSXElement') {
        return;
      }
      const conditionalParent = findParent(node, 'ConditionalExpression');
      if (conditionalParent) {
        const formatted = formatter.format(node);
        node.update(formatted);

      }
    });

    code = ast.toString();

    // replace the spread operators
    code = code.replace(/____esfmt_spread_sign___\s*:\s*/g, '...');

    ast = falafel(code, (node) => {
      // support for ES7 Decorators
      if (node.type === 'CallExpression' && node.callee.source().indexOf('____decorator__at_sign___') > -1) {
        node.callee.update(node.callee.source().replace('____decorator__at_sign___', '@'));
      }
      if (node.type === 'Identifier' && node.source().indexOf('____decorator__at_sign___') > -1) {
        node.update(node.source().replace('____decorator__at_sign___', '@'));
      }
      if (node.type !== 'JSXElement') {
        return;
      }

      let formatted;
      if (!findParent(node, 'JSXElement')) {
        formatted = formatter.format(node);
        node.update(formatted);
      }
    });

    code = ast.toString();

    // this is to make sure all decorators comments were removed from the source
    code = code.replace(/;\s*\/\*__decorator__semi__open\*\/\n\s*\/\*__decorator__semi__end\*\//g, '');

    const _ignore = me._ignore.pop();

    code = _ignore.stringAfter(code);
    code = me._restoreTemplateLiterals(code);

    return code;
  },
};
