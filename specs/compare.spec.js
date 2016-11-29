// jshint node:true, eqnull:true
/* global describe, it, before*/

'use strict';

const fs = require('fs');
const path = require('path');
const esformatter = require('esformatter');
const plugin = require('../src/plugin');
const readJSON = require('read-json-sync');

const readFile = function readFile(folder, name) {
  const filePath = path.join('./specs', folder, name);
  return fs.readFileSync(filePath).toString();
};

const readJSONSync = function readJSONSync(folder, name) {
  name = path.basename(name, '.js');
  const filePath = path.join('./specs', folder, `${name  }.json`);
  let json = { };
  try {
    json = readJSON(filePath);
  } catch (ex) {
    // console.error('error reading file ', name, ex.message);
  }
  return json;
};

describe('esformatter-jsx', () => {
  before(() => {
    esformatter.register(plugin);
  });

  describe('format jsx blocks', () => {
    const files = fs.readdirSync('./specs/fixtures/');

    // files = files.filter( function ( file ) {
    //   return file.match( /bug-30/ );
    // } );

    files.forEach((file) => {
      it(`should transform fixture ${  file  } and be equal expected file`, () => {
        const input = readFile('fixtures', file);
        const opts = readJSONSync('options', file);

        const actual = esformatter.format(input, opts);
        const expected = readFile('expected', file);
        // console.log( '\n\n', actual, '\n\n' );
        // fs.writeFileSync('./specs/expected/' + path.basename(file), actual);

        expect(actual).to.equal(expected, `file comparison failed: ${  file}`);

      });
    });
  });

});
