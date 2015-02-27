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
        var format = !!file.match(/format-jsx/);
        var actual = esformatter.format(input);

        var expected = readFile('expected', file);

//        console.log('===========');
//        console.log(actual);
//        console.log('===========');

       expect(actual).to.equal(expected, 'file comparison failed: ' + file);

      });
    });
  });

});