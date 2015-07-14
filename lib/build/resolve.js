'use strict';

var exists = require('fs').existsSync;
var stat = require('fs').statSync;
var join = require('path').join;

module.exports = function(file) {
  if (isFile(file)) return file;
  if (isFile(file + '.js')) return file + '.js';

  if (isDirectory(file)) {
    var newFile = join(file, 'index.js');
    if (isFile(newFile)) return newFile;
  }

  return file;
};

function isFile(file) {
  return exists(file) && stat(file).isFile();
}

function isDirectory(file) {
  return exists(file) && stat(file).isDirectory();
}

