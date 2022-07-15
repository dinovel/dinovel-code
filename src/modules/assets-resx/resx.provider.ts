import * as vscode from 'vscode';

import { AppNames, DinovelEvents } from '../../infra';
import { ResourceMap, ResourceGroup, ResourceTarget, ResourceTreeItem } from '../../models';
import { isResourceGroup } from '../../utils/resx';
import { DinovelAssets } from './assets.tools';
import { DinovelResx } from './resx.tools';

export class ResxTreeViewProvider implements vscode.TreeDataProvider<ResourceTreeItem> {
  get onDidChangeTreeData() {
    return DinovelEvents.resx.event as unknown as vscode.Event<ResourceTreeItem | undefined>;
  }

  getTreeItem(element: ResourceTreeItem): vscode.TreeItem | Thenable<vscode.TreeItem> {
    switch (element.type) {
      case 'group': return buildResxGroupItem(element);
      case 'target': return buildResxTargetItem(element);
    }
  }

  getChildren(element?: ResourceTreeItem | undefined): vscode.ProviderResult<ResourceTreeItem[]> {
    if(!element) { return buildResxGroups(); }

    if (isResourceGroup(element)) {
      return buildResxTargets(element.name);
    }

    return [];
  }
}

function buildResxTargetItem(e: ResourceTarget): vscode.TreeItem {
  return {
    id: `target:${e.parent}:${e.name}`,
    label: e.name,
    tooltip: `Resource target: ${e.target}`,
    iconPath: getTargetIcon(e.valid),
    collapsibleState: vscode.TreeItemCollapsibleState.None,
    contextValue: AppNames.context.resx,
  };
}

function buildResxGroupItem(e: ResourceGroup): vscode.TreeItem {
  return {
    id: `group:${e.name}`,
    label: e.name,
    tooltip: `Resource group: ${e.name}`,
    iconPath: getRGIcon(e.name),
    collapsibleState: vscode.TreeItemCollapsibleState.Collapsed,
    contextValue: AppNames.context.resxGroup,
  };
}

function getTargetIcon(valid: boolean): vscode.ThemeIcon {
  return valid
    ? new vscode.ThemeIcon('symbol-constant')
    : new vscode.ThemeIcon('error', new vscode.ThemeColor('errorForeground'));
}

function getRGIcon(name: string): vscode.ThemeIcon {
  const hasInvalid = buildResxTargets(name)
    .filter(e => !e.valid).length > 0;

  return hasInvalid
    ? new vscode.ThemeIcon('error', new vscode.ThemeColor('errorForeground'))
    : new vscode.ThemeIcon('symbol-constructor');
}

function buildResxGroups(): ResourceGroup[] {
  return Object.keys(DinovelResx.value)
    .map(e => ({
      type: 'group',
      name: e,
    }));
}

function buildResxTargets(group: string): ResourceTarget[] {
  return Object.entries(DinovelResx.value[group])
    .map(([name, value]) => ({
      type: 'target',
      name: name,
      target: value,
      valid: !!DinovelAssets.value[value],
      parent: group,
    }));
}
