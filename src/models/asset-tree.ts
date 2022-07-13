import { AssetType, AssetCategory } from '../dinovel';

export type AssetTree =
  AssetTreeCategory
| AssetTreeAsset
| AssetTreeTag;
;

export interface AssetTreeCategory {
  type: 'category';
  name: AssetCategory;
}

export interface AssetTreeAsset {
  type: 'asset';
  id: string;
  name: string;
  kind: AssetType;
}

export interface AssetTreeTag {
  type: 'tag';
  id: string;
  name: string;
}
