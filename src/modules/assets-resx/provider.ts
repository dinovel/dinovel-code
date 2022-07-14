import * as vscode from 'vscode';
import * as path from 'path';

import { AppNames, DinovelEvents } from '../../infra';
import { AssetTree, AssetTreeAsset, AssetTreeCategory, AssetTreeTag } from '../../models';
import { isAssetTreeCategory, isAssetTreeAsset } from '../../utils/assets';
import { DinovelAssets } from './assets.tools';
import { AssetType } from '../../dinovel';

export class AssetsTreeViewProvider implements vscode.TreeDataProvider<AssetTree> {

  get onDidChangeTreeData() {
    return DinovelEvents.assets.event as unknown as vscode.Event<AssetTree | undefined>;
  }

  getTreeItem(element: AssetTree): vscode.TreeItem | Thenable<vscode.TreeItem> {
    switch (element.type) {
      case 'category': return buildCategoryItem(element);
      case 'asset': return buildAssetItem(element);
      case 'tag': return buildTagItem(element);
    };
  }
  getChildren(element?: AssetTree | undefined): vscode.ProviderResult<AssetTree[]> {
    if (!element) { return getRoot(); }

    if (isAssetTreeCategory(element)) {
      return getCategory(element);
    }

    if (isAssetTreeAsset(element)) {
      return getTags(element.id);
    }

    return [];
  }
}

function buildCategoryItem(e: AssetTreeCategory): vscode.TreeItem {
  return {
    id: e.name,
    label: e.name.toUpperCase(),
    tooltip: `Asset category: ${e.name}`,
    iconPath: new vscode.ThemeIcon('symbol-folder'),
    collapsibleState: vscode.TreeItemCollapsibleState.Collapsed,
  };
}

function buildAssetItem(e: AssetTreeAsset): vscode.TreeItem {
  const basename = path.basename(e.name);
  const name = basename.split('__')[1] ?? basename;

  return {
    id: e.id,
    label: name,
    tooltip: `Type: ${e.kind}`,
    iconPath: getIcon(e.kind),
    collapsibleState: vscode.TreeItemCollapsibleState.Collapsed,
    contextValue: AppNames.context.asset,
  };
}

function buildTagItem(e: AssetTreeTag): vscode.TreeItem {
  return {
    id: e.name,
    label: e.name.toUpperCase(),
    tooltip: `Asset tag: ${e.name}`,
    iconPath: new vscode.ThemeIcon('tag'),
    collapsibleState: vscode.TreeItemCollapsibleState.None,
    contextValue: AppNames.context.assetTag,
  };
}

function getIcon(e: AssetType): vscode.ThemeIcon {
  switch (e) {
    case 'audio': return new vscode.ThemeIcon('unmute');
    case 'image': return new vscode.ThemeIcon('file-media');
    case 'video': return new vscode.ThemeIcon('device-camera-video');
    case 'unknown': return new vscode.ThemeIcon('symbol-file');
  };
}

function getRoot(): AssetTreeCategory[] {
  const catList = Object.values(DinovelAssets.value).map(e => e.category);

  return [...new Set(catList)]
    .map(e => ({
      type: 'category',
      name: e,
    }));
}

function getCategory(e: AssetTreeCategory): AssetTreeAsset[] {
  console.error('getItems', DinovelAssets.value);
  return Object.values(DinovelAssets.value)
    .filter(a => a.category === e.name)
    .map(a => ({
      type: 'asset',
      id: a.id,
      kind: a.type,
      name: a.path,
    }));
}

function getTags(id: string): AssetTreeTag[] {
  console.error('getTags', DinovelAssets.value[id]?.tags);
  return (DinovelAssets.value[id]?.tags ?? [])
    .map(e => ({
      type: 'tag',
      id,
      name: e,
    }));
}
