export const AppNames = {
  commands: {
    reloadAssets: 'dinovel.reloadAssets',
    reloadResources: 'dinovel.reloadResources',
    addAssetTag: 'dinovel.addAssetTag',
    removeAssetTag: 'dinovel.removeAssetTag',
    editAssetTag: 'dinovel.editAssetTag',
    addResourceFromAsset: 'dinovel.addResourceFromAsset',
    editResource: 'dinovel.editResource',
    removeResource: 'dinovel.removeResource',
    addResourceGroup: 'dinovel.addResourceGroup',
    editResourceGroup: 'dinovel.editResourceGroup',
    removeResourceGroup: 'dinovel.removeResourceGroup',
    runCommand: 'dinovel.runCommand',
  },
  views: {
    assets: 'dinovel-assets',
    resources: 'dinovel-resources',
  },
  statusBar: {
    main: 'dinovel-statusBar'
  },
  context: {
    asset: 'dinovel-asset-item',
    assetTag: 'dinovel-asset-tag',
    resx: 'dinovel-resx-target',
    resxGroup: 'dinovel-resx-group',
  }
};

export const AppLabels = {
  [AppNames.commands.reloadAssets]: 'Reload assets',
  [AppNames.commands.reloadResources]: 'Reload resources',
};
