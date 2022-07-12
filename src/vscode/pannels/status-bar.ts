import * as vscode from 'vscode';
import type { Settings } from '../settings';

export const STATUS_BAR_ID = 'dinovel.statusBar';

export function activateStatusItem(config: Settings) {
  if (!config.status) { return; };

  const status = vscode.window.createStatusBarItem(
    STATUS_BAR_ID,
    vscode.StatusBarAlignment.Right,
    100);
  status.text = 'Dinovel';
  status.tooltip = 'Dinovel is enabled for this workspace.';
  status.command = 'dinovel.runCmd';
  status.show();
}
