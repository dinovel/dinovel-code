import * as vscode from 'vscode';
import { AssetsMap } from '../dinovel';
import { ResourceMap } from '../models';

export const DinovelEvents = {
  assets: new vscode.EventEmitter<AssetsMap | undefined>(),
  resx: new vscode.EventEmitter<ResourceMap | undefined>(),
};
