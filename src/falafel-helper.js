const opts = require('./parser-options');
const babylon = require('babylon');

function insertHelpers(node, parent, chunks) {
  node.parent = parent;
  node.source = function source() {
    return chunks.slice(node.start, node.end).join('');
  };
  function update(s) {
    chunks[node.start] = s;
    for (let i = node.start + 1; i < node.end; ++i) {
      chunks[i] = '';
    }
  }
  if (node.update && typeof node.update === 'object') {
    const prev = node.update;
    Object.keys(prev).forEach((key) => {
      update[key] = prev[key];
    });
  }
  node.update = update;
}

module.exports = function falafelHelper(str, cb) {
  // module.exports = function (src, opts, fn) {
  if (str && typeof str === 'object' && str.constructor.name === 'Buffer') {
    str = str.toString();
  }
  if (typeof str !== 'string') {
    str = String(str);
  }
  const ast = babylon.parse(str, opts);
  const result = {
    chunks: str.split(''),
    inspect() {
      return result.toString();
    },
    toString() {
      return result.chunks.join('');
    },
  };
  function walk(node, parent) {
    insertHelpers(node, parent, result.chunks);
    Object.keys(node).forEach((key) => {
      if (key === 'parent') {
        return;
      }
      const child = node[key];
      if (Array.isArray(child)) {
        child.forEach((c) => {
          if (c && typeof c.type === 'string') {
            walk(c, node);
          }
        });
      } else if (child && typeof child.type === 'string') {
        walk(child, node);
      }
    });
    cb(node);
  }
  walk(ast);
  return result;
};
