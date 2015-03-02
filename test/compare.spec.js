//jshint node:true, eqnull:true
/*global describe, it, before*/
'use strict';
var fs = require('fs');
var path = require('path');
var esformatter = require('esformatter');
var plugin = require('../');
var expect = require('chai').expect;

var readFile = function (folder, name) {
  var filePath = path.join('./test', folder, name);
  return fs.readFileSync(filePath).toString();
};

describe('esformatter-ignorejsx', function () {
  before(function () {
    esformatter.register(plugin);
  });

  describe('should ignore jsx blocks and properly format the rest of the code', function () {
    var files = fs.readdirSync('./test/fixtures/');
    files.forEach(function (file) {
      it('should transform fixture ' + file + ' and be equal expected file', function () {
        var input = readFile('fixtures', file);
        var opts = {};

        var isBug1 = file.match(/bug-1/);
        if (isBug1) {
          opts = {
            jsx: {
              attrsOnSameLineAsTag: !isBug1,
              maxAttrsOnTag: 1,
              firstAttributeOnSameLine: !!file.match(/keep-first-attribute/),
              alignWithFirstAttribute: !file.match(/align-attributes/)
            }
          };
        }
        var actual = esformatter.format(input, opts);

        var expected = readFile('expected', file);

        //if (isBug1) {
//          console.log('===========');
//          console.log(actual);
//          console.log('===========');
//        //}


       expect(actual).to.equal(expected, 'file comparison failed: ' + file);

      });
    });
  });

});