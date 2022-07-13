import * as path from 'path';
import { randomUUID } from 'crypto';

import { AssetCategory, Asset, AssetType, DEFAULT_EXTENSIONS, ASSETS_PREFIX } from '../dinovel';
import { ASSETS_CATEGORIES, AssetTree, AssetTreeAsset, AssetTreeCategory, AssetTreeTag } from '../models';
import { getWorkspaceFolder } from './workspace';

export function isAssetCategory(e: unknown): e is AssetCategory {
  return ASSETS_CATEGORIES.includes(e as AssetCategory);
}

export function isAssetTreeCategory(e: AssetTree): e is AssetTreeCategory {
  return e.type === 'category';
}

export function isAssetTreeAsset(e: AssetTree): e is AssetTreeAsset {
  return e.type === 'asset';
}

export function isAssetTreeTag(e: AssetTree): e is AssetTreeTag {
  return e.type === 'tag';
}

export function buildAsset(assetPath: string, assetsFolder?: string): Asset {
  const folder = assetsFolder || getWorkspaceFolder('assets');
  const [type, category, tags] = parseAssetPath(assetPath);
  const relPath = assetPath.replace(folder, ASSETS_PREFIX).replace(/\\/g, '/');

  return {
    id: randomUUID(),
    path: relPath,
    category,
    tags,
    type
  };
}

export function parseAssetPath(assetPath: string): [AssetType, AssetCategory, string[]] {
  const ext = path.extname(assetPath);
  const name = path.basename(assetPath, ext);

  const [cat, ...tags] = name.split('_').filter(e => e);
  if (!isAssetCategory(cat)) { tags.unshift(cat); }
  const type = findAssetType(ext);
  const category: AssetCategory = isAssetCategory(cat) ? cat : 'asset';
  return [type, category, tags];
}

export function findAssetType(ext: string): AssetType {
  for (const [k, v] of Object.entries(DEFAULT_EXTENSIONS)) {
    if (v.includes(ext)) {
      return k as AssetType;
    }
  }
  return 'unknown';
}
