const findParent = require('./find-parent');
const falafel = require('./falafel-helper');
const iterateReverse = require('./iterate-reverse');
const beautifier = require('js-beautify');
const transformString = require('./transform-string');

function replaceJSXExpressionContainer(source) {
  const response = [];
  let index;

  const ast = falafel(source, (node) => {
    if (node.type === 'JSXExpressionContainer') {
      let attribute = false;
      let replacement;
      index = response.length;

      if (findParent(node, 'JSXAttribute')) {
        attribute = true;
        replacement = `"__JSXattribute_0_${  index  }"`;
      } else {
        replacement = `<__JSXExpression_0_${  index  } />`;
      }

      const loc = node.loc || node.node.loc;

      response.push({
        jsxAttribute: attribute,
        code: node.source(),
        column: loc.start.column,
      });

      node.update(replacement);
    }
  });

  return { containers: response, source: ast.toString() };
}

function removeEmptyLines(code) {
  return code.split('\n').filter(line => (line.trim() !== '')).join('\n');
}

function alingText(source, node, htmlOptions) {
  const jsxParent = findParent(node, 'JSXElement');
  let column = node.loc.start.column;
  if (jsxParent) {
    column = node.loc.start.column - jsxParent.loc.start.column;
  }

  let first = false;
  return removeEmptyLines(source).split('\n').map((line) => {
    line = line.replace(/\s+$/g, '');
    if (!first) {
      first = true;
      return line;
    }
    const alingWith = (column + 1);
    if (alingWith < 0) {
      return line;
    }
    return ((new Array(alingWith)).join(htmlOptions.indent_char)) + line;
  }).join('\n');
}

function addSpaces(container, column) {
  let parts = container.split('\n');
  let first = false;

  parts = parts.map((line) => {
    if (!first) {
      first = true;
      return line;
    }
    return (new Array(column + 1)).join(' ') + line;
  });

  return parts.join('\n');
}

function restoreContainers(source, containers, space, removeSpace) {

  iterateReverse(containers, (entry, idx) => {
    let container = entry.code;
    const column = entry.column;
    const rx = entry.jsxAttribute ?
      new RegExp(`['"]__JSXattribute_0_${  idx  }['"]`)
      : new RegExp(`<__JSXExpression_0_${  idx  }\\s\\/>`);

    if (!entry.jsxAttribute) {
      container = addSpaces(container, column);
    }

    if (typeof space !== 'string') {
      space = ' '; // 1 space by default
    }
    // this line was causing bug#13
    // source = source.replace( rx, container.replace( /^\{\s*/, '{' + space ).replace( /\s*\}$/, space + '}' ) );
    source = source.split(rx).join(container.replace(/^\{\s*/, `{${  space}`).replace(/\s*\}$/, `${space  }}`));
  });

  if (removeSpace === true) {
    source = source.replace(/\s+\/>/g, '/>');
  }

  return source;
}

module.exports = {
  replaceJSXExpressionContainers: replaceJSXExpressionContainer,
  restoreJSXExpressionContainers: restoreContainers,
  create(htmlOptions, jsxOptions, options, esformatter) {

    const ins = {
      htmlOptions,
      jsxOptions,
      _keepUnformatted(tag) {
        const me = this;
        const unformatted = me.htmlOptions.unformatted || [];

        return unformatted.indexOf(tag) > -1;
      },
      prepareToProcessTags(source) {
        const me = this;
        const code = falafel(source, (node) => {
          if (node.type === 'JSXElement' && !node.selfClosing) {
            if (node.children && node.children.length > 0) {
              if (!me._keepUnformatted(node.openingElement.name.name)) {
                node.openingElement.update(`${node.openingElement.source()  }\n`);
                node.closingElement.update(`\n${  node.closingElement.source()}`);
              } else {

                const childrenSource = node.children.map((n, idx) => {
                  let src = n.source().replace(/\n/g, ' ').replace(/\s+/g, ' ');

                  const prev = node.children[idx - 1] || { };
                  const next = node.children[idx + 1] || { };

                  if (src.trim() === ''
                    && prev.type === 'JSXExpressionContainer'
                    && next.type === 'JSXExpressionContainer') {
                    src = '';
                  }
                  return src;
                }).join('').trim();

                const openTag = node.openingElement.source().replace(/\n/g, ' ').replace(/\s+/g, ' ').trim();
                const closeTag = node.closingElement.source().replace(/\n/g, ' ').replace(/\s+/g, ' ').trim();
                const nSource = openTag + childrenSource + closeTag;

                node.update(nSource);
              }
            }
          }
        });
        return removeEmptyLines(code.toString());
      },
      operateOnOpenTags(source, _htmlOptions) {
        const me = this;

        // make sure tags are in a single line
        let ast = falafel(source, (node) => {
          if (node.type === 'JSXOpeningElement') {
            if (node.attributes && node.attributes.length > (me.jsxOptions.maxAttrsOnTag || 0)) {
              if (node.selfClosing) {
                node.update(node.source().split(/\n/).map(line => line.trim()).join(' '));
              }
            }
          }
        });

        ast = falafel(ast.toString(), (node) => {
          if (node.type === 'JSXOpeningElement') {
            if (node.attributes && node.attributes.length > (me.jsxOptions.maxAttrsOnTag || 0)) {
              const first = node.attributes[0];
              const firstAttributeInSameLine = me.jsxOptions.firstAttributeOnSameLine;

              const indentSize = _htmlOptions.indent_size || 4;
              const indentChar = _htmlOptions.indent_char || ' ';

              const alignWith = me.jsxOptions.alignWithFirstAttribute ? first.loc.start.column : node.loc.start.column + indentSize;
              const tabPrefix = (new Array(alignWith + 1)).join(indentChar);

              let index = 0;
              // console.log( node.attributes );
              node.attributes.forEach((cNode) => {
                index++; // eslint-disable-line
                if (firstAttributeInSameLine && index === 1) {
                  // first = false;
                  return;
                }

                cNode.update(`\n${  tabPrefix  }${cNode.source()}`);
              });

              if (me.jsxOptions.closingTagOnNewLine) {
                // If you find a closing tag (including a self-closing tag like />), add a new line, matching the current alignWith
                const closingTagTabPrefix = (new Array(node.loc.start.column + 1)).join(indentChar);
                node.update(node.source().replace(/(\/?>)$/, `\n${  closingTagTabPrefix  }$1`));
              }
            }
          }

        });

        return ast.toString();
      },

      _recursiveFormat(node) {
        const originalSource = node.source();

        let source = originalSource;

        let code;

        try {
          if (node.type === 'ObjectExpression' || node.type === 'ArrayExpression') {
            source = `var __OE_AE_VAR_TOKEN__ = ${  source}`;
          }
          let hadBindShorthand = false;
          if ((node.type === 'BindExpression' || node.type === 'CallExpression') && source.match(/^::/)) {
            source = source.replace('::', '');
            hadBindShorthand = true;
          }

          code = esformatter.format(source, options).trim();

          if (node.type === 'BindExpression' || node.type === 'CallExpression' && hadBindShorthand) {
            code = `::${  code}`;
          }

          falafel(code, (_node) => {
            // this deals with the expressions that can be either object expressions or arrays
            if (_node.type === 'VariableDeclarator' && _node.id.name === '__OE_AE_VAR_TOKEN__') {
              if (_node.init.type === 'ObjectExpression' || _node.init.type === 'ArrayExpression') {
                code = _node.init.source();
                if (jsxOptions.JSXExpressionsSingleLine) {
                  code = code.replace(/\n\s+/g, ' ');
                  code = code.replace(/\n/g, ' ');
                }
              // code = code.replace( /\n/g, '' );
              }
            }
          });
        } catch (ex) {
          code = originalSource;
        }
        return code;
      },

      format(ast, noAlign) {
        const me = this;
        let source = ast.source();
        const response = replaceJSXExpressionContainer(source);

        const containers = response.containers;
        source = response.source;

        if (!jsxOptions.attrsOnSameLineAsTag) {
          source = me.prepareToProcessTags(source);
        }

        source = beautifier.html(source, htmlOptions);

        if (!jsxOptions.attrsOnSameLineAsTag) {
          source = me.operateOnOpenTags(source, htmlOptions);
        }

        if (!noAlign) {
          source = alingText(source, ast, htmlOptions);
        }

        source = restoreContainers(source, containers, jsxOptions.spaceInJSXExpressionContainers, jsxOptions.removeSpaceBeforeClosingJSX);

        if (containers.length > 0 || jsxOptions.JSXAttributeQuotes) {
          const expressionContainers = { };
          const ast2 = falafel(source, (node) => {
            if (node.type === 'JSXAttribute' && node.value && node.value.type === 'StringLiteral' && jsxOptions.JSXAttributeQuotes) {
              const jsxAttrValue = node.value;
              const attrValue = transformString(jsxAttrValue.source(), { type: jsxOptions.JSXAttributeQuotes, avoidEscape: true });
              jsxAttrValue.update(attrValue);
            }

            if (node.type === 'JSXExpressionContainer' && !findParent(node, 'JSXExpressionContainer')) {
              if (node.expression.type === 'Literal' || node.expression.type === 'Identifier') {
                return;
              }
              const idx = Object.keys(expressionContainers).length;
              const token = `__TT__TOKEN__TT__${  idx  }_T_`;
              let formatted = node.expression.source();

              if (node.expression.type === 'JSXElement') {
                formatted = me.format(node.expression, true);
              } else if (
                node.expression.type !== 'JSXEmptyExpression'
                && node.expression.type !== 'StringLiteral'
                && node.expression.type !== 'TemplateLiteral'
                && jsxOptions.formatJSXExpressions) {
                formatted = me._recursiveFormat(node.expression);
              }

              expressionContainers[token] = {
                token,
                formatted,
                index: idx,
                type: node.expression.type,
              };

              node.expression.update(token);

            }
          });

          source = ast2.toString().split('\n');

          source = source.map((line) => {
            const keys = Object.keys(expressionContainers);
            keys.forEach((key) => {
              const index = line.indexOf(key);
              if (index > -1) {
                const theExpression = expressionContainers[key];
                const parts = theExpression.formatted.split('\n').map((part, i) => {
                  if (i === 0) {
                    return part;
                  }
                  if (theExpression.type === 'TemplateLiteral') {
                    return part;
                  }
                  return new Array(index + 1).join(' ') + part;
                });

                // had to use split/join instead of plain replace because
                // '$' symbols in code were some how eaten by the replace op.
                line = line.split(key).join(parts.join('\n'));
                line = line.replace(/\s+$/, '');

                delete expressionContainers[key]; // esfmt-ignore-line
              }
            });
            return line.replace(/\s+$/, '');
          }).join('\n');

        }
        return source;
      },
    };

    return ins;
  },
};
