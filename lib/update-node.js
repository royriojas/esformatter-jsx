module.exports = function update( node, str ) {

  var newToken = {
    type: 'updatedNode', // can be anything (not used internally)
    value: str
  };
  // update linked list references
  if ( node.startToken.prev ) {
    node.startToken.prev.next = newToken;
    newToken.prev = node.startToken.prev;
  }
  if ( node.endToken.next ) {
    node.endToken.next.prev = newToken;
    newToken.next = node.endToken.next;
  }
  node.startToken = node.endToken = newToken;
};
