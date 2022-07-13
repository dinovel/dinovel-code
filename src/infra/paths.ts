import * as path from 'path';

export const AppPaths = {
  src: 'src',
  resx: 'src/resx',
  assets: 'assets',
};

export const AppFiles = {
  assetMap: 'assets.map.ts',
  resxMap: 'resx.map.ts',
};

type IAppFilesPaths = {
  [key in keyof typeof AppFiles]: keyof typeof AppPaths;
};

export const AppFilePaths: IAppFilesPaths = {
  assetMap: 'resx',
  resxMap: 'resx',
};
