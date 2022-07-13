import * as vscode from 'vscode';
import { AssetsMap } from '../dinovel';

export const DinovelEvents = {
  assets: new vscode.EventEmitter<AssetsMap>(),
};
