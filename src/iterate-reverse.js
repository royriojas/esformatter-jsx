module.exports = function iterateReverse(arr, cb) {
  arr = arr || [];
  let idx = arr.length - 1;

  while (idx >= 0) {
    const item = arr[idx];
    cb(item, idx);
    idx--; // eslint-disable-line
  }
};
