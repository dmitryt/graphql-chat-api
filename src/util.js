const fs = require('fs');

function readTextFile(path) {
  return fs.readFileSync(path, 'utf8');
}

module.exports = {
  readTextFile,
};
