//jshint node:true, eqnull:true
/*global describe, it, before*/
'use strict';
var fs = require('fs');
var path = require('path');
var esformatter = require('esformatter');
var plugin = require('../');
var expect = require('chai').expect;
var readJSON = require('read-json-sync');

var readFile = function (folder, name) {
  var filePath = path.join('./test', folder, name);
  return fs.readFileSync(filePath).toString();
};

var readJSONSync = function (folder, name) {
  name = path.basename(name, '.js');
  var filePath = path.join('./test', folder, name +'.json');
  var json = {};
  try {
    json = readJSON(filePath);
  }
  catch(ex) {
    //console.error('error reading file ', name, ex.message);
  }
  return json;
};



describe('esformatter-ignorejsx', function () {
  before(function () {
    esformatter.register(plugin);
  });

  describe('should ignore jsx blocks and properly format the rest of the code', function () {
    var files = fs.readdirSync('./test/fixtures/');

//    files = files.filter(function (file) {
//      return file.match(/unformatted/);
//    });

    files.forEach(function (file) {
      it('should transform fixture ' + file + ' and be equal expected file', function () {
        var input = readFile('fixtures', file);
        var opts = {};

        opts = readJSONSync('options', file);

        var actual = esformatter.format(input, opts);
        var expected = readFile('expected', file);

//        if (file.match(/long-text/)) {
//          console.log('===========');
//          console.log(actual);
//          console.log('===========');
//        }

       expect(actual).to.equal(expected, 'file comparison failed: ' + file);

      });
    });
  });

});