import * as fs from 'fs';
import * as path from 'path';

import type { LocalFile } from '../models';

export function cleanWindowsPath(path: string): string {
  if (!path || !path.startsWith('/')) { return path; }
  const isWindows = /^win/.test(process.platform);
  if (!isWindows) { return path; }
  return path.substring(1);
}

export function listAllFiles(target: string) {
  const files = fs.readdirSync(target);
  const result: LocalFile[] = [];
  for (const file of files) {
    const fullPath = path.join(target, file);
    const stat = fs.statSync(fullPath);
    if (stat.isDirectory()) {
      result.push(...listAllFiles(fullPath));
    } else {
      const extension = path.extname(fullPath);
      result.push({
        path: fullPath,
        extension,
        name: path.basename(fullPath, extension)
      });
    }
  }
  return result;
}

export function ensureDir(dir: string) {
  if (fs.existsSync(dir)) { return; }
  fs.mkdirSync(dir, { recursive: true });
}
