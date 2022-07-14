import * as vscode from 'vscode';
import { AssetTree, AssetTreeAsset, AssetTreeTag } from '../../models';
import { AppNames } from '../../infra';
import { DinovelAssets, updateAssets } from './assets.tools';
import { Asset } from '../../dinovel';

export function buildAddTagCommand() {
  return vscode.commands.registerCommand(
    AppNames.commands.addAssetTag, async (main?: AssetTree, selected?: AssetTree[]) => {
      const ids = getAssetTreeInput('asset', main, selected)
        .map(e => e.id);

      if (!ids.length) { return; }

      const tag = await vscode.window.showInputBox({
        title: 'Enter tags (use space to separate)',
        placeHolder: 'tag1 tag2 tag3'
      });

      if (!tag) { return; }

      const tags = tag.toLowerCase().split(' ');

      const toUpdate: Asset[] = [];

      for (const id of ids) {
        let asset = DinovelAssets.value[id];
        if (asset) {
          asset = {
            ...asset,
            tags: [...new Set([...asset.tags, ...tags])]
          };
          toUpdate.push(asset);
        }
      }

      updateAssets(toUpdate);
  });
}

export function buildDelTagCommand() {
  return vscode.commands.registerCommand(
    AppNames.commands.removeAssetTag, async (main?: AssetTree, selected?: AssetTree[]) => {
      const toRemove = getAssetTreeInput('tag', main, selected);
      if (!toRemove.length) { return; }

      const toUpdate: Record<string, Asset> = {};
      for (const tag of toRemove) {
        let asset = toUpdate[tag.id] ?? DinovelAssets.value[tag.id];
        if (!asset) { return; }

        asset = {
          ...asset,
          tags: asset.tags.filter(e => e !== tag.name)
        };

        toUpdate[asset.id] = asset;
      }

      const updateValues = Object.values(toUpdate);
      if (!updateValues.length) { return; }
      updateAssets(updateValues);
    }
  );
}

function getAssetTreeInput(kind: 'asset', main?: AssetTree, selected?: AssetTree[]): AssetTreeAsset[];
function getAssetTreeInput(kind: 'tag', main?: AssetTree, selected?: AssetTree[]): AssetTreeTag[];
function getAssetTreeInput(kind: 'asset' | 'tag', main?: AssetTree, selected?: AssetTree[]): AssetTree[] {
  const src = selected ?? [];
  if (!src.length && main) {
    src.push(main);
  }
  return src.filter(e => e.type === kind);
}
