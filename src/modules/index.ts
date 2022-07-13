import * as vscode from 'vscode';

import type { ExtensionModule, InitConfig } from '../models';

import { RUN_COMMAND_MODULE } from './run-command';
import { STATUS_BAR_MODULE } from './status-bar';
import { ASSETS_RESX_MODULE } from './assets-resx';

const modules: ExtensionModule[] = [
  RUN_COMMAND_MODULE,
  STATUS_BAR_MODULE,
  ASSETS_RESX_MODULE,
];

export async function initExtension(context: vscode.ExtensionContext, config: InitConfig) {
  for (const module of modules) {
    await module.init(context, config);
  }
}

export { DinovelAssets } from './assets-resx';
