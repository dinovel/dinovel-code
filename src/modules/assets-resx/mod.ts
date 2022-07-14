/* Inject command and views for assets and resources */
import * as vscode from 'vscode';

import type { ExtensionModule } from '../../models';
import { AppNames } from '../../infra';
import { reloadAssets, DinovelAssets } from './assets.tools';
import { AssetsTreeViewProvider } from './provider';

import {
  buildAddTagCommand,
  buildDelTagCommand,
} from './commands';

export const ASSETS_RESX_MODULE: ExtensionModule = {
  init: async (context, { workspace }) => {
    context.subscriptions.push(buildReloadAssetsCmd(workspace));
    context.subscriptions.push(buildAddTagCommand());
    context.subscriptions.push(buildDelTagCommand());
    context.subscriptions.push(buildAssetsView());
    DinovelAssets.update();
  }
};

function buildReloadAssetsCmd(rootPath: string) {
  return vscode.commands.registerCommand(AppNames.commands.reloadAssets, () => {
    const res = reloadAssets(rootPath);
    const message = `${res.added} added, ${res.updated} updated, ${res.deleted} deleted, ${res.unchanged} skipped`;
    vscode.window.showInformationMessage(message);
  });
}

function buildAssetsView() {
  const provider = new AssetsTreeViewProvider();
  const treeView = vscode.window.createTreeView(AppNames.views.assets, {
    treeDataProvider: provider,
    canSelectMany: true,
  });
  return treeView;
}
