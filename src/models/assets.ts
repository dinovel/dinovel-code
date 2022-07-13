import type { AssetsMap, AssetCategory } from '../dinovel';

export const ASSETS_CATEGORIES: AssetCategory[] = ['background', 'sprite', 'ui', 'portrait', 'music', 'sfx', 'video', 'animation', 'logo', 'asset'];
export const ASSETS_TYPES: string[] = ['image', 'audio', 'video', 'unknown'];

export interface MergeAssetsResult {
  result: AssetsMap;
  added: number;
  deleted: number;
  unchanged: number;
  updated: number;
}

export interface MergeAssetOptions {
  /** Workspace root folder */
  appRoot?: string;
  /** Update tag list */
  updateTags?: boolean;
  /** Update category */
  updateCategory?: boolean;
  /** Update type */
  updateType?: boolean;
  /** Don't remove missing assets */
  keepMissing?: boolean;
}
