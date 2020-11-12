const fs = require('fs');
const path = require('path');

function lookup(file, dir = process.cwd()) {
  const p = path.join(dir, file);

  if (fs.existsSync(p)) return p;
  if (!dir) return console.log('config not found');

  const newDir = dir.split(path.sep);
  newDir.pop();

  return lookup(file, newDir.join(path.sep));
}

const asyncMap = async (arr, cb) =>
  arr.reduce(
    (acc, item) =>
      acc.then((res) => cb(item).then((mapped) => [...res, mapped])),
    Promise.resolve([])
  );

module.exports = { asyncMap, lookup };
