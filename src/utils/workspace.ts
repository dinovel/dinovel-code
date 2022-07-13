import * as vscode from 'vscode';
import * as path from 'path';

import { cleanWindowsPath, ensureDir } from './paths';
import { AppPaths, AppFilePaths, AppFiles } from '../infra';

export function selectUniqueWorkspace(): string | undefined {
  const wk = vscode.workspace.workspaceFolders;
  if (!wk?.length) { return undefined; }

  if (wk.length > 0) { return cleanWindowsPath(wk[0].uri.path); }

  return undefined;
}

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

export function getWorkspaceFolder(name: keyof typeof AppPaths, appRoot?: string, ensureDirExists?: boolean): string {
  const rootPath = appRoot || selectUniqueWorkspace();
  if (!rootPath) { throw new Error('No workspace folder available'); }
  const folder = path.join(rootPath, AppPaths[name]);
  if (ensureDirExists) { ensureDir(folder); }
  return folder;
}

export function getWorkspaceFile(name: keyof typeof AppFiles, appRoot?: string, ensureDirExists?: boolean): string {
  const rootPath = appRoot || selectUniqueWorkspace();
  if (!rootPath) { throw new Error('No workspace folder available'); }
  const folder = getWorkspaceFolder(AppFilePaths[name], rootPath, ensureDirExists);
  return path.join(folder, AppFiles[name]);
}
