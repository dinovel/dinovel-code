import * as vscode from 'vscode';
import { getWorkspaceFile } from '../../utils';
import { DinovelAssets } from './assets.tools';
import { DinovelResx } from './resx.tools';

export function buildAssetsWatcher(root: string) {
  const path = getWorkspaceFile('assetMap', root);
  const watcher = vscode.workspace.createFileSystemWatcher(path);
  watcher.onDidChange(() => DinovelAssets.update());
  watcher.onDidCreate(() => DinovelAssets.update());
  watcher.onDidDelete(() => DinovelAssets.update());
  return watcher;
}

export function buildResxWatcher(root: string) {
  const path = getWorkspaceFile('resxMap', root);
  const watcher = vscode.workspace.createFileSystemWatcher(path);
  watcher.onDidChange(() => DinovelResx.update());
  watcher.onDidCreate(() => DinovelResx.update());
  watcher.onDidDelete(() => DinovelResx.update());
  return watcher;
}
