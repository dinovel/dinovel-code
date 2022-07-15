import * as vscode from 'vscode';

import { AppNames } from '../../infra';
import { ResourceTreeItem, ResourceTarget, ResourceGroup, AssetTree } from '../../models';
import { DinovelResx, writeResxMap } from './resx.tools';

export function iniResxCommands(context: vscode.ExtensionContext, appRoot: string) {
  context.subscriptions.push(buildCmdAddResourceGroup(appRoot));
  context.subscriptions.push(buildCmdRemoveResourceGroup(appRoot));
  context.subscriptions.push(buildCmdEditResourceGroup(appRoot));
  context.subscriptions.push(buildCmdAddResourceFromAsset(appRoot));
  context.subscriptions.push(buildCmdRemoveResource(appRoot));
  context.subscriptions.push(buildCmdEditResource(appRoot));
}

function buildCmdAddResourceGroup(root: string) {
  return vscode.commands.registerCommand(
    AppNames.commands.addResourceGroup,
    async () => {
      const rgName = await vscode.window.showInputBox({
        placeHolder: 'Enter resource group name',
        title: 'New resource group'
      });

      if (!rgName) { return; }

      const resx = DinovelResx.value;
      const exists = !!resx[rgName];
      if (exists) {
        vscode.window.showErrorMessage(`Resource group ${rgName} already exists`);
        return;
      }

      resx[rgName] = { };
      writeResxMap(resx, root);

    });
}

function buildCmdRemoveResourceGroup(root: string) {
  return vscode.commands.registerCommand(
    AppNames.commands.removeResourceGroup,
    async (main?: ResourceTreeItem, selected?: ResourceTreeItem[]) => {
      const toRemove = getResourceList('group', main, selected);
      if (!toRemove.length) { return; }

      const resx = DinovelResx.value;
      let hasContent = false;
      for (const rg of toRemove) {
        if (Object.keys(resx[rg.name]).length) {
          hasContent = true;
          break;
        }
      }

      if (hasContent) {
        const confirmation = await vscode.window.showWarningMessage(
          'Some resources are still in this group. Are you sure you want to delete it?',
          'Yes', 'No');
        if (confirmation !== 'Yes') { return; }
      }

      for (const rg of toRemove) {
        delete resx[rg.name];
      }

      writeResxMap(resx, root);

    });
}

function buildCmdEditResourceGroup(root: string) {
  return vscode.commands.registerCommand(
    AppNames.commands.editResourceGroup,
    async (main?: ResourceTreeItem, selected?: ResourceTreeItem[]) => {
      const toEdit = getResourceList('group', main, selected);
      if (toEdit.length !== 1) { return; }

      const name = toEdit[0].name;

      const nextName = await vscode.window.showInputBox({
        placeHolder: 'Enter resource group name',
        title: 'Edit resource group',
        value: name
      });

      if (!nextName || name === nextName) { return; }

      const resx = DinovelResx.value;

      if(!!resx[nextName]) {
        vscode.window.showErrorMessage(`Resource group ${nextName} already exists`);
        return;
      }

      resx[nextName] = resx[name];
      delete resx[name];

      writeResxMap(resx, root);
    });
}

function buildCmdAddResourceFromAsset(appRoot: string) {
  return vscode.commands.registerCommand(
    AppNames.commands.addResourceFromAsset,
    async (main?: AssetTree) => {
      const resx = DinovelResx.value;
      const groups = Object.keys(DinovelResx.value);
      if (!main || main.type !== 'asset' || !groups.length) { return; }

      const toAdd = await vscode.window.showQuickPick(groups, {
        canPickMany: true,
        title: 'Select resource groups to add to'
      });

      if (!toAdd || !toAdd.length) { return; }

      const name = await vscode.window.showInputBox({
        prompt: 'Enter resource name',
        placeHolder: 'Enter resource name',
        title: 'New resource'
      });

      if (!name) { return; }

      toAdd.forEach(e => resx[e][name] = main.id);

      writeResxMap(resx, appRoot);
    }
  );
}

function buildCmdRemoveResource(appRoot: string) {
  return vscode.commands.registerCommand(
    AppNames.commands.removeResource,
    async (main?: ResourceTreeItem, selected?: ResourceTreeItem[]) => {
      const toRemove = getResourceList('target', main, selected);
      if (!toRemove.length) { return; }

      const resx = DinovelResx.value;
      for (const rg of toRemove) {
        const group = resx[rg.parent];
        if (group) { delete group[rg.name]; }
      }

      writeResxMap(resx, appRoot);
    }
  );
}

function buildCmdEditResource(appRoot: string) {
  return vscode.commands.registerCommand(
    AppNames.commands.editResource,
    async (main?: ResourceTreeItem, selected?: ResourceTreeItem[]) => {
      const toEdit = getResourceList('target', main, selected);
      if (toEdit.length !== 1) { return; }

      const name = toEdit[0].name;

      const nextName = await vscode.window.showInputBox({
        placeHolder: 'Enter resource name',
        title: 'Edit resource',
        value: name
      });

      if (!nextName || name === nextName) { return; }

      const resx = DinovelResx.value;
      const group = resx[toEdit[0].parent];
      if (group) {
        group[nextName] = group[name];
        delete group[name];
      }

      writeResxMap(resx, appRoot);
    }
  );
}

function getResourceList(kind: 'target', main?: ResourceTreeItem, selected?: ResourceTreeItem[]): ResourceTarget[];
function getResourceList(kind: 'group', main?: ResourceTreeItem, selected?: ResourceTreeItem[]): ResourceGroup[];
function getResourceList(kind: 'target' | 'group', main?: ResourceTreeItem, selected?: ResourceTreeItem[]): ResourceTreeItem[] {
  const src = selected ?? [];
  if (!src.length && main) {
    src.push(main);
  }
  return src.filter(e => e.type === kind);
}
