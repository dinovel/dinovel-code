import * as vscode from 'vscode';

import { initExtension } from './modules';
import { selectUniqueWorkspace } from './utils';
import { loadSettings } from './infra';

export function activate(context: vscode.ExtensionContext) {
  const workspace = selectUniqueWorkspace();
  const settings = loadSettings();

  if (!workspace) { throw new Error('No workspace found'); }

  initExtension(context, {
    settings,
    workspace,
  });
}

export function deactivate() {}
