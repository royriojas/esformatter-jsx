const esformatter = require('esformatter');
esformatter.register(require('../src/plugin'));
esformatter.register(require('esformatter-quotes'));
const chalk = require('chalk');
const fs = require('fs');
const mkdirp = require('mkdirp');
const path = require('path');
const jsdiff = require('diff');

const files = fs.readdirSync('./entry/');

files.forEach((file) => {
  const codeStr = fs.readFileSync(`./entry/${  file}`).toString();
  const options = {
    jsx: {
      formatJSX: true,
      attrsOnSameLineAsTag: true,
      maxAttrsOnTag: 3,
      firstAttributeOnSameLine: true,
      spaceInJSXExpressionContainers: ' ',
      alignWithFirstAttribute: false,
      formatJSXExpressions: true,
      JSXAttributeQuotes: 'single',
      htmlOptions: {
        brace_style: 'collapse',
        indent_char: ' ',
        indent_size: 2,
        max_preserve_newlines: 2,
        preserve_newlines: true,
      },
    },
    quotes: {
      type: 'single',
      avoidEscape: true,
    },
  };

  const formattedCode = esformatter.format(codeStr, options);

  mkdirp.sync('./result/');

  fs.writeFileSync(`./result/${  path.basename(file)}`, formattedCode);

  const reformattedCode = esformatter.format(formattedCode, options);
  if (formattedCode !== reformattedCode) {
    const diff = jsdiff.diffLines(formattedCode, reformattedCode);
    const parts = [];
    diff.forEach((part) => {
      // green for additions, red for deletions
      // grey for common parts
      const color = part.added ? 'green' : (part.removed ? 'red' : 'grey'); // eslint-ignore-line

      parts.push(chalk[color](part.value));
    });

    throw new Error(`Expected ${  file  } to reformat to the same result\n\n${  parts.join('')}`);
  }
  console.log(formattedCode);
});
