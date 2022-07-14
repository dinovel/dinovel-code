import * as vscode from 'vscode';
import { getWorkspaceFile } from '../../utils';
import { DinovelAssets } from './assets.tools';

export function buildAssetsWatcher(root: string) {
  const path = getWorkspaceFile('assetMap', root);
  const watcher = vscode.workspace.createFileSystemWatcher(path);
  watcher.onDidChange(() => DinovelAssets.update());
  watcher.onDidCreate(() => DinovelAssets.update());
  watcher.onDidDelete(() => DinovelAssets.update());
  return watcher;
}
