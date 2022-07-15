/* Inject command and views for assets and resources */
import * as vscode from 'vscode';

import type { ExtensionModule } from '../../models';
import { AppNames, DinovelEvents } from '../../infra';
import { DinovelAssets } from './assets.tools';
import { DinovelResx } from './resx.tools';
import { AssetsTreeViewProvider } from './assets.provider';

import { iniAssetsCommands } from './assets.cmd';
import { iniResxCommands } from './resx.cmd';
import { buildAssetsWatcher, buildResxWatcher } from './watcher';
import { ResxTreeViewProvider } from './resx.provider';

export const ASSETS_RESX_MODULE: ExtensionModule = {
  init: async (context, { workspace }) => {
    iniAssetsCommands(context, workspace);
    iniResxCommands(context, workspace);
    context.subscriptions.push(buildAssetsView());
    context.subscriptions.push(buildResourcesView());
    context.subscriptions.push(buildAssetsWatcher(workspace));
    context.subscriptions.push(buildResxWatcher(workspace));
    DinovelEvents.assets.event(() => DinovelResx.update());
    DinovelAssets.update();
  }
};

function buildAssetsView() {
  const provider = new AssetsTreeViewProvider();
  const treeView = vscode.window.createTreeView(AppNames.views.assets, {
    treeDataProvider: provider,
    canSelectMany: true,
  });
  return treeView;
}

function buildResourcesView() {
  const provider = new ResxTreeViewProvider();
  const treeView = vscode.window.createTreeView(AppNames.views.resources, {
    treeDataProvider: provider,
    canSelectMany: true,
  });
  return treeView;
}
