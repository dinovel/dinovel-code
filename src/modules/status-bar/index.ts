import * as vscode from 'vscode';

import type { ExtensionModule } from '../../models';
import { AppNames } from '../../infra';

export const STATUS_BAR_MODULE: ExtensionModule = {
  init: async (_, {settings}) => {
    if (!settings.enabled || !settings.status) { return; }

    const status = vscode.window.createStatusBarItem(
      AppNames.statusBar.main,
      vscode.StatusBarAlignment.Right,
      100);
    status.text = 'Dinovel';
    status.tooltip = 'Dinovel is enabled for this workspace.';
    status.command = AppNames.commands.runCommand;
    status.show();
  }
};
