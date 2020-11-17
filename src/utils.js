const fs = require('fs');
const path = require('path');
const { exec, spawn } = require('child_process');

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

const executeCommand = (cmd) =>
  new Promise((resolve, reject) =>
    exec(cmd, (err, stdout, stderr) =>
      err ? reject({ err, stderr, stdout }) : resolve(stdout)
    )
  );

function copyToClipboard(data, msg = 'Copied to clipboard!') {
  const proc = spawn('pbcopy');
  proc.stdin.write(data);
  proc.stdin.end();

  msg && console.log(msg);
}

module.exports = { asyncMap, lookup, executeCommand, copyToClipboard };
