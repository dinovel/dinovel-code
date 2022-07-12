import * as vscode from 'vscode';

export async function selectWorkspaceFolder(): Promise<string | undefined> {
  const wk = vscode.workspace.workspaceFolders;
  if (!wk?.length) { return undefined; }

  if (wk.length === 1) { return cleanWindowsPath(wk[0].uri.path); }

  const wkNames = wk.map(w => w.name);

  return await vscode.window.showQuickPick(wkNames, {
    canPickMany: false,
    title: 'Select workspace folder'
  });
}

export function cleanWindowsPath(path: string): string {
  if (!path || !path.startsWith('/')) { return path; }
  const isWindows = /^win/.test(process.platform);
  if (!isWindows) { return path; }
  return path.substring(1);
}

import * as fs from 'fs';
import * as path from 'path';

export interface LocalFile {
  path: string;
  extension: string;
  name: string;
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
