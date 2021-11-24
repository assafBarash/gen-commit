import fs from 'fs';
import path from 'path';
import { spawn } from 'child_process';

export function lookup(file: string, dir: string = process.cwd()): string {
  const p = path.join(dir, file);

  if (fs.existsSync(p)) return p;
  if (!dir) return '';

  const newDir = dir.split(path.sep);
  newDir.pop();

  return lookup(file, newDir.join(path.sep));
}

export const asyncMap = async <T, K>(arr: T[], cb: (item: T) => Promise<K>) =>
  arr.reduce(
    (acc: Promise<K[]>, item) =>
      acc.then((res) => cb(item).then((mapped) => [...res, mapped])),
    Promise.resolve([])
  );

export function copyToClipboard(data: string, msg = 'Copied to clipboard!') {
  const proc = spawn('pbcopy');
  proc.stdin.write(data);
  proc.stdin.end();

  msg && console.log(msg);
}
